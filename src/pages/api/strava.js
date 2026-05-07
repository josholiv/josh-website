import Strava from '../../components/strava.js';
import { env } from "cloudflare:workers";

export const prerender = false;

const CACHE_TTL_SECONDS = 60 * 60; // 1 hour

export async function GET({ request }) {
  const cacheKey = new Request(new URL('/api/strava', request.url).toString());

  let cache;
  try {
    cache = caches.default;
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) return cachedResponse;
  } catch (e) {
    // Ignore cache read errors and continue to live fetch.
  }

  try {
    const strava = new Strava(env);
    const result = await strava.fetch();

    const response = new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
      },
    });

    try {
      await cache.put(cacheKey, response.clone());
    } catch (e) {
      // Ignore cache write errors and return live response.
    }

    return response;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown Strava API error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
