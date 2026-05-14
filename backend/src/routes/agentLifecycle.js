// Agent lifecycle — create / dispatch / poll / cancel over REST.
const express = require('express');
const { authenticateToken: auth } = require('../middleware/auth');
const router = express.Router();

const jobs = new Map();
const counter = { n: 0 };

let AgentFactory = null;
try { AgentFactory = require('../agents/AgentFactory'); }
catch { try { AgentFactory = require('../services/AgentService'); } catch {} }

// POST /api/agent-lifecycle/create — register an agent definition.
router.post('/create', auth, (req, res) => {
  const id = `a_${++counter.n}`;
  const { type, provider = 'anthropic', config = {} } = req.body;
  if (!type) return res.status(400).json({ error: 'type required' });
  const agentDef = { id, type, provider, config, createdAt: new Date(), state: 'idle' };
  jobs.set(id, agentDef);
  res.json(agentDef);
});

// POST /api/agent-lifecycle/dispatch — start an async run for an agent id.
router.post('/dispatch', auth, async (req, res) => {
  const { agentId, input } = req.body;
  if (!agentId) return res.status(400).json({ error: 'agentId required' });
  const def = jobs.get(agentId);
  if (!def) return res.status(404).json({ error: 'agent not found' });
  const runId = `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  def.state = 'running';
  def.lastRun = { runId, startedAt: new Date(), status: 'running', input, output: null };

  // Fire-and-forget; real impl would call AgentFactory.create(...).run(...)
  setTimeout(async () => {
    try {
      let output = `Agent ${def.type} echoes: ${typeof input === 'string' ? input : JSON.stringify(input)}`;
      if (AgentFactory && typeof AgentFactory === 'function') {
        try {
          const agent = new AgentFactory(def.type, def.config);
          if (typeof agent.run === 'function') output = await agent.run(input);
        } catch (e) {
          output = `Agent error: ${e.message}`;
        }
      }
      def.lastRun.status = 'completed';
      def.lastRun.completedAt = new Date();
      def.lastRun.output = output;
      def.state = 'idle';
    } catch (e) {
      def.lastRun.status = 'failed';
      def.lastRun.error = e.message;
      def.state = 'idle';
    }
  }, 50);

  res.json({ runId, agentId });
});

router.get('/poll/:agentId', auth, (req, res) => {
  const def = jobs.get(req.params.agentId);
  if (!def) return res.status(404).json({ error: 'agent not found' });
  res.json({ id: def.id, state: def.state, lastRun: def.lastRun });
});

router.post('/cancel/:agentId', auth, (req, res) => {
  const def = jobs.get(req.params.agentId);
  if (!def) return res.status(404).json({ error: 'agent not found' });
  if (def.lastRun && def.lastRun.status === 'running') {
    def.lastRun.status = 'cancelled';
    def.lastRun.completedAt = new Date();
  }
  def.state = 'idle';
  res.json({ ok: true, agent: def });
});

router.get('/list', auth, (_req, res) => {
  res.json({ count: jobs.size, agents: [...jobs.values()] });
});

module.exports = router;
