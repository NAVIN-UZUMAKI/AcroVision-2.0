import { useState } from 'react';
import { AuthContext } from './contextDefs';
import { authService } from '../services/authService';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(authService.getCurrentUser()));
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res?.success) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        return res;
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data) => {
    setIsLoading(true);
    try {
      const res = await authService.signup(data);
      if (res?.success) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        return res;
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
