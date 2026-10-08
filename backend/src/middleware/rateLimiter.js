import rateLimit from 'express-rate-limit';

// General API limiter — generous, just stops abuse/scraping
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// Strict limiter for auth endpoints — prevents brute-force login/signup attempts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' },
  skipSuccessfulRequests: true, // only counts failed attempts against the limit
});

// Slightly tighter limiter for the tax calculation endpoint (cheap to abuse, hits the DB)
export const calculationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many calculations too quickly. Please slow down.' },
});