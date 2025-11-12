import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Cadastro = () => {
  const navigate = useNavigate();
  const { cadastrar } = useAuth(); // Usando a função do seu AuthContext

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    data_nascimento: '', // O backend espera 'yyyy-MM-dd'
    email: '',
    senha: '',
    telefone: '',
    cep: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    // Ajusta os dados para o backend (especialmente o CPF e telefone sem formatação)
    const dadosParaApi = {
      ...formData,
      cpf: formData.cpf.replace(/\D/g, ''), // Remove tudo que não é dígito
      telefone: formData.telefone.replace(/\D/g, ''),
      cep: formData.cep.replace(/\D/g, ''),
    };

    const result = await cadastrar(dadosParaApi);

    if (result.success) {
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Espera 3 segundos antes de redirecionar
    } else {
      // Tenta formatar erros de validação do backend (se existirem)
      if (typeof result.error === 'object') {
        const errorMessages = Object.values(result.error).join(', ');
        setError(errorMessages);
      } else {
        setError(result.error || 'Erro ao realizar cadastro');
      }
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
            Criar sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              fazer login se você já tem uma conta
            </Link>
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dados Pessoais */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={formData.nome}
                onChange={handleChange}
                className="mt-1 input-field" // Usando a mesma classe do Login
                placeholder="Seu nome"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                  CPF
                </label>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={handleChange}
                  className="mt-1 input-field"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <input
                  id="data_nascimento"
                  name="data_nascimento"
                  type="date"
                  required
                  value={formData.data_nascimento}
                  onChange={handleChange}
                  className="mt-1 input-field"
                />
              </div>
            </div>

            {/* Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={handleChange}
                  className="mt-1 input-field"
                  placeholder="(00) 00000-0000"
                />
              </div>
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

            {/* Endereço - O backend marcou como obrigatório em Usuario.java */}
            <hr />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                  CEP
                </label>
                <input
                  id="cep"
                  name="cep"
                  type="text"
                  required
                  value={formData.cep}
                  onChange={handleChange}
                  className="mt-1 input-field"
                />
              </div>
               <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                  Estado (UF)
                </label>
                <input
                  id="estado"
                  name="estado"
                  type="text"
                  required
                  maxLength="2"
                  value={formData.estado}
                  onChange={handleChange}
                  className="mt-1 input-field"
                  placeholder="BA"
                />
              </div>
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  id="cidade"
                  name="cidade"
                  type="text"
                  required
                  value={formData.cidade}
                  onChange={handleChange}
                  className="mt-1 input-field"
                  placeholder="Salvador"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
                Bairro
              </label>
              <input
                id="bairro"
                name="bairro"
                type="text"
                required
                value={formData.bairro}
                onChange={handleChange}
                className="mt-1 input-field"
              />
            </div>

             <div>
              <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                Complemento
              </label>
              <input
                id="complemento"
                name="complemento"
                type="text"
                value={formData.complemento}
                onChange={handleChange}
                className="mt-1 input-field"
                placeholder="Apto 101, Bloco B, etc."
              />
            </div>


            {/* Mensagens de Erro/Sucesso */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;