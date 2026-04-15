import Hardcover from '../../components/Hardcover.js';
import fs from 'fs';
import path from 'path';

export const prerender = false;

const CACHE_PATH = path.resolve(process.cwd(), 'src/data/hardcover_cache.json');
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET() {
  let cached = null;
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const raw = fs.readFileSync(CACHE_PATH, 'utf-8');
      cached = JSON.parse(raw);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return new Response(JSON.stringify(cached.data), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  } catch (e) {
    // Ignore cache errors, fallback to API
  }

  const hc = new Hardcover();
  const result = await hc.fetch();
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify({ timestamp: Date.now(), data: result }), 'utf-8');
  } catch (e) {
    // Ignore cache write errors
  }
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
}