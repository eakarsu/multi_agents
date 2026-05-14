// Visual flow editor for swarm topology — persists graphs to disk.
const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticateToken: auth } = require('../middleware/auth');
const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'flows');
try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}

function flowPath(id) {
  return path.join(DATA_DIR, `${id}.json`);
}

router.post('/', auth, (req, res) => {
  const { name, nodes = [], edges = [] } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const id = `flow_${Date.now()}`;
  const flow = { id, name, nodes, edges, createdAt: new Date(), updatedAt: new Date() };
  try {
    fs.writeFileSync(flowPath(id), JSON.stringify(flow, null, 2));
    res.json(flow);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', auth, (_req, res) => {
  try {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    res.json({
      count: files.length,
      flows: files.map(f => {
        try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8')); }
        catch { return null; }
      }).filter(Boolean)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', auth, (req, res) => {
  try {
    res.json(JSON.parse(fs.readFileSync(flowPath(req.params.id), 'utf8')));
  } catch {
    res.status(404).json({ error: 'flow not found' });
  }
});

router.put('/:id', auth, (req, res) => {
  try {
    const p = flowPath(req.params.id);
    const cur = JSON.parse(fs.readFileSync(p, 'utf8'));
    const updated = { ...cur, ...req.body, updatedAt: new Date() };
    fs.writeFileSync(p, JSON.stringify(updated, null, 2));
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/flow-editor/:id/validate — quick DAG validation.
router.post('/:id/validate', auth, (req, res) => {
  try {
    const f = JSON.parse(fs.readFileSync(flowPath(req.params.id), 'utf8'));
    const nodes = new Set(f.nodes.map(n => n.id));
    const dangling = [];
    const cycles = [];
    const adj = new Map();
    for (const e of f.edges || []) {
      if (!nodes.has(e.from) || !nodes.has(e.to)) dangling.push(e);
      adj.set(e.from, [...(adj.get(e.from) || []), e.to]);
    }
    // simple DFS cycle detection
    const visiting = new Set(), visited = new Set();
    function dfs(n, path = []) {
      if (visiting.has(n)) { cycles.push([...path, n]); return; }
      if (visited.has(n)) return;
      visiting.add(n);
      for (const nx of adj.get(n) || []) dfs(nx, [...path, n]);
      visiting.delete(n);
      visited.add(n);
    }
    for (const n of nodes) dfs(n);
    res.json({ ok: !dangling.length && !cycles.length, dangling, cycles });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
