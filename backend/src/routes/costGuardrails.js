// Cost guardrails and per-tenant token quotas.
const express = require('express');
const { authenticateToken: auth } = require('../middleware/auth');
const router = express.Router();

const quotas = new Map();   // tenantId -> { dailyTokenLimit, monthlyTokenLimit }
const usage  = new Map();   // tenantId -> { day: { date, tokens }, month: { date, tokens } }

function today() { return new Date().toISOString().slice(0, 10); }
function thisMonth() { return new Date().toISOString().slice(0, 7); }

function getUsage(tenantId) {
  let u = usage.get(tenantId);
  if (!u) {
    u = { day: { date: today(), tokens: 0 }, month: { date: thisMonth(), tokens: 0 } };
    usage.set(tenantId, u);
  }
  if (u.day.date !== today()) u.day = { date: today(), tokens: 0 };
  if (u.month.date !== thisMonth()) u.month = { date: thisMonth(), tokens: 0 };
  return u;
}

router.post('/quota', auth, (req, res) => {
  const { tenantId, dailyTokenLimit = 50000, monthlyTokenLimit = 1000000 } = req.body;
  if (!tenantId) return res.status(400).json({ error: 'tenantId required' });
  quotas.set(tenantId, { dailyTokenLimit, monthlyTokenLimit });
  res.json({ ok: true, tenantId, dailyTokenLimit, monthlyTokenLimit });
});

router.get('/quota/:tenantId', auth, (req, res) => {
  const q = quotas.get(req.params.tenantId);
  if (!q) return res.status(404).json({ error: 'no quota set' });
  const u = getUsage(req.params.tenantId);
  res.json({ ...q, used: u });
});

router.post('/check', auth, (req, res) => {
  const { tenantId, expectedTokens = 0 } = req.body;
  const q = quotas.get(tenantId);
  if (!q) return res.json({ ok: true, note: 'no quota set' });
  const u = getUsage(tenantId);
  const overDay = (u.day.tokens + expectedTokens) > q.dailyTokenLimit;
  const overMonth = (u.month.tokens + expectedTokens) > q.monthlyTokenLimit;
  res.json({ ok: !overDay && !overMonth, overDay, overMonth, usage: u, quota: q });
});

router.post('/consume', auth, (req, res) => {
  const { tenantId, tokens = 0 } = req.body;
  if (!tenantId || !tokens) return res.status(400).json({ error: 'tenantId and tokens required' });
  const u = getUsage(tenantId);
  u.day.tokens += tokens;
  u.month.tokens += tokens;
  res.json({ ok: true, usage: u });
});

module.exports = router;
