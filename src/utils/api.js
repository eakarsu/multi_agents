const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

class Api {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, ...data };
    return data;
  }

  // Auth
  async register(userData) { return this.request('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) }); }
  async login(email, password) { return this.request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); }
  async logout() { return this.request('/api/auth/logout', { method: 'POST' }); }
  async forgotPassword(email) { return this.request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }); }
  async resetPassword(token, newPassword) { return this.request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }); }
  async changePassword(currentPassword, newPassword) { return this.request('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }); }
  async verifyEmail(token) { return this.request(`/api/auth/verify-email/${token}`); }
  async getProfile() { return this.request('/api/auth/me'); }
  async updateProfile(data) { return this.request('/api/auth/profile', { method: 'PUT', body: JSON.stringify(data) }); }

  // Generic CRUD
  async getList(entity, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/${entity}?${query}`);
  }
  async getOne(entity, id) { return this.request(`/api/${entity}/${id}`); }
  async create(entity, data) { return this.request(`/api/${entity}`, { method: 'POST', body: JSON.stringify(data) }); }
  async update(entity, id, data) { return this.request(`/api/${entity}/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async remove(entity, id) { return this.request(`/api/${entity}/${id}`, { method: 'DELETE' }); }
  async bulkDelete(entity, ids) { return this.request(`/api/${entity}/bulk-delete`, { method: 'POST', body: JSON.stringify({ ids }) }); }
  async bulkUpdate(entity, ids, updates) { return this.request(`/api/${entity}/bulk-update`, { method: 'POST', body: JSON.stringify({ ids, updates }) }); }

  // Export
  async exportData(entity, format = 'csv') {
    const token = this.getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}/api/export/${entity}?format=${format}`, { headers });
    if (!res.ok) throw new Error('Export failed');
    return res;
  }

  // Notifications
  async markNotificationRead(id) { return this.request(`/api/notifications/${id}/read`, { method: 'PUT' }); }
}

const api = new Api();
export default api;
