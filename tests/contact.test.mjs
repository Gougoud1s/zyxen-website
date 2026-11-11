// Contact API against mocked Resend and Notion. Needs a build: `npm run build && npm run test:contact`.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { after, before, beforeEach, test } from 'node:test';
import { startMockServices } from './mock-services.mjs';

const PORT = 3098;
const base = `http://localhost:${PORT}`;
let mock;
let server;
let ip = 0;

before(async () => {
  mock = await startMockServices(4598);
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(PORT)], {
    env: {
      ...process.env,
      RESEND_API_KEY: 're_test_mock',
      RESEND_BASE_URL: mock.url,
      NOTION_TOKEN: 'secret_test_mock',
      NOTION_LEADS_DATA_SOURCE_ID: 'ds-test',
      NOTION_API_URL: mock.url,
    },
    stdio: 'ignore',
  });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('next start did not come up');
});
after(async () => {
  server?.kill();
  await mock?.close();
});
beforeEach(() => mock.reset());

const valid = {
  name: 'Maria Test',
  email: 'maria@zyxen.gr',
  service: 'High-Scale E-Commerce',
  budget: '€5k — €10k',
  message: 'We need a new store.',
  website: 'mariashop.gr',
  nickname: '',
  elapsed: 9000,
};
// Each call gets its own IP so the rate limit only applies where a test wants it.
const post = (body, forwarded = `10.0.0.${++ip}`) =>
  fetch(`${base}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': forwarded },
    body: JSON.stringify(body),
  });

test('happy path: owner email, confirmation and Notion lead', async () => {
  const res = await post(valid);
  assert.equal(res.status, 200);
  assert.equal(mock.calls.emails.length, 2);
  const owner = mock.calls.emails.find((e) => e.to.includes('i.gougoudis@zyxen.gr'));
  assert.deepEqual(owner.to, ['i.gougoudis@zyxen.gr', 't.martinis@zyxen.gr']);
  assert.equal(owner.from, 'ZYXEN Website <no-reply@zyxen.gr>');
  assert.equal(owner.reply_to ?? owner.replyTo, 'maria@zyxen.gr');
  assert.match(owner.html, /https:\/\/mariashop\.gr\//);
  const confirmation = mock.calls.emails.find((e) => e.to.includes('maria@zyxen.gr'));
  assert.ok(confirmation, 'visitor confirmation sent');

  assert.equal(mock.calls.notion.length, 1);
  const { body, auth, version } = mock.calls.notion[0];
  assert.equal(auth, 'Bearer secret_test_mock');
  assert.equal(version, '2025-09-03');
  assert.deepEqual(body.parent, { type: 'data_source_id', data_source_id: 'ds-test' });
  const p = body.properties;
  assert.equal(p.Company.title[0].text.content, 'Maria Test');
  assert.equal(p.Email.email, 'maria@zyxen.gr');
  assert.equal(p.Website.url, 'https://mariashop.gr/');
  assert.equal(p.Stage.status.name, 'Replied');
  assert.equal(p.Segment.select.name, 'Online shop');
  assert.equal(p.Source.url, 'https://www.zyxen.gr/contact');
  assert.match(p.Notes.rich_text[0].text.content, /Service: High-Scale E-Commerce\nBudget: €5k — €10k\n\nWe need a new store\./);
});

test('a Notion failure never blocks the enquiry', async () => {
  mock.fail.notion = true;
  assert.equal((await post(valid)).status, 200);
  assert.equal(mock.calls.emails.length, 2);
});

test('a failed owner email is reported to the visitor', async () => {
  mock.fail.owner = true;
  const res = await post(valid);
  assert.equal(res.status, 502);
  assert.match((await res.json()).error, /could not be sent/);
});

// Regression tests carried over from the #1 fix (a bad visitor address must never discard the lead).
test('a rejected visitor confirmation (mistyped address) must not discard the lead', async () => {
  mock.fail.confirmation = true;
  const res = await post(valid);
  assert.equal(res.status, 200);
  assert.ok(mock.calls.emails.some((e) => e.to.includes('i.gougoudis@zyxen.gr')), 'owner still notified');
});

test('both sends failing still surfaces a single 502, not a crash', async () => {
  mock.fail.owner = true;
  mock.fail.confirmation = true;
  assert.equal((await post(valid)).status, 502);
});

test('exactly one owner notification and one confirmation per submission', async () => {
  await post(valid);
  assert.equal(mock.calls.emails.filter((e) => e.to.includes('i.gougoudis@zyxen.gr')).length, 1);
  const visitor = mock.calls.emails.filter((e) => e.to.includes('maria@zyxen.gr'));
  assert.equal(visitor.length, 1);
  assert.equal(visitor[0].reply_to ?? visitor[0].replyTo, 'hello@zyxen.gr');
});

test('user content is escaped in the subject and email body', async () => {
  await post({ ...valid, name: '<script>x</script>' });
  const owner = mock.calls.emails.find((e) => e.to.includes('i.gougoudis@zyxen.gr'));
  assert.ok(!owner.subject.includes('<script>'));
  assert.ok(owner.subject.includes('&lt;script&gt;'));
  assert.ok(!owner.html.includes('<script>x'));
});

test('honeypot: looks successful, sends nothing', async () => {
  assert.equal((await post({ ...valid, nickname: 'bot' })).status, 200);
  assert.equal(mock.calls.emails.length, 0);
  assert.equal(mock.calls.notion.length, 0);
});

test('submissions within 3 seconds of page load are rejected', async () => {
  assert.equal((await post({ ...valid, elapsed: 1200 })).status, 400);
  assert.equal(mock.calls.emails.length, 0);
});

test('validation names the bad fields', async () => {
  const res = await post({ ...valid, email: 'not-an-email', service: 'Something else', website: 'not a site' });
  assert.equal(res.status, 400);
  assert.deepEqual(new Set((await res.json()).fields), new Set(['email', 'service', 'website']));
  assert.equal((await post({ ...valid, message: 'x'.repeat(4001) })).status, 400);
  assert.equal(mock.calls.emails.length, 0);
});

test('optional fields may be empty', async () => {
  assert.equal((await post({ ...valid, budget: '', website: '' })).status, 200);
  assert.equal(mock.calls.notion[0].body.properties.Website, undefined);
});

test('rate limit: five per IP per window', async () => {
  const statuses = [];
  for (let i = 0; i < 6; i++) statuses.push((await post(valid, '10.9.9.9')).status);
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
});

test('wrong content type is refused', async () => {
  const res = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'x' });
  assert.equal(res.status, 415);
});
