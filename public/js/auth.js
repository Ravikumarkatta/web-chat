// Authentication logic for Web chat
class AuthService {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
    this.token = localStorage.getItem('chatToken');
    this.user = JSON.parse(localStorage.getItem('chatUser') || 'null');
  }

  async login(credentials) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      this.token = data.token;
      this.user = data.user;

      localStorage.setItem('chatToken', this.token);
      localStorage.setItem('chatUser', JSON.stringify(this.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('chatToken');
    localStorage.removeItem('chatUser');
    this.token = null;
    this.user = null;
  }

  isAuthenticated() {
    return !!this.token;
  }

  getCurrentUser() {
    return this.user;
  }

  getAuthHeader() {
    return {
      'Authorization': `Bearer ${this.token}`
    };
  }
}

// Export for Node.js testing environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthService;
}
