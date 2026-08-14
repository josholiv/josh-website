#!/usr/bin/env node
/**
 * Sync book metadata from my local reading notes into this repo.
 *
 * Only frontmatter is published. The note body — personal reading notes — is
 * matched away by the regex below and never reaches the output. On top of that,
 * output fields come from an explicit allowlist (FIELDS), so a new property in
 * the note template can't silently start publishing itself.
 *
 * Writes one JSON file per finished book to src/data/books/, and copies each
 * cover into src/assets/book-covers/. Both directories are owned entirely by
 * this script, which deletes anything in them it did not just generate — so
 * removing a book from the notes removes it from the site.
 *
 * Writes are incremental: a file is only touched when its content actually
 * changed. Rewriting hundreds of unchanged files on every run reads to a
 * file-syncing service as a delete + recreate storm, which it can resolve into
 * " 2" conflict copies that then load as duplicate books. Keeping writes
 * minimal avoids that, and limits git diffs to books that genuinely changed.
 *
 * Configured entirely through the environment, so no local paths appear in
 * this repo. Set these in .env (gitignored):
 *
 *   BOOK_NOTES_DIR     directory holding the note files          (required)
 *   BOOK_ASSETS_ROOT   root that cover paths resolve against
 *                      (defaults to BOOK_NOTES_DIR's parent)
 */

import { readdir, readFile, writeFile, mkdir, copyFile, unlink, stat } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DATA = path.join(ROOT, 'src/data/books');
const OUT_COVERS = path.join(ROOT, 'src/assets/book-covers');

const COVER_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const READ_STATUS = 'done';

// Frontmatter only: non-greedy, so it stops at the first closing delimiter.
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

const notesDir = process.env.BOOK_NOTES_DIR;
if (!notesDir) {
  console.error('BOOK_NOTES_DIR is not set. Add it to .env — see the header of this file.');
  process.exit(1);
}
if (!existsSync(notesDir)) {
  console.error('BOOK_NOTES_DIR does not point at an existing directory.');
  process.exit(1);
}
// Cover paths in the notes are written relative to this root.
const assetsRoot = process.env.BOOK_ASSETS_ROOT || path.dirname(notesDir);

const asString = v => {
  if (v == null) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
};

const asArray = v => {
  const items = Array.isArray(v) ? v : [v];
  return items.map(asString).filter(Boolean);
};

const asNumber = v => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const s = asString(v);
  if (s === null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

// Keep dates as plain YYYY-MM-DD strings — no Date objects, so no timezone drift.
const asDate = v => asString(v)?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? null;

const slugify = s =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * The published shape. Anything not listed here stays in the notes.
 * `datesRead` absorbs dateRead, dateRead2, dateRead3, ... so a fourth reread
 * needs a note edit only, not a code change.
 */
const FIELDS = fm => ({
  title: asString(fm.title),
  subtitle: asString(fm.subtitle),
  author: asArray(fm.author),
  authorCountry: asString(fm.authorCountry)?.toUpperCase() ?? null,
  category: asArray(fm.category),
  publisher: asString(fm.publisher),
  pubYear: asNumber(fm.pubYear),
  pages: asNumber(fm.pages),
  isbn: asString(fm.isbn),
  rating: asNumber(fm.rating),
  datesRead: Object.keys(fm)
    .filter(k => /^dateRead\d*$/.test(k))
    .sort((a, b) => (Number(a.slice(8)) || 1) - (Number(b.slice(8)) || 1))
    .map(k => asDate(fm[k]))
    .filter(Boolean)
    .filter((d, i, all) => all.indexOf(d) === i)
    .sort(),
});

/**
 * Delete generated files this run did not produce: books removed from the
 * notes, titles that were renamed, and " 2" conflict copies left by a file
 * syncing service (which can never be legitimate output, since generated
 * slugs contain no spaces).
 */
async function removeStale(dir, keep, isGenerated) {
  if (!existsSync(dir)) return 0;
  const stale = (await readdir(dir)).filter(f => isGenerated(f) && !keep.has(f));
  await Promise.all(stale.map(f => unlink(path.join(dir, f))));
  return stale.length;
}

const warnings = [];
const warn = msg => warnings.push(msg);

const loosen = s => s.toLowerCase().normalize('NFC').replace(/[^a-z0-9]/g, '');
const CLOUD_PLACEHOLDER = /^\.(.+)\.icloud$/;
const NOT_DOWNLOADED = name =>
  `cover "${name}" is in the cloud but not downloaded locally — open its folder to force a download, then re-run`;

/**
 * Rank directory entries by how plausibly they are the file that was meant.
 * Comparison ignores case and every non-alphanumeric character, because the
 * differences that actually bite here are invisible in a terminal: a curly vs
 * straight apostrophe, an en dash vs hyphen, a stripped colon.
 */
function rankCandidates(entries, base) {
  const stem = loosen(path.basename(base, path.extname(base)));
  return entries
    .map(f => {
      const real = f.match(CLOUD_PLACEHOLDER)?.[1] ?? f;
      const c = loosen(path.basename(real, path.extname(real)));
      let score;
      if (c === stem) score = Infinity;                       // same name, different punctuation
      else if (c.startsWith(stem) || stem.startsWith(c)) {     // one is the other plus a suffix
        score = 1000 + Math.min(c.length, stem.length);
      } else {
        let i = 0;                                            // longest shared opening run
        while (i < c.length && i < stem.length && c[i] === stem[i]) i++;
        score = i;
      }
      return { entry: f, name: real, score, placeholder: CLOUD_PLACEHOLDER.test(f) };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Say why a referenced cover isn't readable, and name the file it probably
 * should have pointed at. Reports file and folder names only, never full paths.
 */
function diagnoseMissingCover(src) {
  const dir = path.dirname(src);
  const base = path.basename(src);

  if (existsSync(path.join(dir, `.${base}.icloud`))) return NOT_DOWNLOADED(base);

  // Walk up to whichever ancestor does exist, and name the first missing folder.
  if (!existsSync(dir)) {
    const parts = dir.split(path.sep);
    let depth = parts.length;
    while (depth > 0 && !existsSync(parts.slice(0, depth).join(path.sep))) depth--;
    const missing = parts[depth];
    const present = (() => {
      try {
        return readdirSync(parts.slice(0, depth).join(path.sep), { withFileTypes: true })
          .filter(e => e.isDirectory() && !e.name.startsWith('.'))
          .map(e => e.name);
      } catch { return []; }
    })();
    const near = rankCandidates(present, missing)[0];
    const hint = near && near.score > 2 ? ` — did you mean the folder "${near.name}"?` : '';
    return `the folder "${missing}" in its cover path does not exist${hint}`;
  }

  const entries = (() => { try { return readdirSync(dir); } catch { return []; } })();
  const [best] = rankCandidates(entries.filter(f => f !== '.DS_Store'), base);

  if (best?.score === Infinity) {
    return best.placeholder
      ? NOT_DOWNLOADED(base)
      : `cover name mismatch — frontmatter says "${base}", the file on disk is "${best.entry}"`;
  }
  if (best?.score >= 1000) {
    return best.placeholder
      ? NOT_DOWNLOADED(best.name)
      : `cover "${base}" not found — the closest file is "${best.name}", so the frontmatter name is likely incomplete`;
  }
  if (best && best.score >= 8) {
    return `cover "${base}" not found — closest file is "${best.name}"`;
  }
  return `cover "${base}" not found, and nothing in that folder resembles it`;
}

const noteFiles = (await readdir(notesDir)).filter(f => f.endsWith('.md'));
const records = [];
const slugs = new Map();
let skippedUnread = 0;

for (const file of noteFiles) {
  const raw = await readFile(path.join(notesDir, file), 'utf8');
  const frontmatter = raw.match(FRONTMATTER_RE)?.[1];
  if (!frontmatter) continue;

  // JSON_SCHEMA keeps unquoted dates as strings instead of coercing to Date.
  let fm;
  try {
    fm = yaml.load(frontmatter, { schema: yaml.JSON_SCHEMA }) ?? {};
  } catch (e) {
    warn(`${file}: unparseable frontmatter — ${e.message}`);
    continue;
  }

  if (asString(fm.status)?.toLowerCase() !== READ_STATUS) {
    skippedUnread++;
    continue;
  }

  const book = FIELDS(fm);
  if (!book.title) {
    warn(`${file}: no title, skipped`);
    continue;
  }
  if (book.datesRead.length === 0) {
    warn(`${book.title}: status is "${READ_STATUS}" but has no dateRead — it will not appear on the site`);
    continue;
  }

  let slug = slugify(book.title);
  if (slugs.has(slug)) {
    warn(`${book.title}: slug "${slug}" collides with "${slugs.get(slug)}" — suffixing`);
    let n = 2;
    while (slugs.has(`${slug}-${n}`)) n++;
    slug = `${slug}-${n}`;
  }
  slugs.set(slug, book.title);

  const coverRel = asString(fm.cover);
  book.cover = null;
  if (coverRel) {
    const src = path.resolve(assetsRoot, coverRel);
    const ext = path.extname(src).toLowerCase();
    if (!existsSync(src)) {
      warn(`${book.title}: ${diagnoseMissingCover(src)}`);
    } else if (!COVER_EXTS.has(ext)) {
      warn(`${book.title}: unsupported cover format "${ext}"`);
    } else {
      book.cover = `${slug}${ext}`;
      records.push({ slug, book, coverSrc: src });
      continue;
    }
  } else {
    warn(`${book.title}: frontmatter has no cover set`);
  }
  records.push({ slug, book, coverSrc: null });
}

// One country per author, or the world map double-counts them across buckets.
const authorCountries = new Map();
for (const { book } of records) {
  const primary = book.author[0];
  if (!primary || !book.authorCountry) continue;
  const seen = authorCountries.get(primary);
  if (seen && seen !== book.authorCountry) {
    warn(`${primary}: authorCountry is both "${seen}" and "${book.authorCountry}" — the world map will count them twice`);
  }
  authorCountries.set(primary, book.authorCountry);
}

await mkdir(OUT_DATA, { recursive: true });
await mkdir(OUT_COVERS, { recursive: true });

const wantJson = new Set();
const wantCovers = new Set();
let jsonWritten = 0;
let coversCopied = 0;

for (const { slug, book, coverSrc } of records) {
  const name = `${slug}.json`;
  wantJson.add(name);
  const dest = path.join(OUT_DATA, name);
  const contents = JSON.stringify(book, null, 2) + '\n';
  if ((await readFile(dest, 'utf8').catch(() => null)) !== contents) {
    await writeFile(dest, contents);
    jsonWritten++;
  }

  if (coverSrc) {
    wantCovers.add(book.cover);
    const destCover = path.join(OUT_COVERS, book.cover);
    // Size is enough to spot a replaced cover; mtime always differs after a copy.
    const [from, to] = await Promise.all([stat(coverSrc), stat(destCover).catch(() => null)]);
    if (!to || from.size !== to.size) {
      await copyFile(coverSrc, destCover);
      coversCopied++;
    }
  }
}

const removedData = await removeStale(OUT_DATA, wantJson, f => f.endsWith('.json'));
const removedCovers = await removeStale(OUT_COVERS, wantCovers, f =>
  COVER_EXTS.has(path.extname(f).toLowerCase())
);

for (const w of warnings) console.warn(`  ! ${w}`);
console.log(
  `\n${records.length} books in sync ` +
  `(${jsonWritten} json + ${coversCopied} covers updated, ` +
  `${removedData + removedCovers} stale removed, ` +
  `${skippedUnread} skipped as not "${READ_STATUS}")`
);
