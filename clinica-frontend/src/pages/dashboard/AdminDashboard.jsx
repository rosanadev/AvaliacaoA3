import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { administradorAPI } from '../../api/services';
import { Link } from 'react-router-dom';

// Navbar do Admin
const AdminNavbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <span className="text-2xl font-bold text-primary-600">
            🌸 Rosa Beauty (Admin)
          </span>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 hidden sm:block">Admin: {user?.nome}</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Componente da Aba "Gerenciar Profissionais"
const TabProfissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estado para o formulário de novo profissional
  const [novoProf, setNovoProf] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    cep: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    registroProfissional: '' //
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  useEffect(() => {
    carregarProfissionais();
  }, []);

  const carregarProfissionais = async () => {
    try {
      setLoading(true);
      const data = await administradorAPI.listarProfissionais();
      setProfissionais(data);
    } catch (err) {
      setError('Erro ao carregar profissionais.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNovoProf({ ...novoProf, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    try {
      await administradorAPI.criarProfissional(novoProf);
      alert('Profissional criado com sucesso!');
      setNovoProf({ nome: '', email: '', senha: '', cpf: '', data_nascimento: '', telefone: '', cep: '', complemento: '', bairro: '', cidade: '', estado: '', registroProfissional: '' }); // Limpa o form
      carregarProfissionais(); // Recarrega a lista
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erro ao criar profissional.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Coluna da Lista */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profissionais Cadastrados</h2>
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="bg-white rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {profissionais.map(p => (
              <li key={p.idUsuario} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-primary-600">{p.nome}</p>
                  <p className="text-sm text-gray-500">{p.email}</p>
                </div>
                {/* Botões de Ação (A implementar) */}
                <div>
                  <button className="text-sm text-blue-600 hover:underline" disabled>Editar</button>
                  <button className="text-sm text-red-600 hover:underline ml-4" disabled>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Coluna do Formulário */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cadastrar Novo Profissional</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Dados de Acesso</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input type="text" name="nome" value={novoProf.nome} onChange={handleChange} className="mt-1 input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={novoProf.email} onChange={handleChange} className="mt-1 input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input type="password" name="senha" value={novoProf.senha} onChange={handleChange} className="mt-1 input-field" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Registro Profissional</label>
              <input type="text" name="registroProfissional" value={novoProf.registroProfissional} onChange={handleChange} className="mt-1 input-field" />
            </div>

            <hr/>
            <h3 className="text-lg font-medium text-gray-800">Dados Pessoais</h3>
            {/* Campos de Usuario.java */}
            <div>
              <label className="block text-sm font-medium text-gray-700">CPF</label>
              <input type="text" name="cpf" value={novoProf.cpf} onChange={handleChange} className="mt-1 input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
              <input type="date" name="data_nascimento" value={novoProf.data_nascimento} onChange={handleChange} className="mt-1 input-field" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <input type="tel" name="telefone" value={novoProf.telefone} onChange={handleChange} className="mt-1 input-field" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">CEP</label>
              <input type="text" name="cep" value={novoProf.cep} onChange={handleChange} className="mt-1 input-field" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Estado (UF)</label>
              <input type="text" name="estado" maxLength="2" value={novoProf.estado} onChange={handleChange} className="mt-1 input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input type="text" name="cidade" value={novoProf.cidade} onChange={handleChange} className="mt-1 input-field" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Bairro</label>
              <input type="text" name="bairro" value={novoProf.bairro} onChange={handleChange} className="mt-1 input-field" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Complemento</label>
              <input type="text" name="complemento" value={novoProf.complemento} onChange={handleChange} className="mt-1 input-field" />
            </div>
            
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            
            <button type="submit" disabled={submitting} className="w-full btn-primary disabled:opacity-50">
              {submitting ? 'Salvando...' : 'Cadastrar Profissional'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


// Componente Principal do Dashboard Admin
const AdminDashboard = () => {
  // No futuro, podemos adicionar abas para 'Agendamentos', 'Serviços', etc.
  // Por enquanto, mostra direto a aba de Profissionais.
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TabProfissionais />
      </div>
    </div>
  );
};

export default AdminDashboard;