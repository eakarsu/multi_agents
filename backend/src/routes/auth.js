const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const db = require('../db/database');
const { generateToken, authenticateToken, JWT_SECRET } = require('../middleware/auth');
const { registerValidation, loginValidation, changePasswordValidation } = require('../middleware/validator');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Register
router.post('/register', authLimiter, registerValidation, (req, res) => {
  const { email, password, firstName, lastName, phone, department } = req.body;

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const id = uuidv4();

  db.prepare(`INSERT INTO users (id, email, password_hash, first_name, last_name, phone, department, email_verification_token)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, email, passwordHash, firstName, lastName, phone || null, department || null, verificationToken);

  const user = db.prepare('SELECT id, email, first_name, last_name, role, status FROM users WHERE id = ?').get(id);
  const token = generateToken(user);

  res.status(201).json({
    message: 'Registration successful. Please verify your email.',
    token,
    user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role },
    verificationToken
  });
});

// Login
router.post('/login', authLimiter, loginValidation, (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  if (user.status !== 'active') {
    return res.status(403).json({ error: 'Account is ' + user.status });
  }
  if (!bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  db.prepare('UPDATE users SET last_login = datetime("now") WHERE id = ?').run(user.id);
  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name,
      role: user.role, department: user.department, isEmailVerified: !!user.is_email_verified
    }
  });
});

// Logout (client-side token removal, server-side we just acknowledge)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Forgot password
router.post('/forgot-password', authLimiter, (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.json({ message: 'If an account exists with that email, a reset link has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

  db.prepare('UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?')
    .run(resetToken, expires, user.id);

  res.json({ message: 'If an account exists with that email, a reset link has been sent.', resetToken });
});

// Reset password
router.post('/reset-password', authLimiter, (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password are required' });

  if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const user = db.prepare('SELECT id, password_reset_expires FROM users WHERE password_reset_token = ?').get(token);
  if (!user) return res.status(400).json({ error: 'Invalid or expired reset token' });

  if (new Date(user.password_reset_expires) < new Date()) {
    return res.status(400).json({ error: 'Reset token has expired' });
  }

  const passwordHash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL, updated_at = datetime("now") WHERE id = ?')
    .run(passwordHash, user.id);

  res.json({ message: 'Password has been reset successfully' });
});

// Change password
router.post('/change-password', authenticateToken, changePasswordValidation, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  const passwordHash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?')
    .run(passwordHash, req.user.id);

  res.json({ message: 'Password changed successfully' });
});

// Verify email
router.get('/verify-email/:token', (req, res) => {
  const { token } = req.params;
  const user = db.prepare('SELECT id FROM users WHERE email_verification_token = ?').get(token);

  if (!user) return res.status(400).json({ error: 'Invalid verification token' });

  db.prepare('UPDATE users SET is_email_verified = 1, email_verification_token = NULL, updated_at = datetime("now") WHERE id = ?')
    .run(user.id);

  res.json({ message: 'Email verified successfully' });
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, email, first_name, last_name, role, avatar, phone, department, is_email_verified, last_login, status, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json({
    id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name,
    role: user.role, avatar: user.avatar, phone: user.phone, department: user.department,
    isEmailVerified: !!user.is_email_verified, lastLogin: user.last_login, status: user.status, createdAt: user.created_at
  });
});

// Update profile
router.put('/profile', authenticateToken, (req, res) => {
  const { firstName, lastName, phone, department, avatar } = req.body;

  db.prepare('UPDATE users SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), phone = COALESCE(?, phone), department = COALESCE(?, department), avatar = COALESCE(?, avatar), updated_at = datetime("now") WHERE id = ?')
    .run(firstName, lastName, phone, department, avatar, req.user.id);

  const user = db.prepare('SELECT id, email, first_name, last_name, role, avatar, phone, department FROM users WHERE id = ?').get(req.user.id);
  res.json({ message: 'Profile updated', user });
});

module.exports = router;
