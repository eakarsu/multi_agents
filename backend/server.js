const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

// Load environment variables from root .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import agent services
const AgentService = require('./src/services/AgentService');
const DebateService = require('./src/services/DebateService');

// Import database and seed
const db = require('./src/db/database');
const seed = require('./src/db/seed');

// Import middleware
const { generalLimiter } = require('./src/middleware/rateLimiter');
const { sanitizeBody } = require('./src/middleware/validator');

// Import routes
const authRoutes = require('./src/routes/auth');
const crudRoutes = require('./src/routes/crud');

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 8000;

// Initialize agent service
const agentService = new AgentService();
const debateService = new DebateService();

// Seed database
seed();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);
app.use(sanitizeBody);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CraftAgent Pro Backend',
    version: '2.0.0'
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// CRUD routes
app.use('/api', crudRoutes);
app.use('/api/agent-lifecycle', require('./src/routes/agentLifecycle')); app.use('/api/debate-vote', require('./src/routes/debateVote')); app.use('/api/cost-guardrails', require('./src/routes/costGuardrails')); app.use('/api/flow-editor', require('./src/routes/flowEditor')); app.use('/api/traces', require('./src/routes/traces')); app.use('/api/tool-registry', require('./src/routes/toolRegistry'));

// Anthropic API proxy endpoint
app.post('/api/anthropic/messages', async (req, res) => {
  try {
    const { messages, system, model = 'claude-3-5-sonnet-20241022', max_tokens = 1000 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid request: messages array is required'
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Anthropic API key not configured on server'
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model, max_tokens, system, messages })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorData.error?.message || `Anthropic API Error: ${response.statusText}`,
        status: response.status
      });
    }

    const data = await response.json();
    res.json({
      content: data.content[0]?.text || '',
      usage: data.usage,
      model: data.model
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Customer Support Agent endpoint
app.post('/api/agents/customer-support', async (req, res) => {
  try {
    const { query, context = {}, provider } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });
    const response = await agentService.customerSupport(query, context, provider);
    res.json({ response });
  } catch (error) {
    console.error('Customer Support Agent Error:', error);
    res.status(500).json({ error: 'Failed to process customer support request', message: error.message });
  }
});

// Content Creation Agent endpoint
app.post('/api/agents/content-creation', async (req, res) => {
  try {
    const { contentType, topic, audience, tone = 'professional', provider } = req.body;
    if (!contentType || !topic || !audience) {
      return res.status(400).json({ error: 'contentType, topic, and audience are required' });
    }
    const response = await agentService.contentCreation(contentType, topic, audience, tone, provider);
    res.json({ response });
  } catch (error) {
    console.error('Content Creation Agent Error:', error);
    res.status(500).json({ error: 'Failed to process content creation request', message: error.message });
  }
});

// Lead Qualification Agent endpoint
app.post('/api/agents/lead-qualification', async (req, res) => {
  try {
    const { leadData, provider } = req.body;
    if (!leadData) return res.status(400).json({ error: 'leadData is required' });
    const response = await agentService.leadQualification(leadData, provider);
    res.json({ response });
  } catch (error) {
    console.error('Lead Qualification Agent Error:', error);
    res.status(500).json({ error: 'Failed to process lead qualification request', message: error.message });
  }
});

// Data Analysis Agent endpoint
app.post('/api/agents/data-analysis', async (req, res) => {
  try {
    const { dataDescription, analysisType, businessGoals, provider } = req.body;
    if (!dataDescription || !analysisType || !businessGoals) {
      return res.status(400).json({ error: 'dataDescription, analysisType, and businessGoals are required' });
    }
    const response = await agentService.dataAnalysis(dataDescription, analysisType, businessGoals, provider);
    res.json({ response });
  } catch (error) {
    console.error('Data Analysis Agent Error:', error);
    res.status(500).json({ error: 'Failed to process data analysis request', message: error.message });
  }
});

// Generic Agent endpoint
app.post('/api/agents/generic', async (req, res) => {
  try {
    const { agentType, agentName, task, customPrompt, context, provider } = req.body;
    if (!agentType || !agentName || !task) {
      return res.status(400).json({ error: 'agentType, agentName, and task are required' });
    }
    const response = await agentService.genericAgent(agentType, agentName, task, customPrompt, context || {}, provider);
    res.json({ response, agentInfo: { type: agentType, name: agentName, provider: provider || agentService.defaultProvider } });
  } catch (error) {
    console.error('Generic Agent Error:', error);
    res.status(500).json({ error: 'Failed to process generic agent request', message: error.message });
  }
});

// Get available providers and models
app.get('/api/agents/providers', async (req, res) => {
  try {
    const providers = agentService.getAvailableProviders();
    res.json({ providers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get available providers', message: error.message });
  }
});

// ==========================================
// DEBATE ENDPOINTS
// ==========================================

// Get debate presets (debaters and topics)
app.get('/api/debate/presets', (req, res) => {
  res.json({
    debaters: DebateService.DEBATER_PRESETS,
    topics: DebateService.TOPIC_PRESETS
  });
});

// Run a single debate turn
app.post('/api/debate/turn', async (req, res) => {
  try {
    const { debaterKey, topic, previousArguments = [], roundNumber = 1, totalRounds = 2, provider } = req.body;
    if (!debaterKey || !topic) {
      return res.status(400).json({ error: 'debaterKey and topic are required' });
    }
    const content = await debateService.runDebaterTurn(
      debaterKey, topic, previousArguments, roundNumber, totalRounds, provider
    );
    const preset = DebateService.DEBATER_PRESETS[debaterKey];
    res.json({
      debaterKey,
      debaterName: preset.name,
      avatar: preset.avatar,
      color: preset.color,
      round: roundNumber,
      content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debate Turn Error:', error);
    res.status(500).json({ error: 'Failed to process debate turn', message: error.message });
  }
});

// Generate moderator summary
app.post('/api/debate/summary', async (req, res) => {
  try {
    const { topic, arguments: allArguments, provider } = req.body;
    if (!topic || !allArguments) {
      return res.status(400).json({ error: 'topic and arguments are required' });
    }
    const summary = await debateService.generateModeratorSummary(topic, allArguments, provider);
    res.json({ summary });
  } catch (error) {
    console.error('Debate Summary Error:', error);
    res.status(500).json({ error: 'Failed to generate debate summary', message: error.message });
  }
});

// Run a complete debate (all rounds)
app.post('/api/debate/full', async (req, res) => {
  try {
    const { topic, debaters, rounds = 2, provider } = req.body;
    if (!topic || !debaters || !Array.isArray(debaters) || debaters.length < 2) {
      return res.status(400).json({ error: 'topic and at least 2 debaters are required' });
    }
    const result = await debateService.runFullDebate(topic, debaters, rounds, provider);
    res.json(result);
  } catch (error) {
    console.error('Full Debate Error:', error);
    res.status(500).json({ error: 'Failed to run full debate', message: error.message });
  }
});

// ==========================================
// MULTI-AGENT ORCHESTRATION ENDPOINTS
// ==========================================

// Helper: confirm at least one provider has a key
function _hasAnyProviderKey() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
}

// Run multiple agents in parallel against the same task and aggregate
// POST /api/agents/parallel
// body: { agents: [{ agentType, agentName, customPrompt?, provider? }, ...], task, context?, aggregator?: "concat"|"vote"|"summary" }
app.post('/api/agents/parallel', async (req, res) => {
  try {
    if (!_hasAnyProviderKey()) {
      return res.status(503).json({ error: 'AI provider not configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env to enable this endpoint.' });
    }
    const { agents, task, context, aggregator } = req.body || {};
    if (!Array.isArray(agents) || agents.length === 0) {
      return res.status(400).json({ error: 'agents (non-empty array) is required' });
    }
    if (!task) return res.status(400).json({ error: 'task is required' });

    const startedAt = new Date().toISOString();
    const settled = await Promise.allSettled(
      agents.map((a) =>
        agentService.genericAgent(
          a.agentType || 'generic',
          a.agentName || `agent-${Math.random().toString(36).slice(2, 6)}`,
          task,
          a.customPrompt,
          context || {},
          a.provider
        )
      )
    );

    const results = settled.map((s, i) => ({
      agent: agents[i],
      status: s.status === 'fulfilled' ? 'ok' : 'error',
      output: s.status === 'fulfilled' ? s.value : null,
      error: s.status === 'rejected' ? s.reason?.message || String(s.reason) : null,
    }));

    let aggregated = null;
    const mode = aggregator || 'concat';
    const okOutputs = results.filter((r) => r.status === 'ok').map((r) => r.output);
    if (mode === 'concat') {
      aggregated = okOutputs.join('\n\n---\n\n');
    } else if (mode === 'vote') {
      const counts = {};
      okOutputs.forEach((o) => { counts[o] = (counts[o] || 0) + 1; });
      aggregated = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    } else if (mode === 'summary') {
      try {
        aggregated = await agentService.genericAgent(
          'analyst',
          'aggregator',
          `Combine the following ${okOutputs.length} agent responses to the task ("${task}") into a single concise consensus summary that highlights agreements and disagreements:\n\n${okOutputs.map((o, i) => `[Agent ${i + 1}]\n${o}`).join('\n\n')}`,
          null,
          {},
          undefined
        );
      } catch (e) {
        aggregated = okOutputs.join('\n\n---\n\n');
      }
    } else {
      aggregated = okOutputs.join('\n\n---\n\n');
    }

    res.json({
      task,
      aggregator: mode,
      startedAt,
      completedAt: new Date().toISOString(),
      results,
      aggregated,
      successCount: okOutputs.length,
      failureCount: results.length - okOutputs.length,
    });
  } catch (error) {
    console.error('Agent parallel orchestration error:', error);
    res.status(500).json({ error: 'Failed to run parallel agents', message: error.message });
  }
});

// Run a multi-step agent chain (each step's output is fed into the next)
// POST /api/agents/chain
// body: { steps: [{ agentType, agentName, prompt, provider? }, ...], initialInput?, context? }
app.post('/api/agents/chain', async (req, res) => {
  try {
    if (!_hasAnyProviderKey()) {
      return res.status(503).json({ error: 'AI provider not configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env to enable this endpoint.' });
    }
    const { steps, initialInput, context } = req.body || {};
    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ error: 'steps (non-empty array) is required' });
    }

    const startedAt = new Date().toISOString();
    const trace = [];
    let currentInput = initialInput || '';

    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      if (!s.prompt) {
        trace.push({ step: i + 1, status: 'error', error: 'step.prompt is required' });
        return res.status(400).json({ error: `step ${i + 1} missing prompt`, trace });
      }
      const composed = `${s.prompt}\n\nUpstream input:\n${currentInput || '(none)'}`;
      try {
        const output = await agentService.genericAgent(
          s.agentType || 'generic',
          s.agentName || `step-${i + 1}`,
          composed,
          s.customPrompt || null,
          context || {},
          s.provider
        );
        trace.push({
          step: i + 1,
          agentType: s.agentType || 'generic',
          agentName: s.agentName || `step-${i + 1}`,
          status: 'ok',
          input: currentInput,
          output,
        });
        currentInput = output;
      } catch (err) {
        trace.push({ step: i + 1, status: 'error', error: err.message });
        return res.status(500).json({ error: `step ${i + 1} failed: ${err.message}`, trace });
      }
    }

    res.json({
      startedAt,
      completedAt: new Date().toISOString(),
      finalOutput: currentInput,
      stepCount: steps.length,
      trace,
    });
  } catch (error) {
    console.error('Agent chain orchestration error:', error);
    res.status(500).json({ error: 'Failed to run agent chain', message: error.message });
  }
});

// In-memory task store for agent dispatch (per-process)
const _agentTasks = new Map();
let _taskIdCounter = 1;

// Dispatch a task to a generic agent (asynchronous fire-and-forget with status polling)
app.post('/api/agents/tasks', async (req, res) => {
  try {
    const { agentType, agentName, task, customPrompt, context, provider } = req.body;
    if (!agentType || !agentName || !task) {
      return res.status(400).json({ error: 'agentType, agentName, and task are required' });
    }
    const id = String(_taskIdCounter++);
    const record = {
      id,
      status: 'queued',
      agentType,
      agentName,
      task,
      provider: provider || agentService.defaultProvider,
      createdAt: new Date().toISOString(),
      result: null,
      error: null
    };
    _agentTasks.set(id, record);

    // Run async; don't block the response
    (async () => {
      try {
        record.status = 'running';
        record.startedAt = new Date().toISOString();
        const response = await agentService.genericAgent(
          agentType,
          agentName,
          task,
          customPrompt,
          context || {},
          provider
        );
        record.status = 'done';
        record.result = response;
        record.completedAt = new Date().toISOString();
      } catch (err) {
        record.status = 'failed';
        record.error = err.message;
        record.completedAt = new Date().toISOString();
      }
    })();

    res.status(202).json({ taskId: id, status: record.status });
  } catch (error) {
    console.error('Agent task dispatch error:', error);
    res.status(500).json({ error: 'Failed to dispatch agent task', message: error.message });
  }
});

// Get status of a previously dispatched task
app.get('/api/agents/tasks/:id', (req, res) => {
  const record = _agentTasks.get(req.params.id);
  if (!record) return res.status(404).json({ error: 'Task not found' });
  res.json(record);
});

// List recent tasks (last 50)
app.get('/api/agents/tasks', (req, res) => {
  const tasks = Array.from(_agentTasks.values()).slice(-50).reverse();
  res.json({ tasks });
});

// Aggregate agent monitoring snapshot
app.get('/api/agents/monitor', (req, res) => {
  const tasks = Array.from(_agentTasks.values());
  const byStatus = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});
  const byAgent = tasks.reduce((acc, t) => {
    const k = `${t.agentType}:${t.agentName}`;
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  res.json({
    totalTasks: tasks.length,
    byStatus,
    byAgent,
    providers: agentService.getAvailableProviders ? agentService.getAvailableProviders() : []
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`CraftAgent Pro Backend running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
