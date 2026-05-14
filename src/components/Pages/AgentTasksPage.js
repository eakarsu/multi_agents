import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, Grid, Chip,
  Divider, CircularProgress, Alert, Stack, Paper, IconButton, Tooltip,
  MenuItem
} from '@mui/material';
import { Refresh, Send, Visibility } from '@mui/icons-material';
import api from '../../utils/api';

const statusColor = (s) => ({
  queued: 'default',
  running: 'info',
  completed: 'success',
  failed: 'error',
}[s] || 'default');

export default function AgentTasksPage() {
  const [agentType, setAgentType] = useState('generic');
  const [prompt, setPrompt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submittedTaskId, setSubmittedTaskId] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);

  const [monitor, setMonitor] = useState(null);
  const [monitorLoading, setMonitorLoading] = useState(false);

  const [selected, setSelected] = useState(null);
  const [selectedLoading, setSelectedLoading] = useState(false);

  const loadTasks = useCallback(async () => {
    setTasksLoading(true);
    setTasksError(null);
    try {
      const data = await api.request('/api/agents/tasks');
      setTasks(Array.isArray(data) ? data : (data.tasks || []));
    } catch (err) {
      setTasksError(err.message || err.error || 'Failed to load tasks');
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const loadMonitor = useCallback(async () => {
    setMonitorLoading(true);
    try {
      const data = await api.request('/api/agents/monitor');
      setMonitor(data);
    } catch (err) {
      // best-effort
    } finally {
      setMonitorLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
    loadMonitor();
  }, [loadTasks, loadMonitor]);

  const submitTask = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setSubmitError('Prompt is required');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setSubmittedTaskId(null);
    try {
      const data = await api.request('/api/agents/tasks', {
        method: 'POST',
        body: JSON.stringify({ agentType, prompt }),
      });
      setSubmittedTaskId(data.taskId || data.id || null);
      setPrompt('');
      loadTasks();
      loadMonitor();
    } catch (err) {
      setSubmitError(err.message || err.error || 'Failed to dispatch task');
    } finally {
      setSubmitting(false);
    }
  };

  const viewTask = async (id) => {
    setSelectedLoading(true);
    setSelected({ id, loading: true });
    try {
      const data = await api.request(`/api/agents/tasks/${id}`);
      setSelected(data);
    } catch (err) {
      setSelected({ id, error: err.message || err.error || 'Failed to load task' });
    } finally {
      setSelectedLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Agent Tasks</Typography>
          <Typography variant="body2" color="text.secondary">
            Dispatch async tasks to agents and monitor their status.
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={() => { loadTasks(); loadMonitor(); }} disabled={tasksLoading || monitorLoading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Dispatch a Task</Typography>
              <form onSubmit={submitTask}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Agent Type"
                  value={agentType}
                  onChange={(e) => setAgentType(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  {['generic', 'customer-support', 'content-creation', 'lead-qualification', 'data-analysis'].map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  label="Prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what the agent should do..."
                  sx={{ mb: 2 }}
                />
                {submitError && (
                  <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>
                )}
                {submittedTaskId && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Task dispatched: {submittedTaskId}
                  </Alert>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <Send />}
                  disabled={submitting}
                >
                  {submitting ? 'Dispatching...' : 'Dispatch Task'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Monitor Aggregate</Typography>
              {monitorLoading && <CircularProgress size={20} />}
              {!monitorLoading && monitor && (
                <Box>
                  {monitor.byStatus && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">By status</Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                        {Object.entries(monitor.byStatus).map(([k, v]) => (
                          <Chip key={k} size="small" label={`${k}: ${v}`} color={statusColor(k)} />
                        ))}
                      </Stack>
                    </Box>
                  )}
                  {monitor.byAgent && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">By agent</Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                        {Object.entries(monitor.byAgent).map(([k, v]) => (
                          <Chip key={k} size="small" label={`${k}: ${v}`} variant="outlined" />
                        ))}
                      </Stack>
                    </Box>
                  )}
                  {!monitor.byStatus && !monitor.byAgent && (
                    <Typography variant="body2" color="text.secondary">
                      <pre style={{ margin: 0 }}>{JSON.stringify(monitor, null, 2)}</pre>
                    </Typography>
                  )}
                </Box>
              )}
              {!monitorLoading && !monitor && (
                <Typography variant="body2" color="text.secondary">No monitor data.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6">Recent Tasks</Typography>
                <IconButton size="small" onClick={loadTasks} disabled={tasksLoading}>
                  <Refresh fontSize="small" />
                </IconButton>
              </Stack>
              {tasksError && <Alert severity="error" sx={{ mb: 2 }}>{tasksError}</Alert>}
              {tasksLoading && <CircularProgress size={20} />}
              {!tasksLoading && tasks.length === 0 && (
                <Typography variant="body2" color="text.secondary">No tasks yet.</Typography>
              )}
              <Stack divider={<Divider />} spacing={0}>
                {tasks.map((t) => {
                  const id = t.id || t.taskId;
                  return (
                    <Box key={id} sx={{ py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{id}</Typography>
                        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {(t.prompt || '').slice(0, 80)}
                        </Typography>
                      </Box>
                      <Chip size="small" label={t.status || 'unknown'} color={statusColor(t.status)} />
                      <Chip size="small" label={t.agentType || 'generic'} variant="outlined" />
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => viewTask(id)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>

          {selected && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="h6">Task Detail</Typography>
                  <Button size="small" onClick={() => setSelected(null)}>Close</Button>
                </Stack>
                {selectedLoading && <CircularProgress size={20} />}
                {selected.error && <Alert severity="error">{selected.error}</Alert>}
                {!selectedLoading && !selected.error && (
                  <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'background.default' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
                      {JSON.stringify(selected, null, 2)}
                    </pre>
                  </Paper>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
