---
title: 'Generating Open Graph images for an Astro site deployed with Cloudflare'
pubDate: 2026-05-13
dateModified: 2026-05-13
description: 'How I use a server-rendered Astro page and Cloudflare Browser Rendering to auto-generate Open Graph images for every page on this site.'
author: 'Josh Olivier'
image:
    url: '/social-cards/blog.png'
    alt: 'Example Open Graph social card for a webpage'
tags: ["code", "blogging"]
readTime: '9'
---

## The problem

I recently discovered a minor issue with my website which, despite likely being an inconsequential detail for 99.99% of users, would not stop bothering me. The issue was that when I opened Safari on my phone, my website would often appear under the list of suggested sites with a random image from my most recent blog post, like this:  

<figure class="img-figure">
  <img src="/images/blog/post-generating-open-graph-images/IMG_7345.jpeg" alt="Social card of my website with a random image pulled from a blog post in the suggested sites section of the Safari iOS app" class="blog-body-pic" />
  <figcaption class="img-caption">Social card of my website from the Safari iOS 'Suggestions' list, with a random image pulled from one of my blog posts</figcaption>
</figure>

This preview is pulling the book cover image from my review of [*Everything is Tuberculosis*](/posts/book-review-everything-is-tuberculosis) by John Green. And while I like the book, it's cover is not the best representation for my entire website. Now, I can't imaging my website is being listed under Safari's suggested posts for that many people. And even if it were, having the image from my latest blog post appear in this context isn't really the end of the world. However, I couldn't shake the vexation from this small nuisance, so I looked into whether it was possible to control the that image appears in these sorts of site previews. My search brought me down the rabbit hole of Open Graph images.

## What are Open Graph images?

When you share a link on social media or in a messaging app, the little preview card that appears is defined by [Open Graph](https://ogp.me/) meta tags for your webpage (specifically `og:image`). Without one, you either get a generic placeholder (like in my case, the a random image from my latest blog post), or nothing at all.

If you've ever used the internet before, you've seen an Open Graph image. I discovered that I could not only use Open Graph images to change my site preview image in my specific case (in the Safari app), but this would also allow me to customize the look of links to my site shared on any social media page or messaging app. 

Next, I discovered that I could take this preview image customization a step further—I could generate a unique, custom Open Graph image for *every page* on my site. That way, every page or blog post could show something like the unique page title, plus a brief description:



<figure class="img-figure">
  <img src="/images/blog/post-generating-open-graph-images/IMG_7344.jpeg" alt="Example of a new social card of my website with a unique, newly generated Open Graph image" class="blog-body-pic" />
  <figcaption class="img-caption">A new social card of one of my blog posts, with a unique, newly generated Open Graph image</a></figcaption>
</figure>

Many websites have unique Open Graph images for each page like this, and it's a small detail which, in my opinion, really elevates a site's professional feel. However, manually generating a unique image for each page of my website seemed like a ton of work, and at the time of writing this, my site doesn't even have that many pages. 

Since my site is built with [Astro](https://astro.build) and deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/), I wanted to find a way to auto-generate a custom social card for every blog post and static page. Cloudflare actually has an [official tutorial](https://developers.cloudflare.com/browser-run/how-to/og-images-astro/) covering this same approach, which I used as a starting point. 

## The approach

I wanted my cards to use the same fonts and general styling as the rest of the site. To do this, I followed the Cloudflare tutorial, which takes advantage of Cloudflare's [Browser Rendering API](https://developers.cloudflare.com/browser-rendering/) available. The idea is simple:

1. Create a server-rendered Astro page called `/social-card` that draws the card as plain HTML/CSS

2. Write a script that screenshots that page via the Cloudflare Browser Rendering API

3. Save the screenshots to `public/social-cards/` and point the `og:image` meta tag at them

### Step 1: The social card page

Create `src/pages/social-card.astro`. This is a bare HTML page sized at exactly 1200×630px (the standard Open Graph image size). It reads `title`, `description`, and any other parameters from the URL query string. You should customize this page so it looks how you want your Open Graph images to look (e.g., by changing fonts or colors).

```astro
---
export const prerender = false;
const title = Astro.url.searchParams.get("title") || "Title goes here";
const description = Astro.url.searchParams.get("description") || "";
---

<html>
  <head>
    <meta charset="utf-8" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
        
      body {
        width: 1200px;
        height: 630px;
        background: #191919;
        font-family: "Inter", sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 56px 80px;
        position: relative;
        overflow: hidden;
      }

      .glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 100% 20%, #ddf9fc 10%, #1d6b74 24%, #154c53 28%, #0c2b2e 37%, transparent 55%);
        filter: blur(90px);
        pointer-events: none;
        z-index: 0;
      }

      .title {
        font-family: "DM Serif Text", serif;
        font-size: 80px;
        line-height: 1.12;
        color: #f3f3f3;
        max-width: 900px;
        position: relative;
      }
      
      .description {
        font-size: 28px;
        line-height: 1.5;
        color: #a0a0a0;
        max-width: 900px;
        position: relative;
      }

    </style>
  </head>
  <body>
    <div class="glow"></div>
    <div class="site-name">josholivier.com</div>
    <div>
      <div class="title">{title}</div>
      {description && <div class="description">{description}</div>}
    </div>
  </body>
</html>
```

The `export const prerender = false` at the top is important. This page needs to be server-rendered so it can read the query parameters at request time. If your Astro project is fully static, you'll need to enable SSR (or hybrid rendering) for this route.

Here are a few of the social cards this generates:

<figure class="img-figure">
  <img src="/social-cards/about.png" alt="Social card example: about page" class="blog-body-pic" />
  <figcaption class="img-caption">Newly generated social card for my <a href="/about">About page</a></figcaption>
</figure>

<figure class="img-figure"> 
<img src="/social-cards/i-designed-and-3d-printed-a-phone-charger-stand.png" alt="Social card example: 3D printed phone charger stand post" class="blog-body-pic" />
  <figcaption class="img-caption">Newly generated social card for a <a href="/posts/i-designed-and-3d-printed-a-phone-charger-stand/">regular blog post</a></figcaption>
</figure>

<figure class="img-figure"> 
<img src="/social-cards/book-review-everything-is-tuberculosis.png" alt="Social card example: book review post" class="blog-body-pic" />
  <figcaption class="img-caption">Newly generated social card for a <a href="/posts/book-review-everything-is-tuberculosis/">book review post</a></figcaption>
</figure>

### Step 2: The screenshot script

Create `scripts/generate-social-cards.ts`. This script reads your blog post frontmatter, builds a URL for each post pointing at `/social-card?title=...&description=...`, screenshots it using the Cloudflare Browser Rendering API, and saves the result as a PNG in `public/social-cards/`.

You'll need a Cloudflare account ID and an API token with Browser Rendering permissions. Store them in a `.env` file:

```
CF_BROWSER_ACCOUNT_ID=your_account_id
CF_BROWSER_TOKEN=your_api_token
```

Remember to keep these secret! Make sure your `.env` file is added to your `.gitignore` and never commit it to a public repository like GitHub!

Here's the core of the script:

```ts
const CF_API = "https://api.cloudflare.com/client/v4/accounts";
const BASE_URL = "https://yourdomain.com";
const OUTPUT_DIR = "public/social-cards";
const POSTS_DIR = "src/blog";

async function captureScreenshot(accountId: string, apiToken: string, pageUrl: string): Promise<ArrayBuffer> {

  const res = await fetch(`${CF_API}/${accountId}/browser-rendering/screenshot`, {
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

  if (!res.ok) throw new Error(`Screenshot API returned ${res.status}: ${await res.text()}`);

  return res.arrayBuffer();
}
```

The `networkidle0` wait option is key here. It waits until the page is fully loaded, including fonts from Google Fonts, before taking the screenshot.

For reading frontmatter, I wrote a small helper that handles double-quoted, single-quoted, and unquoted YAML values. This was to fix an issue where one of my blog post descriptions was getting truncated because it contained an apostrophe, and also hopefully fix future syntax issues before they arise:

```ts
function getFrontmatterField(content: string, field: string): string | null {

  const dq = content.match(new RegExp(`^${field}:\\s*"([^"\\n]+)"`, "m"));
  if (dq) return dq[1].trim();

  const sq = content.match(new RegExp(`^${field}:\\s*'([^'\\n]+)'`, "m"));
  if (sq) return sq[1].trim();

  const uq = content.match(new RegExp(`^${field}:\\s*([^\\n'"]+)`, "m"));
  return uq ? uq[1].trim() : null;
}
```

The main loop reads all `.md` files from `src/blog` (these are my blog posts), builds a screenshot URL for each one, then saves the result to `public/social-cards/<slug>.png`. I also set a timeout to stay under the Cloudflare API rate limit:

```ts
for (const item of items) {
  const outPath = join(OUTPUT_DIR, `${item.slug}.png`);
  if (!force && existsSync(outPath)) { skipped++; continue; }

  const params = new URLSearchParams({ title: item.title });
  if (item.description) params.set("description", item.description);

  const url = `${BASE_URL}/social-card?${params}`;
  
  const png = await captureScreenshot(accountId, apiToken, url);

  writeFileSync(outPath, Buffer.from(png));

  // Stay under Cloudflare's rate limit
  await new Promise(resolve => setTimeout(resolve, 3000));
}
```

Next, I added two npm scripts to `package.json`: `og:generate` and `og:regenerate`.

```json
"og:generate":   "npx tsx scripts/generate-social-cards.ts",
"og:regenerate": "npx tsx scripts/generate-social-cards.ts --force"
```

`og:generate` skips images that already exist. This is the go-to script for regular use. For example, you'd use this if you add a new page to your site and want to generate the Open Graph image for just that page. 

`og:regenerate` regenerates all of the images from scratch, which is nice for when you want to remake a lot or all of your site's Open Graph images. You'd want to use this when, for example, you update the overall card design and want to regenerate all of your cards to reflect the changes. 

### Step 3: Set up the meta tags

In your base layout, add the standard Open Graph and Twitter card meta tags:

```astro
---
const siteUrl = 'https://yourdomain.com';
const ogImageAbsolute = ogImage ? new URL(ogImage, siteUrl).toString() : undefined;
---
{ogImageAbsolute && <meta property="og:image" content={ogImageAbsolute} />}
{ogImageAbsolute && <meta property="og:image:width" content="1200" />}
{ogImageAbsolute && <meta property="og:image:height" content="630" />}
<meta name="twitter:card" content={ogImageAbsolute ? 'summary_large_image' : 'summary'} />
{ogImageAbsolute && <meta name="twitter:image" content={ogImageAbsolute} />}
```

Then in your blog post layout, pass the image path using the post's slug:

```astro
<BaseLayout ogImage={slug ? `/social-cards/${slug}.png` : undefined}>
```

The slug matches the filename of the generated PNG, so everything lines up automatically.

## Running it

With your `.env` file in place and the site deployed, run:

```bash
npm run og:generate
```

This will process each page and post, screenshot the `/social-card` route with the right query parameters, and save the result to `public/social-cards/`. Once the images are generated, you'll just need to deploy the site again, and your Open Graph preview images should go into effect.

One thing worth noting: the Cloudflare Browser Rendering API screenshots your *deployed* site, not `localhost`. So you need to push your changes and wait for your Cloudflare Workers deployment to go live before generating images for the first time, or whenever you update the card design.