import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const register = async (data) => {
    try {
      const response = await authService.register(data);
      const { token, userId, name, email, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ userId, name, email, role }));
      setUser({ userId, name, email, role });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (data) => {
    try {
      const response = await authService.login(data);
      const { token, userId, name, email, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ userId, name, email, role }));
      setUser({ userId, name, email, role });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
