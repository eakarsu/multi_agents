// Replayable agent traces for evals and regression testing.
const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticateToken: auth } = require('../middleware/auth');
const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'traces');
try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}

router.post('/record', auth, (req, res) => {
  const { agentId, input, steps = [], output } = req.body;
  const id = `tr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const trace = { id, agentId, input, steps, output, recordedAt: new Date() };
  try {
    fs.writeFileSync(path.join(DATA_DIR, `${id}.json`), JSON.stringify(trace, null, 2));
    res.json(trace);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', auth, (_req, res) => {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  res.json({
    count: files.length,
    traces: files.slice(0, 100).map(f => {
      try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8')); }
      catch { return null; }
    }).filter(Boolean)
  });
});

router.get('/:id', auth, (req, res) => {
  try {
    res.json(JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${req.params.id}.json`), 'utf8')));
  } catch {
    res.status(404).json({ error: 'trace not found' });
  }
});

// POST /api/traces/:id/replay — replay the trace inputs against an agent endpoint.
router.post('/:id/replay', auth, async (req, res) => {
  try {
    const tr = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${req.params.id}.json`), 'utf8'));
    const target = req.body.targetUrl || 'http://localhost:8000/api/agents/generic';
    const r = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: tr.input?.prompt || JSON.stringify(tr.input) })
    });
    const out = await r.text();
    res.json({
      original: tr.output,
      replay: out,
      match: typeof tr.output === 'string' && out.includes(tr.output.slice(0, 40))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
