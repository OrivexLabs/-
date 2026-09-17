/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { RequestHandler } from 'express';

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  maxClients?: number;
  now?: () => number;
}

interface Bucket {
  count: number;
  resetAt: number;
  lastSeen: number;
}

export function createRateLimiter(options: RateLimitOptions): RequestHandler {
  const now = options.now ?? Date.now;
  const maxClients = options.maxClients ?? 10_000;
  const buckets = new Map<string, Bucket>();

  return (req, res, next) => {
    const currentTime = now();
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    let bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= currentTime) {
      bucket = { count: 0, resetAt: currentTime + options.windowMs, lastSeen: currentTime };
      buckets.set(key, bucket);
    }
    bucket.lastSeen = currentTime;

    if (buckets.size > maxClients) {
      const oldestKey = [...buckets.entries()].sort(([, left], [, right]) => left.lastSeen - right.lastSeen)[0]?.[0];
      if (oldestKey) buckets.delete(oldestKey);
    }

    res.setHeader('X-RateLimit-Limit', options.max.toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(bucket.resetAt / 1_000).toString());

    if (bucket.count >= options.max) {
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('Retry-After', Math.ceil((bucket.resetAt - currentTime) / 1_000).toString());
      res.status(429).json({ code: 'RATE_LIMITED', error: '请求过于频繁，请稍后重试。' });
      return;
    }

    bucket.count += 1;
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.max - bucket.count).toString());
    next();
  };
}
