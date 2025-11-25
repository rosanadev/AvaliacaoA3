import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { clienteAPI, profissionalAPI, administradorAPI } from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState('cliente');
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      
      switch (userType) {
        case 'cliente':
          response = await clienteAPI.login(formData);
          break;
        case 'profissional':
          response = await profissionalAPI.login(formData);
          break;
        case 'administrador':
          response = await administradorAPI.login(formData);
          break;
        default:
          throw new Error('Tipo de usuário inválido');
      }

      if (response.status === 200) {
        login(response.data, userType);
        toast.success(`Bem-vindo(a), ${response.data.nome}!`);
        
        // Redirecionar com base no tipo de usuário
        if (userType === 'cliente') {
          navigate('/cliente/dashboard');
        } else if (userType === 'profissional') {
          navigate('/profissional/dashboard');
        } else if (userType === 'administrador') {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Email ou senha inválidos');
      } else {
        toast.error('Erro ao fazer login. Tente novamente.');
      }
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Rosa Beauty</h1>
          <p className="auth-subtitle">Entre na sua conta</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tipo de Usuário</label>
            <select
              className="form-control"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="cliente">Cliente</option>
              <option value="profissional">Profissional</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              name="senha"
              className="form-control"
              value={formData.senha}
              onChange={handleChange}
              required
              placeholder="Sua senha"
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {userType === 'cliente' && (
          <div className="text-center mt-2">
            <p>
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="auth-link">
                Cadastre-se
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;