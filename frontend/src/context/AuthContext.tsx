import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    targetRole?: string;
  }) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with server in background
        authApi.getMe()
          .then((freshUser) => {
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
          })
          .catch(() => {
            // Token likely expired
            logout();
          })
          .finally(() => setLoading(false));
        return;
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (res: AuthResponse) => {
    const userObj: User = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role,
      targetRole: res.targetRole,
    };
    setToken(res.token);
    setUser(userObj);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(userObj));
    return res;
  };

  const login = async (credentials: { email: string; password: string }) => {
    const cleanCredentials = {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password.trim(),
    };
    const res = await authApi.login(cleanCredentials);
    return handleAuthSuccess(res);
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    targetRole?: string;
  }) => {
    const cleanUserData = {
      ...userData,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password.trim(),
      confirmPassword: userData.confirmPassword.trim(),
    };
    const res = await authApi.register(cleanUserData);
    return handleAuthSuccess(res);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      const merged = { ...user, ...updated };
      setUser(merged);
      localStorage.setItem('user', JSON.stringify(merged));
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
