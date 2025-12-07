import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const res = await api.get('/users/profile');
          setUser(res.data);
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password
      });

      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 
                    error.response?.data?.errors?.[0]?.msg ||
                    'Registration failed';
      throw new Error(message);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', {
        username,
        password
      });

      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 
                    error.response?.data?.errors?.[0]?.msg ||
                    'Login failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
