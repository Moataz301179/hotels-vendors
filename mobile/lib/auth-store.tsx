import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { User, storeTokens, getAccessToken, clearTokens, storeUser, getUser, clearUser } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: User['role']) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  setRole: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedToken = await getAccessToken();
      const storedUser = await getUser();
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = async (accessToken: string, refreshToken: string, userData: User) => {
    await storeTokens(accessToken, refreshToken);
    await storeUser(userData);
    setToken(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    await clearTokens();
    await clearUser();
    setToken(null);
    setUser(null);
  };

  const setRole = (role: User['role']) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}