import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('userProfile'));
    } catch {
      return null;
    }
  });

  const login = (data) => {
    setUser(data);
    localStorage.setItem('userProfile', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userProfile');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
