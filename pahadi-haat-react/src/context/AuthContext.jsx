import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';
import { setToken } from '../api/client';

const AuthContext = createContext(null);
const STORAGE_KEY = 'pahadihaat_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* localStorage unavailable — ignore, auth just won't persist */
    }
  }, [user]);

  const applyAuthResponse = (res) => {
    // res: { token, role, name, email }
    setToken(res.token);
    setUser({ role: res.role, name: res.name, email: res.email });
    return res;
  };

  const login = async (email, password, role) => applyAuthResponse(await authApi.login({ email, password, role }));

  const signup = async ({ firstName, lastName, email, password, phone }) =>
    applyAuthResponse(await authApi.signup({ firstName, lastName, email, password, phone }));

  const registerSeller = async (payload) => applyAuthResponse(await authApi.registerSeller(payload));

  const registerDriver = async (payload) => applyAuthResponse(await authApi.registerDriver(payload));

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, registerSeller, registerDriver, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
