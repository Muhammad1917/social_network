const BASE_URL = 'http://localhost:8000/api';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  setTokens(access, refresh) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  async request(endpoint, options = {}) {
    const { method = 'GET', body, auth = true, params } = options;

    const headers = {};
    if (body) {
      headers['Content-Type'] = 'application/json';
    }
    if (auth) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams}`;
    }

    const config = { method, headers };
    if (body) {
      config.body = JSON.stringify(body);
    }

    let response = await fetch(url, config);

    if (response.status === 401 && auth) {
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${this.getAccessToken()}`;
        response = await fetch(url, config);
      }
    }

    const data = await response.json();
    if (!response.ok) {
      const detail = data.detail || Object.values(data).flat().join(', ') || 'Request failed';
      throw new Error(detail);
    }
    return data;
  }

  async tryRefresh() {
    const refresh = this.getRefreshToken();
    if (!refresh) return false;
    try {
      const res = await fetch(`${this.baseUrl}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) {
        this.clearTokens();
        return false;
      }
      const data = await res.json();
      this.setTokens(data.access, data.refresh || refresh);
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  register(email, username, password) {
    return this.request('/auth/register/', {
      method: 'POST',
      auth: false,
      body: { email, username, password },
    });
  }

  login(email, password) {
    return this.request('/auth/login/', {
      method: 'POST',
      auth: false,
      body: { email, password },
    });
  }

  logout(refreshToken) {
    return this.request('/auth/logout/', {
      method: 'POST',
      body: { refresh: refreshToken },
    });
  }

  getMe() {
    return this.request('/auth/me/');
  }

  verifyEmail(token) {
    return this.request('/auth/verify-email/', {
      method: 'POST',
      auth: false,
      body: { token },
    });
  }

  passwordReset(email) {
    return this.request('/auth/password-reset/', {
      method: 'POST',
      auth: false,
      body: { email },
    });
  }

  passwordResetConfirm(uid, token, newPassword) {
    return this.request('/auth/password-reset/confirm/', {
      method: 'POST',
      auth: false,
      body: { uid, token, new_password: newPassword },
    });
  }
}

const api = new ApiClient();
export default api;
