import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, Grid, Chip, Divider,
  CircularProgress, Alert, Stack, Paper, IconButton, MenuItem, Tabs, Tab
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, PlayArrow } from '@mui/icons-material';
import api from '../../utils/api';

const AGENT_TYPES = ['generic', 'analyst', 'researcher', 'writer', 'engineer', 'critic'];

function ParallelTab() {
  const [task, setTask] = useState('');
  const [aggregator, setAggregator] = useState('concat');
  const [agents, setAgents] = useState([
    { agentType: 'analyst', agentName: 'analyst-1', customPrompt: '' },
    { agentType: 'critic', agentName: 'critic-1', customPrompt: '' },
  ]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const updateAgent = (i, key, val) => {
    const next = agents.slice();
    next[i] = { ...next[i], [key]: val };
    setAgents(next);
  };

  const addAgent = () => setAgents([...agents, { agentType: 'generic', agentName: `agent-${agents.length + 1}`, customPrompt: '' }]);
  const removeAgent = (i) => setAgents(agents.filter((_, idx) => idx !== i));

  const submit = async () => {
    setRunning(true); setError(null); setResult(null);
    try {
      const data = await api.request('/api/agents/parallel', {
        method: 'POST',
        body: JSON.stringify({ task, agents, aggregator }),
      });
      setResult(data);
    } catch (err) {
      if (err?.status === 503) {
        setError('AI provider not configured (503): ' + (err.error || err.message || 'Set ANTHROPIC_API_KEY or OPENAI_API_KEY on the server.'));
      } else {
        setError(err?.error || err?.message || 'Failed to run parallel agents');
      }
    } finally {
      setRunning(false);
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Dispatch the same task to multiple agents in parallel and aggregate the responses.
      </Typography>
      <TextField
        label="Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        fullWidth multiline minRows={3} sx={{ mb: 2 }}
      />
      <TextField
        select label="Aggregator" value={aggregator}
        onChange={(e) => setAggregator(e.target.value)}
        sx={{ mb: 2, minWidth: 220 }}
      >
        <MenuItem value="concat">Concatenate</MenuItem>
        <MenuItem value="vote">Majority vote</MenuItem>
        <MenuItem value="summary">LLM summary (consensus)</MenuItem>
      </TextField>

      <Stack spacing={2} sx={{ mb: 2 }}>
        {agents.map((a, i) => (
          <Paper key={i} sx={{ p: 2 }} variant="outlined">
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  select fullWidth label="Type"
                  value={a.agentType}
                  onChange={(e) => updateAgent(i, 'agentType', e.target.value)}
                >
                  {AGENT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Name" value={a.agentName}
                  onChange={(e) => updateAgent(i, 'agentName', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField fullWidth label="Custom Prompt (optional)"
                  value={a.customPrompt || ''}
                  onChange={(e) => updateAgent(i, 'customPrompt', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <IconButton onClick={() => removeAgent(i)} disabled={agents.length <= 1} aria-label="remove">
                  <RemoveCircleOutline />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>
      <Button startIcon={<AddCircleOutline />} onClick={addAgent} sx={{ mr: 2 }}>Add Agent</Button>
      <Button variant="contained" startIcon={<PlayArrow />} onClick={submit}
        disabled={running || !task.trim() || agents.length === 0}>
        {running ? 'Running…' : 'Run Parallel'}
      </Button>
      {running && <CircularProgress size={20} sx={{ ml: 2, verticalAlign: 'middle' }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {result && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={`OK: ${result.successCount}`} color="success" />
              <Chip label={`Failed: ${result.failureCount}`} color={result.failureCount ? 'error' : 'default'} />
              <Chip label={`Aggregator: ${result.aggregator}`} />
            </Stack>
            <Typography variant="subtitle2">Aggregated Output</Typography>
            <Paper variant="outlined" sx={{ p: 2, my: 1, whiteSpace: 'pre-wrap' }}>
              {String(result.aggregated || '(empty)')}
            </Paper>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Per-agent results</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {(result.results || []).map((r, i) => (
                <Paper key={i} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip size="small" label={`${r.agent?.agentType}:${r.agent?.agentName}`} />
                    <Chip size="small" label={r.status} color={r.status === 'ok' ? 'success' : 'error'} />
                  </Stack>
                  <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', fontSize: 12 }}>
                    {r.status === 'ok' ? r.output : r.error}
                  </Box>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

function ChainTab() {
  const [initialInput, setInitialInput] = useState('');
  const [steps, setSteps] = useState([
    { agentType: 'researcher', agentName: 'researcher-1', prompt: 'Gather facts about the topic.' },
    { agentType: 'writer', agentName: 'writer-1', prompt: 'Turn the upstream facts into a 200-word summary.' },
  ]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const updateStep = (i, key, val) => {
    const next = steps.slice();
    next[i] = { ...next[i], [key]: val };
    setSteps(next);
  };
  const addStep = () => setSteps([...steps, { agentType: 'generic', agentName: `step-${steps.length + 1}`, prompt: '' }]);
  const removeStep = (i) => setSteps(steps.filter((_, idx) => idx !== i));

  const submit = async () => {
    setRunning(true); setError(null); setResult(null);
    try {
      const data = await api.request('/api/agents/chain', {
        method: 'POST',
        body: JSON.stringify({ steps, initialInput }),
      });
      setResult(data);
    } catch (err) {
      if (err?.status === 503) {
        setError('AI provider not configured (503): ' + (err.error || err.message || 'Set ANTHROPIC_API_KEY or OPENAI_API_KEY on the server.'));
      } else {
        setError(err?.error || err?.message || 'Chain failed');
      }
    } finally {
      setRunning(false);
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Run a sequential agent chain — each step's output becomes the next step's "Upstream input".
      </Typography>
      <TextField
        label="Initial Input (optional)"
        value={initialInput}
        onChange={(e) => setInitialInput(e.target.value)}
        fullWidth multiline minRows={2} sx={{ mb: 2 }}
      />
      <Stack spacing={2} sx={{ mb: 2 }}>
        {steps.map((s, i) => (
          <Paper key={i} sx={{ p: 2 }} variant="outlined">
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Chip label={`Step ${i + 1}`} color="primary" />
              <IconButton size="small" onClick={() => removeStep(i)} disabled={steps.length <= 1} aria-label="remove">
                <RemoveCircleOutline fontSize="small" />
              </IconButton>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField select fullWidth label="Type" value={s.agentType}
                  onChange={(e) => updateStep(i, 'agentType', e.target.value)}>
                  {AGENT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Name" value={s.agentName}
                  onChange={(e) => updateStep(i, 'agentName', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Prompt" value={s.prompt}
                  onChange={(e) => updateStep(i, 'prompt', e.target.value)} multiline minRows={2} />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>
      <Button startIcon={<AddCircleOutline />} onClick={addStep} sx={{ mr: 2 }}>Add Step</Button>
      <Button variant="contained" startIcon={<PlayArrow />} onClick={submit}
        disabled={running || steps.length === 0}>
        {running ? 'Running…' : 'Run Chain'}
      </Button>
      {running && <CircularProgress size={20} sx={{ ml: 2, verticalAlign: 'middle' }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {result && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle2">Final Output</Typography>
            <Paper variant="outlined" sx={{ p: 2, my: 1, whiteSpace: 'pre-wrap' }}>
              {String(result.finalOutput || '(empty)')}
            </Paper>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Trace</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {(result.trace || []).map((t, i) => (
                <Paper key={i} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip size="small" label={`Step ${t.step}`} />
                    <Chip size="small" label={`${t.agentType}:${t.agentName}`} />
                    <Chip size="small" label={t.status} color={t.status === 'ok' ? 'success' : 'error'} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">Input</Typography>
                  <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', fontSize: 12, mb: 1 }}>
                    {t.input || '(none)'}
                  </Box>
                  <Typography variant="caption" color="text.secondary">Output</Typography>
                  <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', fontSize: 12 }}>
                    {t.status === 'ok' ? t.output : t.error}
                  </Box>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default function AgentOrchestrationPage() {
  const [tab, setTab] = useState(0);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>Agent Orchestration</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Run multiple agents in parallel with aggregation, or chain agents sequentially in a multi-step workflow.
      </Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Parallel" />
        <Tab label="Chain" />
      </Tabs>
      {tab === 0 && <ParallelTab />}
      {tab === 1 && <ChainTab />}
    </Box>
  );
}
