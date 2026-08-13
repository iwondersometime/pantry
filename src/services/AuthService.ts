import { User, AuthState } from '../types';

const TOKEN_STORAGE_KEY = 'pantry_auth_token';
const USER_CACHE_KEY = 'pantry_auth_user';

type AuthListener = (user: User | null, state: AuthState) => void;

class AuthServiceClass {
  private currentUser: User | null = null;
  private authState: AuthState = 'loading';
  private listeners: Set<AuthListener> = new Set();
  private initialized = false;

  constructor() {
    // Attempt cached restoration on instance creation
    try {
      const cached = localStorage.getItem(USER_CACHE_KEY);
      if (cached) {
        this.currentUser = JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Failed to parse cached user:', e);
    }
  }

  public async init(): Promise<User | null> {
    if (this.initialized) return this.currentUser;

    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      this.currentUser = null;
      this.authState = 'unauthenticated';
      this.initialized = true;
      this.notifyListeners();
      return null;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.currentUser = data.user;
        this.authState = 'authenticated';
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
      } else {
        // Token invalid or expired
        this.clearLocalAuth();
      }
    } catch (e) {
      console.warn('Network issue during auth verify, using offline cache if present:', e);
      if (this.currentUser) {
        this.authState = 'authenticated';
      } else {
        this.authState = 'unauthenticated';
      }
    }

    this.initialized = true;
    this.notifyListeners();
    return this.currentUser;
  }

  public async signUp(name: string, email: string, password: string): Promise<User> {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create account.');
    }

    this.setLocalAuth(data.token, data.user);
    return data.user;
  }

  public async login(email: string, password: string): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Invalid credentials.');
    }

    this.setLocalAuth(data.token, data.user);
    return data.user;
  }

  public async loginWithGoogle(name = 'Gourmet Chef', email = 'chef@example.com'): Promise<User> {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Google Sign-In failed.');
    }

    this.setLocalAuth(data.token, data.user);
    return data.user;
  }

  public async requestPasswordReset(email: string): Promise<string> {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to request password reset.');
    }

    return data.message || 'Password reset link dispatched.';
  }

  public async updateProfile(name: string): Promise<User> {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) throw new Error('Unauthenticated');

    const response = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile.');
    }

    this.currentUser = data.user;
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
    this.notifyListeners();
    return data.user;
  }

  public async logout(): Promise<void> {
    this.clearLocalAuth();
  }

  public async deleteAccount(): Promise<void> {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      try {
        await fetch('/api/auth/delete-account', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        console.warn('Network error during delete account API:', e);
      }
    }
    this.clearLocalAuth();
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getAuthState(): AuthState {
    return this.authState;
  }

  public onAuthStateChanged(callback: AuthListener): () => void {
    this.listeners.add(callback);
    // Trigger immediately with current state
    callback(this.currentUser, this.authState);

    return () => {
      this.listeners.delete(callback);
    };
  }

  private setLocalAuth(token: string, user: User) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    this.currentUser = user;
    this.authState = 'authenticated';
    this.notifyListeners();
  }

  private clearLocalAuth() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_CACHE_KEY);
    this.currentUser = null;
    this.authState = 'unauthenticated';
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentUser, this.authState);
      } catch (e) {
        console.error('Error in auth state listener:', e);
      }
    });
  }
}

export const AuthService = new AuthServiceClass();
