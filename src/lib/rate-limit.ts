type RateLimitEntry = { count: number; resetTime: number };

const store = new Map<string, RateLimitEntry>();

export function rateLimit(
  identifier: string,
  limit = 100,
  windowMs = 60000,
): boolean {
  const now = Date.now();
  const entry = store.get(identifier);

  // Simple GC to prevent unbounded growth
  if (store.size > 10000) {
    for (const [k, v] of store.entries()) {
      if (now > v.resetTime) store.delete(k);
    }
  }

  if (!entry || now > entry.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
