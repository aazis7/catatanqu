import { HTTPException } from "../utils/HTTPException.js";

// Simple in-memory rate limiter
const rateLimitStore = new Map();

export const rateLimit = (options = {}) => {
  const {
    max = 100,
    windowMs = 15 * 60 * 1000, // 15 minutes
    message = "Too many requests from this IP, please try again later",
  } = options;

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    const record = rateLimitStore.get(key);

    if (now > record.resetTime) {
      // Reset the count
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    if (record.count >= max) {
      const resetTime = new Date(record.resetTime);
      res.set({
        "Retry-After": Math.round((record.resetTime - now) / 1000),
        "X-RateLimit-Limit": max,
        "X-RateLimit-Remaining": 0,
        "X-RateLimit-Reset": resetTime.toISOString(),
      });

      throw new HTTPException(429, message);
    }

    record.count++;

    res.set({
      "X-RateLimit-Limit": max,
      "X-RateLimit-Remaining": max - record.count,
      "X-RateLimit-Reset": new Date(record.resetTime).toISOString(),
    });

    next();
  };
};

// Clean up expired entries periodically
setInterval(
  () => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  },
  15 * 60 * 1000,
); // Clean up every 15 minutes
