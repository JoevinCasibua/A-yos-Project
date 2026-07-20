import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fake auth check on load
  useEffect(() => {
    const storedAuth = localStorage.getItem('ayos_admin_auth');
    if (storedAuth) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedAuth));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@a-yos.com' && password === 'admin') {
          const userData = { email, name: 'Super Admin', role: 'Super Admin' };
          setIsAuthenticated(true);
          setUser(userData);
          localStorage.setItem('ayos_admin_auth', JSON.stringify(userData));
          resolve(true);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000); // Simulate network delay
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('ayos_admin_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
