import Hardcover from '../../components/Hardcover.js';
import { env } from "cloudflare:workers";

export const prerender = false;

const CACHE_TTL_SECONDS = 24 * 60 * 60;

export async function GET({ request }) {
  const requestedTitle = new URL(request.url).searchParams.get('title');
  const cacheKey = new Request(new URL('/api/hardcover', request.url).toString());

  let cache;
  try {
    cache = caches.default;
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      if (!requestedTitle) return cachedResponse;
      const payload = await cachedResponse.clone().json();
      const hasTitle = payload.userBooks?.some(
        b => b.book?.title?.toLowerCase() === requestedTitle.toLowerCase()
      );
      if (hasTitle) return cachedResponse;
    }
  } catch (e) {
    // Ignore cache read errors and continue to live fetch.
  }

  try {
    const hc = new Hardcover(env);
    const result = await hc.fetch();

    const response = new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`
      }
    });

    try {
      await cache.put(cacheKey, response.clone());
    } catch (e) {
      // Ignore cache write errors and return live response.
    }

    return response;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown Hardcover API error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}