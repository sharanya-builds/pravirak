import { Router } from 'express';
import { answerAdvisorQuestion } from '../services/openRouterAdvisorService.js';

const router = Router();

// ---------------------------------------------------------------------------
// Per-IP rate limiter — 20 requests per 10-minute window (no extra packages).
// ---------------------------------------------------------------------------
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 20;
const ipLog = new Map(); // ip → { windowStart: number, count: number }

// Sweep stale entries once per window so the Map doesn't grow unboundedly.
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of ipLog.entries()) {
    if (now - rec.windowStart > RATE_WINDOW_MS) ipLog.delete(ip);
  }
}, RATE_WINDOW_MS).unref(); // unref() so this timer doesn't keep the process alive in tests

function rateLimiter(req, res, next) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  let rec = ipLog.get(ip);

  if (!rec || now - rec.windowStart > RATE_WINDOW_MS) {
    rec = { windowStart: now, count: 0 };
  }
  rec.count += 1;
  ipLog.set(ip, rec);

  if (rec.count > RATE_MAX) {
    return res.status(429).json({
      error: 'Too many questions. Please wait a few minutes before asking again.'
    });
  }
  next();
}

// ---------------------------------------------------------------------------
// POST /api/advisor/ask
// Body: { question: string, language: 'en'|'hi'|'te', analysisContext: object }
// ---------------------------------------------------------------------------
router.post('/ask', rateLimiter, async (req, res) => {
  const { question, language, analysisContext } = req.body || {};

  // 500-character cap — return a clear 400 so the frontend can show a message.
  if (typeof question === 'string' && question.length > 500) {
    return res.status(400).json({
      error: 'Question is too long. Please keep it under 500 characters.'
    });
  }

  try {
    const result = await answerAdvisorQuestion({ question, language, analysisContext });
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to process advisor query',
      details: err.message
    });
  }
});

export default router;
