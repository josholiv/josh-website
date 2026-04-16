# My porfolio site and blog

I created my site ([josholivier.com](https://josholivier.com/)) by following the [Build your first Astro Blog tutorial](https://docs.astro.build/en/tutorial/0-introduction/). The tutorial is great and I strongly recommend it as a starting point for learning to build a site from scratch with Astro!

Originally, I just meant for this site to be a basic landing page for my CV, but as I worked through the tutorial I warmed up to the idea of making it into a blog as well. Now, I use it to post things related to my work projects and hobbies. 

I deploy my site via [Cloudflare Pages](https://pages.cloudflare.com/).

## Deploying on Cloudflare Pages

1. In Cloudflare, create a new Pages project and connect this repo.
2. Use the following build settings:
	- Build command: `npm run build`
	- Build output directory: `dist`
3. Add your environment variables in Pages settings:
	- `HARDCOVER_API_KEY`
4. Deploy.

For local Cloudflare Pages simulation:

```bash
npm install
npm run cf:dev
```

For manual CLI deploy:

```bash
npm run cf:deploy
```

### Notes about API caching

The `GET /api/hardcover` endpoint now uses Cloudflare's edge cache (24-hour TTL) instead of writing cache files to disk. This is compatible with Cloudflare's runtime.


## Resources

Both [Astro's documentation](https://docs.astro.build) and [Discord server](https://astro.build/chat) have been immensely helpful as I've gone through the process of learning code and building my site.
