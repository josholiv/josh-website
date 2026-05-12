import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Load .env file manually so credentials never need to be typed in the terminal
const envPath = join(process.cwd(), ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

// ── Configuration ──────────────────────────────────────────────────────────────
const BASE_URL = "https://josholivier.com"; // Your deployed site URL
const CF_API = "https://api.cloudflare.com/client/v4/accounts";
const OUTPUT_DIR = "public/social-cards"; // Output directory for generated images
const POSTS_DIR = "src/blog"; // Directory containing your markdown posts

interface Post {
  slug: string;
  title: string;
  author?: string;
  description?: string;
  tags?: string[];
}

/** Extract a frontmatter field value from raw markdown content. */
function getFrontmatterField(content: string, field: string): string | null {
  const match = content.match(new RegExp(`^${field}:\\s*['\"]?([^'\"\n]+)['\"]?`, "m"));
  return match ? match[1].trim() : null;
}

/** Extract a YAML array field (e.g. tags: ["foo", "bar"]) from raw markdown. */
function getFrontmatterArray(content: string, field: string): string[] {
  const match = content.match(new RegExp(`^${field}:\\s*\\[([^\\]]+)\\]`, "m"));
  if (!match) return [];
  return match[1]
    .split(",")
    .map((s) => s.trim().replace(/['"]/g, ""))
    .filter(Boolean);
}

/**
 * Read all post files and return { slug, title, author, description, tags }[].
 * The slug is derived from the filename (no extension), matching Astro's content
 * collection ID which is used as the URL slug in /posts/[...slug].astro.
 */
function readPosts(): Post[] {
  if (!existsSync(POSTS_DIR)) return [];
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = readFileSync(join(POSTS_DIR, file), "utf-8");
    const slug = file.replace(/\.md$/, "");
    const title = getFrontmatterField(raw, "title") ?? slug;
    const author = getFrontmatterField(raw, "author") ?? undefined;
    const description = getFrontmatterField(raw, "description") ?? undefined;
    const tags = getFrontmatterArray(raw, "tags");
    return { slug, title, author, description, tags };
  });
}

/**
 * Capture a screenshot using Cloudflare Browser Run Quick Actions.
 */
async function captureScreenshot(
  accountId: string,
  apiToken: string,
  pageUrl: string
): Promise<ArrayBuffer> {
  const endpoint = `${CF_API}/${accountId}/browser-rendering/screenshot`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: pageUrl,
      viewport: { width: 1200, height: 630 },
      gotoOptions: { waitUntil: "networkidle0" },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Screenshot API returned ${res.status}: ${text}`);
  }

  return res.arrayBuffer();
}

async function main() {
  const accountId = process.env.CF_BROWSER_ACCOUNT_ID;
  const apiToken = process.env.CF_BROWSER_TOKEN;

  if (!accountId || !apiToken) {
    console.error("Error: CF_BROWSER_ACCOUNT_ID and CF_BROWSER_TOKEN environment variables are required");
    process.exit(1);
  }

  const force = process.argv.includes("--force");

  const posts = readPosts();

  if (posts.length === 0) {
    console.log("No posts found. Check your POSTS_DIR path.");
    process.exit(0);
  }

  console.log(`Found ${posts.length} posts to process\n`);

  mkdirSync(OUTPUT_DIR, { recursive: true });

  let generated = 0;
  let skipped = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const outPath = join(OUTPUT_DIR, `${post.slug}.png`);
    const label = `[${i + 1}/${posts.length}]`;

    if (!force && existsSync(outPath)) {
      console.log(`${label} ${post.slug}.png — skipped (exists)`);
      skipped++;
      continue;
    }

    const params = new URLSearchParams({
      title: post.title,
      author: post.author ?? "Josh Olivier",
      ...(post.description ? { description: post.description } : {}),
      ...(post.tags && post.tags.length > 0 ? { tags: post.tags.join(",") } : {}),
    });
    const url = `${BASE_URL}/social-card?${params}`;

    try {
      const png = await captureScreenshot(accountId, apiToken, url);
      writeFileSync(outPath, Buffer.from(png));
      console.log(`${label} ${post.slug}.png — done`);
      generated++;
    } catch (err) {
      console.error(`${label} ${post.slug}.png — failed:`, err);
    }

    // Rate limiting: small delay between requests
    if (i < posts.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  console.log(`\nDone. Generated: ${generated}, Skipped: ${skipped}`);
}

main();
