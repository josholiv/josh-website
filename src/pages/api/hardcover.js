import Hardcover from '../../components/Hardcover.js';

export const prerender = false;

const CACHE_TTL_SECONDS = 24 * 60 * 60;

export async function GET({ request }) {
  const cache = caches.default;

  try {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  } catch (e) {
    // Ignore cache read errors and continue to live fetch.
  }

  try {
    const hc = new Hardcover();
    const result = await hc.fetch();

    const response = new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`
      }
    });

    try {
      await cache.put(request, response.clone());
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