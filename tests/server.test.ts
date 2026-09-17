/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { createApp } from '../server.ts';
import { defaultLoganReport } from '../src/data/fengshuiData';

const validBody = {
  orientation: '坐西北朝东南',
  layoutDesc: '四房两厅两卫，约 120 平方米',
  environmentDesc: '小区内有中央花园，周边无明显直冲道路。',
};

const servers: Server[] = [];

async function startTestServer(options: Parameters<typeof createApp>[0] = {}) {
  const server = createApp(options).listen(0, '127.0.0.1');
  servers.push(server);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address() as AddressInfo;
  return `http://127.0.0.1:${address.port}`;
}

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  })));
});

describe('analysis API', () => {
  it('validates, trims, and returns a typed analysis report', async () => {
    let received: typeof validBody | undefined;
    const base = await startTestServer({
      generateAnalysis: async (request) => {
        received = request;
        return defaultLoganReport;
      },
    });

    const response = await fetch(`${base}/api/gemini/analyze`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        orientation: `  ${validBody.orientation}  `,
        layoutDesc: ` ${validBody.layoutDesc} `,
        environmentDesc: ` ${validBody.environmentDesc} `,
      }),
    });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
    assert.deepEqual(received, validBody);
    const report = await response.json() as typeof defaultLoganReport;
    assert.equal(report.houseInfo.orientation, defaultLoganReport.houseInfo.orientation);
  });

  it('rejects invalid input without calling the model', async () => {
    let calls = 0;
    const base = await startTestServer({
      generateAnalysis: async () => {
        calls += 1;
        return defaultLoganReport;
      },
    });

    const response = await fetch(`${base}/api/gemini/analyze`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...validBody, layoutDesc: 'x'.repeat(1_001) }),
    });
    const payload = await response.json() as { code: string; field: string };

    assert.equal(response.status, 400);
    assert.equal(payload.code, 'INVALID_REQUEST');
    assert.equal(payload.field, 'layoutDesc');
    assert.equal(calls, 0);
  });

  it('returns a safe error for malformed JSON and oversized bodies', async () => {
    const base = await startTestServer({ generateAnalysis: async () => defaultLoganReport });
    const malformed = await fetch(`${base}/api/gemini/analyze`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{not-json',
    });
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).code, 'INVALID_JSON');

    const oversized = await fetch(`${base}/api/gemini/analyze`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ data: 'x'.repeat(20_000) }),
    });
    assert.equal(oversized.status, 413);
    assert.equal((await oversized.json()).code, 'PAYLOAD_TOO_LARGE');
  });

  it('enforces the per-client rate limit', async () => {
    const base = await startTestServer({
      generateAnalysis: async () => defaultLoganReport,
      rateLimit: { max: 2 },
    });

    const request = () => fetch(`${base}/api/gemini/analyze`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validBody),
    });
    const first = await request();
    assert.equal(first.status, 200);
    assert.equal(first.headers.get('x-ratelimit-remaining'), '1');
    const second = await request();
    assert.equal(second.status, 200);
    assert.equal(second.headers.get('x-ratelimit-remaining'), '0');
    const limited = await request();
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get('retry-after') !== null, true);
    assert.equal((await limited.json()).code, 'RATE_LIMITED');
  });

  it('does not expose upstream error details', async () => {
    const base = await startTestServer({
      generateAnalysis: async () => {
        throw new Error('upstream secret and credential-like detail');
      },
    });

    const response = await fetch(`${base}/api/gemini/analyze`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validBody),
    });
    const text = await response.text();
    assert.equal(response.status, 502);
    assert.match(text, /AI 分析服务暂时不可用/);
    assert.doesNotMatch(text, /upstream secret|credential-like/);
  });
});
