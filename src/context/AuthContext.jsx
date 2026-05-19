import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      return {
        token: null,
        user: null,
      };
    }

    return {
      token,
      user: readStoredUser(),
    };
  });

  const login = (loginResponse) => {
    const token =
      typeof loginResponse === 'string' ? loginResponse : loginResponse?.token;

    if (!token) {
      throw new Error('Login response does not include a JWT token');
    }

    const user = {
      credentialId: loginResponse?.credentialId,
      userId: loginResponse?.userId,
      username: loginResponse?.username,
      email: loginResponse?.email,
      role: loginResponse?.role,
      expiresAt: loginResponse?.expiresAt,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setAuthState({
      token,
      user,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuthState({
      token: null,
      user: null,
    });
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
