import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'cliente', 'profissional', 'administrador'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recuperar usuário do localStorage ao carregar
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    
    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType);
    }
    setLoading(false);
  }, []);

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  const isAuthenticated = () => {
    return user !== null && userType !== null;
  };

  const isCliente = () => userType === 'cliente';
  const isProfissional = () => userType === 'profissional';
  const isAdministrador = () => userType === 'administrador';

  const value = {
    user,
    userType,
    loading,
    login,
    logout,
    isAuthenticated,
    isCliente,
    isProfissional,
    isAdministrador,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};