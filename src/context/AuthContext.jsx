import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const clearStorage = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

const readStoredSession = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return { token: null, user: null };

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.expiresAt && new Date(user.expiresAt) < new Date()) {
      clearStorage();
      return { token: null, user: null };
    }

    return { token, user };
  } catch {
    clearStorage();
    return { token: null, user: null };
  }
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => readStoredSession());

  useEffect(() => {
    const handleExpired = () => setAuthState({ token: null, user: null });
    window.addEventListener('nomadas:auth:expired', handleExpired);
    return () => window.removeEventListener('nomadas:auth:expired', handleExpired);
  }, []);

  const login = (loginResponse) => {
    const token =
      typeof loginResponse === 'string' ? loginResponse : loginResponse?.token;

    if (!token) {
      throw new Error('Login response does not include a JWT token');
    }

    const user = {
      credentialId: loginResponse?.credentialId,
      userId: loginResponse?.userId ?? null,
      username: loginResponse?.username,
      email: loginResponse?.email,
      role: loginResponse?.role,
      expiresAt: loginResponse?.expiresAt,
    };

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    setAuthState({
      token,
      user,
    });
  };

  const logout = () => {
    clearStorage();
    setAuthState({ token: null, user: null });
  };

  const value = useMemo(
    () => ({
      token: authState.token,
      user: authState.user,
      login,
      logout,
      isAuthenticated: Boolean(authState.token),
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
