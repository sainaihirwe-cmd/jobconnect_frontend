import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jobconnect_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {v
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem('jobconnect_token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      const nextToken = res.data.token;
      localStorage.setItem('jobconnect_token', nextToken);
      setToken(nextToken);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.error('[AUTH] login error', error.response?.data || error.message || error);
      const message = error.response?.data?.message || 'Login failed.';
      throw new Error(message);
    }
  };

  const register = async (payload) => {
    try {
      const res = await api.post('/auth/register', payload);
      // Do not auto-login users after registration; require explicit login.
      return res.data;
    } catch (error) {
      console.error('[AUTH] register error', error.response?.data || error.message || error);
       const message = error.response?.data?.message || 'Registration failed.';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // ignore
    } finally {
      localStorage.removeItem('jobconnect_token');
      setToken('');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
