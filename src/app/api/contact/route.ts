import handler from '@/lib/contactHandler.js';

export const runtime = 'nodejs';

// shortcut: adapts the existing (req, res) handler unchanged; phase 4 replaces it with a native handler (zod, honeypot, Notion).
export async function POST(request: Request) {
  let status = 200;
  const headers = new Headers();
  let response: Response = new Response(null, { status: 500 });
  const res = {
    status(code: number) {
      status = code;
      return res;
    },
    setHeader(key: string, value: string) {
      headers.set(key, value);
    },
    json(body: unknown) {
      response = Response.json(body, { status, headers });
      return response;
    },
  };
  const body = await request.json().catch(() => null);
  await handler({ method: 'POST', headers: { 'content-type': request.headers.get('content-type') ?? '' }, body }, res);
  return response;
}
