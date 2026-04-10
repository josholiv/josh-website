import Hardcover from '../../components/Hardcover.js';

export const prerender = false;

export async function GET() {
  const hc = new Hardcover();
  const result = await hc.fetch();
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
}