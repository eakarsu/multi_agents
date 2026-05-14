// Multi-agent debate / vote framework with explainable arbitration.
const express = require('express');
const { authenticateToken: auth } = require('../middleware/auth');
const router = express.Router();

let DebateService = null;
try { DebateService = require('../services/DebateService'); } catch {}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5';

async function callAI(messages, max = 800) {
  if (!OPENROUTER_API_KEY) {
    const e = new Error('OPENROUTER_API_KEY not configured'); e.statusCode = 503; throw e;
  }
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: OPENROUTER_MODEL, messages, max_tokens: max, temperature: 0.5 })
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.choices[0].message.content;
}

// POST /api/debate-vote/run — N agents propose, then an arbiter scores them.
router.post('/run', auth, async (req, res) => {
  try {
    const { question, agents = [{ role: 'optimist' }, { role: 'pessimist' }, { role: 'realist' }] } = req.body;
    if (!question) return res.status(400).json({ error: 'question required' });

    const proposals = [];
    for (const a of agents.slice(0, 5)) {
      const persona = `You are a ${a.role || 'analyst'} agent. Respond in <=120 words.`;
      const content = await callAI([
        { role: 'system', content: persona },
        { role: 'user', content: question }
      ]);
      proposals.push({ role: a.role || 'analyst', content });
    }

    const judge = await callAI([
      { role: 'system', content: 'You are an arbiter. Given proposals, return JSON {"winner":"role","score":0-100,"reasoning":string,"per_agent":[{"role":string,"score":number,"strengths":string,"weaknesses":string}]}.' },
      { role: 'user', content: `Question: ${question}\n\n${proposals.map(p => `[${p.role}]\n${p.content}`).join('\n\n')}` }
    ], 900);

    let verdict;
    try { verdict = JSON.parse(judge.match(/\{[\s\S]*\}/)[0]); } catch { verdict = { raw: judge }; }
    res.json({ proposals, verdict });
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
});

router.get('/health', (_req, res) => {
  res.json({ debateServiceAvailable: !!DebateService });
});

module.exports = router;
