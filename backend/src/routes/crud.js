const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { requireRole, requireMinRole } = require('../middleware/rbac');
const { sanitizeBody, paginationValidation } = require('../middleware/validator');

const router = express.Router();

// ============ GENERIC CRUD HELPER ============
function buildQuery(table, query, allowedColumns, searchColumns) {
  const { search, sort, order, page = 1, limit = 10, ...filters } = query;
  let where = [];
  let params = [];

  // Search across searchable columns
  if (search && searchColumns.length > 0) {
    const searchClauses = searchColumns.map(col => `${col} LIKE ?`);
    where.push(`(${searchClauses.join(' OR ')})`);
    searchColumns.forEach(() => params.push(`%${search}%`));
  }

  // Filter by specific columns
  for (const [key, value] of Object.entries(filters)) {
    if (allowedColumns.includes(key) && value !== undefined && value !== '') {
      where.push(`${key} = ?`);
      params.push(value);
    }
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
  const sortColumn = allowedColumns.includes(sort) ? sort : 'created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const countSql = `SELECT COUNT(*) as total FROM ${table} ${whereClause}`;
  const dataSql = `SELECT * FROM ${table} ${whereClause} ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;

  const total = db.prepare(countSql).get(...params).total;
  const data = db.prepare(dataSql).all(...params, parseInt(limit), offset);

  return {
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    }
  };
}

// ============ USERS ============
const userColumns = ['id', 'email', 'first_name', 'last_name', 'role', 'department', 'status', 'created_at'];
const userSearch = ['email', 'first_name', 'last_name', 'department'];

router.get('/users', authenticateToken, requireMinRole('manager'), paginationValidation, (req, res) => {
  const result = buildQuery('users', req.query, userColumns, userSearch);
  result.data = result.data.map(u => {
    const { password_hash, password_reset_token, password_reset_expires, email_verification_token, ...safe } = u;
    return safe;
  });
  res.json(result);
});

router.get('/users/:id', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, email, first_name, last_name, role, avatar, phone, department, is_email_verified, last_login, status, created_at, updated_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.put('/users/:id', authenticateToken, requireMinRole('admin'), sanitizeBody, (req, res) => {
  const { firstName, lastName, role, phone, department, status } = req.body;
  const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'User not found' });

  db.prepare('UPDATE users SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), role = COALESCE(?, role), phone = COALESCE(?, phone), department = COALESCE(?, department), status = COALESCE(?, status), updated_at = datetime('now') WHERE id = ?')
    .run(firstName, lastName, role, phone, department, status, req.params.id);

  const user = db.prepare('SELECT id, email, first_name, last_name, role, phone, department, status, updated_at FROM users WHERE id = ?').get(req.params.id);
  res.json(user);
});

router.delete('/users/:id', authenticateToken, requireRole('admin'), (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete your own account' });
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
});

// Bulk delete users
router.post('/users/bulk-delete', authenticateToken, requireRole('admin'), (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });

  const filtered = ids.filter(id => id !== req.user.id);
  const placeholders = filtered.map(() => '?').join(',');
  const result = db.prepare(`DELETE FROM users WHERE id IN (${placeholders})`).run(...filtered);
  res.json({ message: `${result.changes} users deleted` });
});

// Bulk update users
router.post('/users/bulk-update', authenticateToken, requireRole('admin'), sanitizeBody, (req, res) => {
  const { ids, updates } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });

  const allowedUpdates = ['role', 'status', 'department'];
  const setClauses = [];
  const setValues = [];
  for (const [key, value] of Object.entries(updates || {})) {
    if (allowedUpdates.includes(key)) {
      setClauses.push(`${key} = ?`);
      setValues.push(value);
    }
  }
  if (setClauses.length === 0) return res.status(400).json({ error: 'No valid updates provided' });

  setClauses.push('updated_at = datetime('now')');
  const placeholders = ids.map(() => '?').join(',');
  db.prepare(`UPDATE users SET ${setClauses.join(', ')} WHERE id IN (${placeholders})`).run(...setValues, ...ids);
  res.json({ message: `${ids.length} users updated` });
});

// ============ AGENTS ============
const agentColumns = ['id', 'name', 'type', 'category', 'status', 'provider', 'created_by', 'created_at', 'success_rate', 'total_conversations'];
const agentSearch = ['name', 'category', 'description'];

router.get('/agents', optionalAuth, paginationValidation, (req, res) => {
  const result = buildQuery('agents', req.query, agentColumns, agentSearch);
  res.json(result);
});

router.get('/agents/:id', optionalAuth, (req, res) => {
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json(agent);
});

router.post('/agents', authenticateToken, requireMinRole('user'), sanitizeBody, (req, res) => {
  const { name, type, category, description, provider, model, systemPrompt } = req.body;
  if (!name || !type || !category) return res.status(400).json({ error: 'name, type, and category are required' });

  const id = uuidv4();
  db.prepare(`INSERT INTO agents (id, name, type, category, description, provider, model, system_prompt, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, name, type, category, description, provider || 'anthropic', model || 'claude-3-5-sonnet-20241022', systemPrompt, req.user.id);

  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
  res.status(201).json(agent);
});

router.put('/agents/:id', authenticateToken, requireMinRole('user'), sanitizeBody, (req, res) => {
  const { name, type, category, description, status, provider, model, systemPrompt } = req.body;
  const existing = db.prepare('SELECT id FROM agents WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Agent not found' });

  db.prepare('UPDATE agents SET name = COALESCE(?, name), type = COALESCE(?, type), category = COALESCE(?, category), description = COALESCE(?, description), status = COALESCE(?, status), provider = COALESCE(?, provider), model = COALESCE(?, model), system_prompt = COALESCE(?, system_prompt), updated_at = datetime('now') WHERE id = ?')
    .run(name, type, category, description, status, provider, model, systemPrompt, req.params.id);

  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(req.params.id);
  res.json(agent);
});

router.delete('/agents/:id', authenticateToken, requireMinRole('manager'), (req, res) => {
  const result = db.prepare('DELETE FROM agents WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Agent not found' });
  res.json({ message: 'Agent deleted' });
});

router.post('/agents/bulk-delete', authenticateToken, requireMinRole('manager'), (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });
  const placeholders = ids.map(() => '?').join(',');
  const result = db.prepare(`DELETE FROM agents WHERE id IN (${placeholders})`).run(...ids);
  res.json({ message: `${result.changes} agents deleted` });
});

router.post('/agents/bulk-update', authenticateToken, requireMinRole('manager'), sanitizeBody, (req, res) => {
  const { ids, updates } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });
  const allowedUpdates = ['status', 'provider'];
  const setClauses = [];
  const setValues = [];
  for (const [key, value] of Object.entries(updates || {})) {
    if (allowedUpdates.includes(key)) { setClauses.push(`${key} = ?`); setValues.push(value); }
  }
  if (setClauses.length === 0) return res.status(400).json({ error: 'No valid updates' });
  setClauses.push('updated_at = datetime('now')');
  const placeholders = ids.map(() => '?').join(',');
  db.prepare(`UPDATE agents SET ${setClauses.join(', ')} WHERE id IN (${placeholders})`).run(...setValues, ...ids);
  res.json({ message: `${ids.length} agents updated` });
});

// ============ TASKS ============
const taskColumns = ['id', 'title', 'status', 'priority', 'agent_id', 'assigned_to', 'due_date', 'created_by', 'created_at'];
const taskSearch = ['title', 'description', 'tags'];

router.get('/tasks', optionalAuth, paginationValidation, (req, res) => {
  const result = buildQuery('tasks', req.query, taskColumns, taskSearch);
  res.json(result);
});

router.get('/tasks/:id', optionalAuth, (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

router.post('/tasks', authenticateToken, sanitizeBody, (req, res) => {
  const { title, description, agentId, assignedTo, priority, dueDate, tags } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const id = uuidv4();
  db.prepare(`INSERT INTO tasks (id, title, description, agent_id, assigned_to, priority, due_date, tags, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, title, description, agentId, assignedTo, priority || 'medium', dueDate, JSON.stringify(tags || []), req.user.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.status(201).json(task);
});

router.put('/tasks/:id', authenticateToken, sanitizeBody, (req, res) => {
  const { title, description, agentId, assignedTo, status, priority, dueDate, tags } = req.body;
  const existing = db.prepare('SELECT id FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  const completedAt = status === 'completed' ? new Date().toISOString() : null;
  db.prepare('UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), agent_id = COALESCE(?, agent_id), assigned_to = COALESCE(?, assigned_to), status = COALESCE(?, status), priority = COALESCE(?, priority), due_date = COALESCE(?, due_date), tags = COALESCE(?, tags), completed_at = COALESCE(?, completed_at), updated_at = datetime('now') WHERE id = ?')
    .run(title, description, agentId, assignedTo, status, priority, dueDate, tags ? JSON.stringify(tags) : null, completedAt, req.params.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json(task);
});

router.delete('/tasks/:id', authenticateToken, (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

router.post('/tasks/bulk-delete', authenticateToken, (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });
  const placeholders = ids.map(() => '?').join(',');
  const result = db.prepare(`DELETE FROM tasks WHERE id IN (${placeholders})`).run(...ids);
  res.json({ message: `${result.changes} tasks deleted` });
});

router.post('/tasks/bulk-update', authenticateToken, sanitizeBody, (req, res) => {
  const { ids, updates } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });
  const allowedUpdates = ['status', 'priority', 'assigned_to'];
  const setClauses = [];
  const setValues = [];
  for (const [key, value] of Object.entries(updates || {})) {
    if (allowedUpdates.includes(key)) { setClauses.push(`${key} = ?`); setValues.push(value); }
  }
  if (setClauses.length === 0) return res.status(400).json({ error: 'No valid updates' });
  setClauses.push('updated_at = datetime('now')');
  const placeholders = ids.map(() => '?').join(',');
  db.prepare(`UPDATE tasks SET ${setClauses.join(', ')} WHERE id IN (${placeholders})`).run(...setValues, ...ids);
  res.json({ message: `${ids.length} tasks updated` });
});

// ============ TEMPLATES ============
const templateColumns = ['id', 'name', 'category', 'agent_type', 'is_public', 'usage_count', 'rating', 'created_by', 'created_at'];
const templateSearch = ['name', 'description', 'category'];

router.get('/templates', optionalAuth, paginationValidation, (req, res) => {
  const result = buildQuery('templates', req.query, templateColumns, templateSearch);
  res.json(result);
});

router.get('/templates/:id', optionalAuth, (req, res) => {
  const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(req.params.id);
  if (!template) return res.status(404).json({ error: 'Template not found' });
  res.json(template);
});

router.post('/templates', authenticateToken, sanitizeBody, (req, res) => {
  const { name, description, category, agentType, systemPrompt, sampleTasks, isPublic } = req.body;
  if (!name || !category || !agentType) return res.status(400).json({ error: 'name, category, and agentType required' });
  const id = uuidv4();
  db.prepare(`INSERT INTO templates (id, name, description, category, agent_type, system_prompt, sample_tasks, is_public, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, name, description, category, agentType, systemPrompt, JSON.stringify(sampleTasks || []), isPublic ? 1 : 0, req.user.id);
  const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(id);
  res.status(201).json(template);
});

router.put('/templates/:id', authenticateToken, sanitizeBody, (req, res) => {
  const { name, description, category, agentType, systemPrompt, sampleTasks, isPublic } = req.body;
  const existing = db.prepare('SELECT id FROM templates WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Template not found' });
  db.prepare('UPDATE templates SET name = COALESCE(?, name), description = COALESCE(?, description), category = COALESCE(?, category), agent_type = COALESCE(?, agent_type), system_prompt = COALESCE(?, system_prompt), sample_tasks = COALESCE(?, sample_tasks), is_public = COALESCE(?, is_public), updated_at = datetime('now') WHERE id = ?')
    .run(name, description, category, agentType, systemPrompt, sampleTasks ? JSON.stringify(sampleTasks) : null, isPublic !== undefined ? (isPublic ? 1 : 0) : null, req.params.id);
  const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(req.params.id);
  res.json(template);
});

router.delete('/templates/:id', authenticateToken, (req, res) => {
  const result = db.prepare('DELETE FROM templates WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Template not found' });
  res.json({ message: 'Template deleted' });
});

router.post('/templates/bulk-delete', authenticateToken, requireMinRole('manager'), (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });
  const placeholders = ids.map(() => '?').join(',');
  const result = db.prepare(`DELETE FROM templates WHERE id IN (${placeholders})`).run(...ids);
  res.json({ message: `${result.changes} templates deleted` });
});

// ============ CONVERSATIONS ============
const convColumns = ['id', 'title', 'agent_id', 'user_id', 'status', 'satisfaction', 'message_count', 'created_at'];
const convSearch = ['title', 'last_message'];

router.get('/conversations', optionalAuth, paginationValidation, (req, res) => {
  const result = buildQuery('conversations', req.query, convColumns, convSearch);
  res.json(result);
});

router.get('/conversations/:id', optionalAuth, (req, res) => {
  const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });
  res.json(conv);
});

router.post('/conversations', authenticateToken, sanitizeBody, (req, res) => {
  const { title, agentId } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const id = uuidv4();
  db.prepare(`INSERT INTO conversations (id, title, agent_id, user_id) VALUES (?, ?, ?, ?)`)
    .run(id, title, agentId, req.user.id);
  const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id);
  res.status(201).json(conv);
});

router.put('/conversations/:id', authenticateToken, sanitizeBody, (req, res) => {
  const { title, status, satisfaction, lastMessage, messageCount } = req.body;
  const existing = db.prepare('SELECT id FROM conversations WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Conversation not found' });
  db.prepare('UPDATE conversations SET title = COALESCE(?, title), status = COALESCE(?, status), satisfaction = COALESCE(?, satisfaction), last_message = COALESCE(?, last_message), message_count = COALESCE(?, message_count), updated_at = datetime('now') WHERE id = ?')
    .run(title, status, satisfaction, lastMessage, messageCount, req.params.id);
  const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(req.params.id);
  res.json(conv);
});

router.delete('/conversations/:id', authenticateToken, (req, res) => {
  const result = db.prepare('DELETE FROM conversations WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Conversation not found' });
  res.json({ message: 'Conversation deleted' });
});

router.post('/conversations/bulk-delete', authenticateToken, (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });
  const placeholders = ids.map(() => '?').join(',');
  const result = db.prepare(`DELETE FROM conversations WHERE id IN (${placeholders})`).run(...ids);
  res.json({ message: `${result.changes} conversations deleted` });
});

// ============ REPORTS ============
const reportColumns = ['id', 'title', 'type', 'status', 'agent_id', 'generated_by', 'created_at'];
const reportSearch = ['title', 'description'];

router.get('/reports', optionalAuth, paginationValidation, (req, res) => {
  const result = buildQuery('reports', req.query, reportColumns, reportSearch);
  res.json(result);
});

router.get('/reports/:id', optionalAuth, (req, res) => {
  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
});

router.post('/reports', authenticateToken, sanitizeBody, (req, res) => {
  const { title, description, type, agentId, data } = req.body;
  if (!title || !type) return res.status(400).json({ error: 'title and type required' });
  const id = uuidv4();
  db.prepare(`INSERT INTO reports (id, title, description, type, agent_id, data, generated_by) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(id, title, description, type, agentId, JSON.stringify(data || {}), req.user.id);
  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  res.status(201).json(report);
});

router.put('/reports/:id', authenticateToken, sanitizeBody, (req, res) => {
  const { title, description, type, status, data } = req.body;
  const existing = db.prepare('SELECT id FROM reports WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Report not found' });
  db.prepare('UPDATE reports SET title = COALESCE(?, title), description = COALESCE(?, description), type = COALESCE(?, type), status = COALESCE(?, status), data = COALESCE(?, data), updated_at = datetime('now') WHERE id = ?')
    .run(title, description, type, status, data ? JSON.stringify(data) : null, req.params.id);
  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
  res.json(report);
});

router.delete('/reports/:id', authenticateToken, (req, res) => {
  const result = db.prepare('DELETE FROM reports WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Report not found' });
  res.json({ message: 'Report deleted' });
});

router.post('/reports/bulk-delete', authenticateToken, requireMinRole('manager'), (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });
  const placeholders = ids.map(() => '?').join(',');
  const result = db.prepare(`DELETE FROM reports WHERE id IN (${placeholders})`).run(...ids);
  res.json({ message: `${result.changes} reports deleted` });
});

// ============ INTEGRATIONS ============
const intColumns = ['id', 'name', 'type', 'provider', 'status', 'created_by', 'created_at', 'last_sync'];
const intSearch = ['name', 'provider'];

router.get('/integrations', optionalAuth, paginationValidation, (req, res) => {
  const result = buildQuery('integrations', req.query, intColumns, intSearch);
  res.json(result);
});

router.get('/integrations/:id', optionalAuth, (req, res) => {
  const integration = db.prepare('SELECT * FROM integrations WHERE id = ?').get(req.params.id);
  if (!integration) return res.status(404).json({ error: 'Integration not found' });
  res.json(integration);
});

router.post('/integrations', authenticateToken, requireMinRole('manager'), sanitizeBody, (req, res) => {
  const { name, type, provider, config } = req.body;
  if (!name || !type || !provider) return res.status(400).json({ error: 'name, type, and provider required' });
  const id = uuidv4();
  db.prepare(`INSERT INTO integrations (id, name, type, provider, config, created_by) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(id, name, type, provider, JSON.stringify(config || {}), req.user.id);
  const integration = db.prepare('SELECT * FROM integrations WHERE id = ?').get(id);
  res.status(201).json(integration);
});

router.put('/integrations/:id', authenticateToken, requireMinRole('manager'), sanitizeBody, (req, res) => {
  const { name, type, provider, status, config } = req.body;
  const existing = db.prepare('SELECT id FROM integrations WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Integration not found' });
  db.prepare('UPDATE integrations SET name = COALESCE(?, name), type = COALESCE(?, type), provider = COALESCE(?, provider), status = COALESCE(?, status), config = COALESCE(?, config), updated_at = datetime('now') WHERE id = ?')
    .run(name, type, provider, status, config ? JSON.stringify(config) : null, req.params.id);
  const integration = db.prepare('SELECT * FROM integrations WHERE id = ?').get(req.params.id);
  res.json(integration);
});

router.delete('/integrations/:id', authenticateToken, requireMinRole('manager'), (req, res) => {
  const result = db.prepare('DELETE FROM integrations WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Integration not found' });
  res.json({ message: 'Integration deleted' });
});

router.post('/integrations/bulk-delete', authenticateToken, requireRole('admin'), (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });
  const placeholders = ids.map(() => '?').join(',');
  const result = db.prepare(`DELETE FROM integrations WHERE id IN (${placeholders})`).run(...ids);
  res.json({ message: `${result.changes} integrations deleted` });
});

// ============ NOTIFICATIONS ============
const notifColumns = ['id', 'user_id', 'title', 'type', 'is_read', 'created_at'];
const notifSearch = ['title', 'message'];

router.get('/notifications', optionalAuth, paginationValidation, (req, res) => {
  const result = buildQuery('notifications', req.query, notifColumns, notifSearch);
  res.json(result);
});

router.get('/notifications/:id', optionalAuth, (req, res) => {
  const notif = db.prepare('SELECT * FROM notifications WHERE id = ?').get(req.params.id);
  if (!notif) return res.status(404).json({ error: 'Notification not found' });
  res.json(notif);
});

router.put('/notifications/:id/read', authenticateToken, (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);
  res.json({ message: 'Notification marked as read' });
});

router.delete('/notifications/:id', authenticateToken, (req, res) => {
  const result = db.prepare('DELETE FROM notifications WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Notification not found' });
  res.json({ message: 'Notification deleted' });
});

router.post('/notifications/bulk-delete', authenticateToken, (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });
  const placeholders = ids.map(() => '?').join(',');
  const result = db.prepare(`DELETE FROM notifications WHERE id IN (${placeholders})`).run(...ids);
  res.json({ message: `${result.changes} notifications deleted` });
});

// ============ EXPORT ENDPOINTS ============
router.get('/export/:entity', authenticateToken, (req, res) => {
  const { entity } = req.params;
  const { format = 'csv' } = req.query;
  const allowedEntities = ['users', 'agents', 'tasks', 'templates', 'conversations', 'reports', 'integrations', 'notifications'];

  if (!allowedEntities.includes(entity)) {
    return res.status(400).json({ error: 'Invalid entity' });
  }

  const data = db.prepare(`SELECT * FROM ${entity}`).all();

  if (format === 'csv') {
    if (data.length === 0) return res.status(200).send('');
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    for (const row of data) {
      csvRows.push(headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        const str = String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(','));
    }
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${entity}_export.csv"`);
    return res.send(csvRows.join('\n'));
  }

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${entity}_export.json"`);
    return res.json(data);
  }

  res.status(400).json({ error: 'Unsupported format. Use csv or json.' });
});

module.exports = router;
