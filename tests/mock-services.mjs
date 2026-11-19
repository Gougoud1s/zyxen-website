// A local stand-in for the Resend and Notion APIs, so the real contact handler can be tested without sending anything.
import { createServer } from 'node:http';

export async function startMockServices(port = 4599) {
  const calls = { emails: [], notion: [], claude: [] };
  const fail = { owner: false, confirmation: false, notion: false };
  // Claude: off (the API rejects the request, so no draft is sent) unless a test sets the reply text.
  const claude = { reply: null, stop: 'end_turn' };
  const server = createServer(async (req, res) => {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    const body = raw ? JSON.parse(raw) : {};
    const reply = (status, payload) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(payload));
    };
    if (req.method === 'POST' && req.url === '/emails') {
      calls.emails.push(body);
      const toOwner = [body.to].flat().includes('i.gougoudis@zyxen.gr');
      if (fail.owner && toOwner) return reply(500, { name: 'internal_server_error', message: 'mock failure' });
      // Resend rejects bad recipient domains with 422 (e.g. a mistyped visitor address).
      if (fail.confirmation && !toOwner) return reply(422, { name: 'validation_error', message: 'mock invalid recipient' });
      return reply(200, { id: `mock-${calls.emails.length}` });
    }
    if (req.method === 'POST' && req.url === '/v1/pages') {
      calls.notion.push({ body, auth: req.headers.authorization, version: req.headers['notion-version'] });
      if (fail.notion) return reply(500, { object: 'error', code: 'internal_server_error' });
      return reply(200, { object: 'page', id: 'mock-page' });
    }
    if (req.method === 'POST' && req.url.startsWith('/v1/messages')) {
      calls.claude.push({ body, auth: req.headers.authorization ?? req.headers['x-api-key'], beta: req.headers['anthropic-beta'] });
      if (claude.reply === null) return reply(400, { type: 'error', error: { type: 'invalid_request_error', message: 'mock: drafts off' } });
      return reply(200, {
        id: 'msg_mock',
        type: 'message',
        role: 'assistant',
        model: body.model,
        content: [{ type: 'text', text: claude.reply }],
        stop_reason: claude.stop,
        stop_sequence: null,
        usage: { input_tokens: 1, output_tokens: 1 },
      });
    }
    // Test helpers for the browser suite.
    if (req.url === '/__calls') return reply(200, calls);
    if (req.url === '/__reset') {
      calls.emails.length = 0;
      calls.notion.length = 0;
      calls.claude.length = 0;
      return reply(200, { ok: true });
    }
    reply(404, { error: 'not mocked' });
  });
  await new Promise((resolve) => server.listen(port, resolve));
  return {
    url: `http://localhost:${port}`,
    calls,
    fail,
    claude,
    reset() {
      calls.emails.length = 0;
      calls.notion.length = 0;
      calls.claude.length = 0;
      claude.reply = null;
      claude.stop = 'end_turn';
      fail.owner = false;
      fail.confirmation = false;
      fail.notion = false;
    },
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
