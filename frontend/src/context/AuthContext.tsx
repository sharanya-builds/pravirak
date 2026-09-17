import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi, AuthUser, ApiError } from '../api/client';

interface AuthContextValue {
  user: AuthUser | null;
  isGuest: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (name: string, identifier: string, password: string) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'pravirak_token';
const GUEST_KEY = 'pravirak_guest';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(() => localStorage.getItem(GUEST_KEY) === '1');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then(({ user: fetchedUser }) => {
        setUser(fetchedUser);
        setIsGuest(false);
        localStorage.removeItem(GUEST_KEY);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const { user: loggedInUser, token } = await authApi.login({ identifier, password });
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(GUEST_KEY);
    setUser(loggedInUser);
    setIsGuest(false);
  }, []);

  const register = useCallback(async (name: string, identifier: string, password: string) => {
    const isEmail = identifier.includes('@');
    const { user: newUser, token } = await authApi.register({
      name,
      password,
      ...(isEmail ? { email: identifier } : { phone: identifier })
    });
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(GUEST_KEY);
    setUser(newUser);
    setIsGuest(false);
  }, []);

  const continueAsGuest = useCallback(() => {
    localStorage.setItem(GUEST_KEY, '1');
    setIsGuest(true);
    setUser(null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(GUEST_KEY);
    setUser(null);
    setIsGuest(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isGuest, isLoading, login, register, continueAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ApiError };
