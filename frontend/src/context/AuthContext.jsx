import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored tokens on app load
    const storedToken = localStorage.getItem('spotify_access_token');
    const storedUser = localStorage.getItem('spotify_user');
    
    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem('spotify_access_token', token);
    localStorage.setItem('spotify_user', JSON.stringify(userData));
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_user');
  };

  const value = {
    user,
    accessToken,
    isLoading,
    login,
    logout,
    isAuthenticated: !!accessToken && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
