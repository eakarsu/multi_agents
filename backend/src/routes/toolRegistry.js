// Plug-in tool registry shared across agents.
const express = require('express');
const { authenticateToken: auth } = require('../middleware/auth');
const router = express.Router();

const tools = new Map();

router.post('/register', auth, (req, res) => {
  const { name, description, parameters, handlerUrl } = req.body;
  if (!name || !handlerUrl) return res.status(400).json({ error: 'name and handlerUrl required' });
  tools.set(name, {
    name,
    description: description || '',
    parameters: parameters || { type: 'object', properties: {} },
    handlerUrl,
    registeredAt: new Date()
  });
  res.json({ ok: true, tool: tools.get(name) });
});

router.get('/', auth, (_req, res) => {
  res.json({ count: tools.size, tools: [...tools.values()] });
});

router.get('/:name', auth, (req, res) => {
  const t = tools.get(req.params.name);
  if (!t) return res.status(404).json({ error: 'not found' });
  res.json(t);
});

router.delete('/:name', auth, (req, res) => {
  const ok = tools.delete(req.params.name);
  res.json({ ok });
});

// POST /api/tool-registry/invoke — call a registered tool by name.
router.post('/invoke', auth, async (req, res) => {
  const { name, args = {} } = req.body;
  const t = tools.get(name);
  if (!t) return res.status(404).json({ error: 'tool not found' });
  try {
    const r = await fetch(t.handlerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args)
    });
    const data = await r.json().catch(() => r.text());
    res.json({ status: r.status, body: data });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

// GET /api/tool-registry/manifest — OpenAI-tool-style manifest for all tools.
router.get('/manifest/openai', auth, (_req, res) => {
  res.json([...tools.values()].map(t => ({
    type: 'function',
    function: { name: t.name, description: t.description, parameters: t.parameters }
  })));
});

module.exports = router;
