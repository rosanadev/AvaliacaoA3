import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    tipo: 'cliente', // 'cliente', 'profissional', 'admin'
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.senha, formData.tipo);

    if (result.success) {
      // Redirecionar baseado no tipo de usuário
      switch (result.tipo) {
        case 'cliente':
          navigate('/cliente/dashboard');
          break;
        case 'profissional':
          navigate('/profissional/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.error || 'Erro ao fazer login');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl font-bold text-primary-600">
            🌸 Rosa Beauty
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Entrar na sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link to="/cadastro" className="font-medium text-primary-600 hover:text-primary-500">
              criar uma nova conta
            </Link>
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entrar como
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'cliente' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.tipo === 'cliente'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'profissional' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.tipo === 'profissional'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Profissional
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'admin' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.tipo === 'admin'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 input-field"
                placeholder="seu@email.com"
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                value={formData.senha}
                onChange={handleChange}
                className="mt-1 input-field"
                placeholder="••••••••"
              />
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Links Extras */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-primary-600">
              ← Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
