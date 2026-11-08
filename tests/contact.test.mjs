/*
 * Regression test for the bundled-send bug in api/contact.js.
 *
 * History: the owner notification (the lead) and the visitor auto-reply were
 * sent in one Promise.all and the route returned 502 if EITHER failed. A
 * mistyped visitor address therefore discarded the lead: the owner was never
 * notified, and the visitor saw an error for a message the server had received.
 *
 * These tests stub the Resend SDK (via a loader hook) so we exercise the real
 * handler logic, not a copy of it.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

/* A loader hook that redirects the bare specifier 'resend' to our stub.
 * The stub resolves { data, error } and does NOT throw on a rejected send —
 * this matches the real SDK and is exactly the behaviour the route must handle.
 */
const STUB_SOURCE = `
export const calls = [];
let failOwners = false;
let failVisitor = false;

export function setFailures({ owners = false, visitor = false } = {}) {
  failOwners = owners;
  failVisitor = visitor;
}
export function resetCalls() {
  calls.length = 0;
}

export class Resend {
  constructor(key) {
    this.key = key;
    this.emails = {
      send: async (payload) => {
        calls.push(payload);
        const to = Array.isArray(payload.to) ? payload.to : [payload.to];
        const owner = to.includes('i.gougoudis@zyxen.gr');
        if (owner && failOwners) {
          return { data: null, error: { name: 'validation_error', message: 'owner rejected' } };
        }
        if (!owner && failVisitor) {
          return {
            data: null,
            error: {
              name: 'validation_error',
              message: 'Invalid to field. Please use our testing email address instead of domains like example.com.',
            },
          };
        }
        return { data: { id: 'msg_' + calls.length }, error: null };
      },
    };
  }
}
`;

register(
  'data:text/javascript,' +
    encodeURIComponent(`
export async function resolve(specifier, context, next) {
  if (specifier === 'resend') {
    return { url: 'zyxen-resend-stub:stub', shortCircuit: true };
  }
  return next(specifier, context);
}
export async function load(url, context, next) {
  if (url === 'zyxen-resend-stub:stub') {
    return { format: 'module', source: ${JSON.stringify(STUB_SOURCE)}, shortCircuit: true };
  }
  return next(url, context);
}
`),
);

const stub = await import('zyxen-resend-stub:stub');
const { default: handler } = await import('../api/contact.js');

/* --- Minimal req/res doubles ---------------------------------------------- */
function mockRes() {
  return {
    statusCode: null,
    body: null,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}

function req(body) {
  return { method: 'POST', headers: { 'content-type': 'application/json' }, body };
}

const VALID = {
  name: 'Maria Papadaki',
  email: 'maria@realcompany.gr',
  service: 'Business website',
  budget: '1200 EUR',
  details: 'We need a five page site for our bakery.',
  lang: 'el',
};

function reset() {
  stub.resetCalls();
  stub.setFailures({ owners: false, visitor: false });
}

const isOwner = (c) => [].concat(c.to).includes('i.gougoudis@zyxen.gr');

test('happy path: both sends happen and the route reports success', async () => {
  reset();
  const res = mockRes();
  await handler(req({ ...VALID }), res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { success: true });
  assert.equal(stub.calls.length, 2);
});

test('THE BUG: a mistyped visitor address must NOT discard the lead', async () => {
  reset();
  stub.setFailures({ visitor: true });
  const res = mockRes();
  await handler(req({ ...VALID, email: 'typo@example.com' }), res);

  assert.equal(res.statusCode, 200, 'lead captured, so the visitor must not see an error');
  assert.deepEqual(res.body, { success: true });

  const ownerSend = stub.calls.find(isOwner);
  assert.ok(ownerSend, 'owner notification must still have been sent');
  assert.match(ownerSend.subject, /Maria Papadaki/);
});

test('owner notification failure is still fatal and surfaces as 502', async () => {
  reset();
  stub.setFailures({ owners: true });
  const res = mockRes();
  await handler(req({ ...VALID }), res);
  assert.equal(res.statusCode, 502, 'we do not have the lead, so the visitor must be told');
  assert.deepEqual(res.body, { error: 'Failed to send email' });
});

test('both failing still surfaces a single 502, not a crash', async () => {
  reset();
  stub.setFailures({ owners: true, visitor: true });
  const res = mockRes();
  await handler(req({ ...VALID }), res);
  assert.equal(res.statusCode, 502);
});

test('owner notification carries replyTo = the visitor, so replying goes to them', async () => {
  reset();
  await handler(req({ ...VALID }), mockRes());
  assert.equal(stub.calls.find(isOwner).replyTo, 'maria@realcompany.gr');
});

test('exactly one notification and one auto-reply per submission', async () => {
  reset();
  await handler(req({ ...VALID }), mockRes());
  assert.equal(stub.calls.length, 2);
  assert.equal(stub.calls.filter(isOwner).length, 1);
  assert.equal(stub.calls.filter((c) => !isOwner(c)).length, 1);
});

test('auto-reply goes to the visitor and replies route to hello@', async () => {
  reset();
  await handler(req({ ...VALID }), mockRes());
  const auto = stub.calls.find((c) => !isOwner(c));
  assert.deepEqual(auto.to, ['maria@realcompany.gr']);
  assert.equal(auto.replyTo, 'hello@zyxen.gr');
});

test('guards run before any send', async () => {
  reset();

  let res = mockRes();
  await handler({ method: 'GET', headers: {}, body: {} }, res);
  assert.equal(res.statusCode, 405);

  res = mockRes();
  await handler({ method: 'POST', headers: { 'content-type': 'text/plain' }, body: {} }, res);
  assert.equal(res.statusCode, 415);

  res = mockRes();
  await handler(req({ name: 'only a name' }), res);
  assert.equal(res.statusCode, 400);

  res = mockRes();
  await handler(req({ ...VALID, email: 'not-an-email' }), res);
  assert.equal(res.statusCode, 400);

  assert.equal(stub.calls.length, 0, 'no email may be sent when a guard rejects');
});

test('escapes user content in the notification subject', async () => {
  reset();
  await handler(req({ ...VALID, name: '<script>alert(1)</script>' }), mockRes());
  const ownerSend = stub.calls.find(isOwner);
  assert.ok(!ownerSend.subject.includes('<script>'), 'subject must be escaped');
  assert.match(ownerSend.subject, /&lt;script&gt;/);
});
