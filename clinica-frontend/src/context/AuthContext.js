import React, { createContext, useState, useContext, useEffect } from 'react';
import { clienteAPI, profissionalAPI, administradorAPI } from '../api/services';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipoUsuario, setTipoUsuario] = useState(null); // 'cliente', 'profissional', 'admin'

  useEffect(() => {
    // Carregar usuário do localStorage ao iniciar
    const savedUser = localStorage.getItem('user');
    const savedTipo = localStorage.getItem('tipoUsuario');
    
    if (savedUser && savedTipo) {
      setUser(JSON.parse(savedUser));
      setTipoUsuario(savedTipo);
    }
    setLoading(false);
  }, []);

  const login = async (email, senha, tipo) => {
    try {
      let userData;
      
      switch (tipo) {
        case 'cliente':
          userData = await clienteAPI.login(email, senha);
          break;
        case 'profissional':
          userData = await profissionalAPI.login(email, senha);
          break;
        case 'admin':
          userData = await administradorAPI.login(email, senha);
          break;
        default:
          throw new Error('Tipo de usuário inválido');
      }

      setUser(userData);
      setTipoUsuario(tipo);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('tipoUsuario', tipo);
      
      return { success: true, tipo };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Credenciais inválidas' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setTipoUsuario(null);
    localStorage.removeItem('user');
    localStorage.removeItem('tipoUsuario');
  };

  const cadastrar = async (dadosCliente) => {
    try {
      const novoCliente = await clienteAPI.cadastrar(dadosCliente);
      return { success: true, data: novoCliente };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao cadastrar' 
      };
    }
  };

  const value = {
    user,
    tipoUsuario,
    loading,
    login,
    logout,
    cadastrar,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};