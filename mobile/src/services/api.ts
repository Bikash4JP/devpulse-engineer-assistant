// Mobile API Service to communicate with Express Backend

// For Local Testing:
// On Android Emulator, use http://10.0.2.2:5000
// On iOS Simulator or Web/Desktop, use http://localhost:5000
// On a physical device (Expo Go), use your PC's LAN IP shown by `expo start` / `ipconfig`
const API_BASE_URL = 'http://192.168.40.111:5000/api/v1';

export class ApiService {
  /**
   * Register a new engineer account
   */
  static async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data.data; // { user, token }
  }

  /**
   * Login with email and password
   */
  static async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data.data; // { user, token }
  }

  /**
   * Fetch current user profile using JWT Bearer token
   */
  static async getProfile(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    return data.data;
  }
}
