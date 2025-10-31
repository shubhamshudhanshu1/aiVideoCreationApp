import Redis from "ioredis";

const url = process.env.REDIS_URL || "redis://localhost:6379";

// Reuse client across hot reloads (Next.js dev)
declare global {
  // eslint-disable-next-line no-var
  var _redis: Redis | undefined;
}

export const redis: Redis = global._redis || new Redis(url, { lazyConnect: false });
if (!global._redis) global._redis = redis;
