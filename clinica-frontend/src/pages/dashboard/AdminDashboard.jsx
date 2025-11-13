import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { administradorAPI, servicoAPI, especialidadeAPI } from '../../api/services';

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

// Componente da Aba "Gerenciar Profissionais" - CORRIGIDO
const TabProfissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
    registroProfissional: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  useEffect(() => {
    carregarProfissionais();
  }, []);

  const carregarProfissionais = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await administradorAPI.listarProfissionais();
      console.log('Resposta do backend (profissionais):', response);
      
      // Converte para array se for Set, objeto ou qualquer outra coisa
      let dados = response;
      
      if (Array.isArray(dados)) {
        setProfissionais(dados);
      } else if (dados && typeof dados === 'object') {
        // Se for um Set ou objeto iterável
        if (dados[Symbol.iterator]) {
          setProfissionais(Array.from(dados));
        } else {
          // Se for um objeto com propriedades
          setProfissionais(Object.values(dados));
        }
      } else {
        console.error('Dados retornados não são válidos:', dados);
        setProfissionais([]);
        setError('Formato de dados inválido recebido do servidor.');
      }
    } catch (err) {
      console.error('Erro ao carregar profissionais:', err);
      setError('Erro ao carregar profissionais: ' + (err.response?.data?.message || err.message));
      setProfissionais([]);
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
      setNovoProf({ 
        nome: '', email: '', senha: '', cpf: '', data_nascimento: '', 
        telefone: '', cep: '', complemento: '', bairro: '', cidade: '', 
        estado: '', registroProfissional: '' 
      });
      carregarProfissionais();
    } catch (err) {
      console.error('Erro ao criar profissional:', err);
      setFormError(err.response?.data?.message || 'Erro ao criar profissional.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profissionais Cadastrados</h2>
        
        {loading && <p>Carregando...</p>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        
        {!loading && !error && profissionais.length === 0 && (
          <p className="text-gray-500">Nenhum profissional cadastrado ainda.</p>
        )}
        
        {!loading && !error && profissionais.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <ul className="divide-y divide-gray-200">
              {profissionais.map((p, index) => (
                <li key={p.idUsuario || index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-primary-600">{p.nome}</p>
                      <p className="text-sm text-gray-500">{p.email}</p>
                      <p className="text-sm text-gray-500">Telefone: {p.telefone}</p>
                      {p.registroProfissional && (
                        <p className="text-sm text-gray-500">Registro: {p.registroProfissional}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="text-sm text-blue-600 hover:underline opacity-50 cursor-not-allowed" 
                        disabled
                        title="Funcionalidade em desenvolvimento"
                      >
                        Editar
                      </button>
                      <button 
                        className="text-sm text-red-600 hover:underline opacity-50 cursor-not-allowed" 
                        disabled
                        title="Funcionalidade em desenvolvimento"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

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

// Componente da Aba "Gerenciar Serviços"
const TabServicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [novoServico, setNovoServico] = useState({
    nome: '',
    descricao: '',
    preco: '',
    duracao_em_minutos: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      setLoading(true);
      const data = await servicoAPI.listar();
      setServicos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar serviços:', err);
      setError('Erro ao carregar serviços.');
      setServicos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNovoServico({ ...novoServico, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    try {
      await servicoAPI.criar(novoServico);
      alert('Serviço criado com sucesso!');
      setNovoServico({ nome: '', descricao: '', preco: '', duracao_em_minutos: '' });
      carregarServicos();
    } catch (err) {
      console.error('Erro ao criar serviço:', err);
      setFormError(err.response?.data?.message || 'Erro ao criar serviço.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletar = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este serviço?')) {
      return;
    }
    
    try {
      await servicoAPI.deletar(id);
      alert('Serviço deletado com sucesso!');
      carregarServicos();
    } catch (err) {
      console.error('Erro ao deletar serviço:', err);
      alert('Erro ao deletar serviço.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Serviços Cadastrados</h2>
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && servicos.length === 0 && (
          <p className="text-gray-500">Nenhum serviço cadastrado ainda.</p>
        )}
        <div className="space-y-4">
          {servicos.map(s => (
            <div key={s.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-primary-600">{s.nome}</h3>
                  <p className="text-gray-600">{s.descricao}</p>
                  <div className="mt-2 flex space-x-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Preço:</span> R$ {s.preco}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Duração:</span> {s.duracao_em_minutos} min
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeletar(s.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Deletar serviço"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cadastrar Novo Serviço</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome do Serviço</label>
              <input 
                type="text" 
                name="nome" 
                value={novoServico.nome} 
                onChange={handleChange} 
                className="mt-1 input-field" 
                required 
                placeholder="Ex: Limpeza de Pele"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea 
                name="descricao" 
                value={novoServico.descricao} 
                onChange={handleChange} 
                className="mt-1 input-field resize-none" 
                rows="3"
                required
                placeholder="Descreva o serviço..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
              <input 
                type="number" 
                name="preco" 
                value={novoServico.preco} 
                onChange={handleChange} 
                className="mt-1 input-field" 
                step="0.01"
                min="0"
                required 
                placeholder="100.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duração (minutos)</label>
              <input 
                type="number" 
                name="duracao_em_minutos" 
                value={novoServico.duracao_em_minutos} 
                onChange={handleChange} 
                className="mt-1 input-field" 
                min="1"
                required 
                placeholder="60"
              />
            </div>
            
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            
            <button type="submit" disabled={submitting} className="w-full btn-primary disabled:opacity-50">
              {submitting ? 'Salvando...' : 'Cadastrar Serviço'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// NOVA ABA: Especialidades
const TabEspecialidades = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [novaEspecialidade, setNovaEspecialidade] = useState({ nome: '', descricao: '' });
  const [submitting, setSubmitting] = useState(false);
  
  const [associacao, setAssociacao] = useState({
    especialidadeId: '',
    profissionalId: '',
    servicoId: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [esp, prof, serv] = await Promise.all([
        especialidadeAPI.listar(),
        administradorAPI.listarProfissionais(),
        servicoAPI.listar()
      ]);
      
      setEspecialidades(Array.isArray(esp) ? esp : []);
      
      // Trata profissionais que podem vir como Set
      if (Array.isArray(prof)) {
        setProfissionais(prof);
      } else if (prof && prof[Symbol.iterator]) {
        setProfissionais(Array.from(prof));
      } else {
        setProfissionais([]);
      }
      
      setServicos(Array.isArray(serv) ? serv : []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleCriarEspecialidade = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await especialidadeAPI.criar(novaEspecialidade);
      alert('Especialidade criada com sucesso!');
      setNovaEspecialidade({ nome: '', descricao: '' });
      carregarDados();
    } catch (err) {
      alert('Erro ao criar especialidade: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssociarServico = async (e) => {
    e.preventDefault();
    try {
      await administradorAPI.associarServicoEspecialidade(
        associacao.especialidadeId,
        associacao.servicoId
      );
      alert('Serviço associado com sucesso!');
      setAssociacao({ ...associacao, servicoId: '' });
    } catch (err) {
      alert('Erro ao associar serviço: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAssociarProfissional = async (e) => {
    e.preventDefault();
    try {
      await administradorAPI.associarProfissionalEspecialidade(
        associacao.especialidadeId,
        associacao.profissionalId
      );
      alert('Profissional associado com sucesso!');
      setAssociacao({ ...associacao, profissionalId: '' });
    } catch (err) {
      alert('Erro ao associar profissional: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-8">
      {/* Criar Especialidade */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Criar Especialidade</h2>
        <form onSubmit={handleCriarEspecialidade} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={novaEspecialidade.nome}
              onChange={(e) => setNovaEspecialidade({ ...novaEspecialidade, nome: e.target.value })}
              className="mt-1 input-field"
              required
              placeholder="Ex: Estética Facial"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={novaEspecialidade.descricao}
              onChange={(e) => setNovaEspecialidade({ ...novaEspecialidade, descricao: e.target.value })}
              className="mt-1 input-field resize-none"
              rows="2"
              placeholder="Descrição da especialidade..."
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? 'Criando...' : 'Criar Especialidade'}
          </button>
        </form>
      </div>

      {/* Associar Serviços e Profissionais */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Associar Serviços e Profissionais</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Selecione a Especialidade</label>
          <select
            value={associacao.especialidadeId}
            onChange={(e) => setAssociacao({ ...associacao, especialidadeId: e.target.value })}
            className="input-field"
            required
          >
            <option value="">Selecione uma especialidade</option>
            {especialidades.map(e => (
              <option key={e.idEspecialidade} value={e.idEspecialidade}>{e.nome}</option>
            ))}
          </select>
        </div>

        {associacao.especialidadeId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Associar Serviço */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Associar Serviço</h3>
              <form onSubmit={handleAssociarServico} className="space-y-3">
                <select
                  value={associacao.servicoId}
                  onChange={(e) => setAssociacao({ ...associacao, servicoId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map(s => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </select>
                <button type="submit" className="w-full btn-primary">Associar Serviço</button>
              </form>
            </div>

            {/* Associar Profissional */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Associar Profissional</h3>
              <form onSubmit={handleAssociarProfissional} className="space-y-3">
                <select
                  value={associacao.profissionalId}
                  onChange={(e) => setAssociacao({ ...associacao, profissionalId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Selecione um profissional</option>
                  {profissionais.map(p => (
                    <option key={p.idUsuario} value={p.idUsuario}>{p.nome}</option>
                  ))}
                </select>
                <button type="submit" className="w-full btn-primary">Associar Profissional</button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Especialidades */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Especialidades Cadastradas</h2>
        {especialidades.length === 0 ? (
          <p className="text-gray-500">Nenhuma especialidade cadastrada ainda.</p>
        ) : (
          <div className="space-y-4">
            {especialidades.map(e => (
              <div key={e.idEspecialidade} className="border rounded-lg p-4">
                <h3 className="font-bold text-lg text-primary-600">{e.nome}</h3>
                {e.descricao && <p className="text-gray-600 text-sm mt-1">{e.descricao}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente Principal
const AdminDashboard = () => {
  const [abaAtiva, setAbaAtiva] = useState('profissionais');

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setAbaAtiva('profissionais')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                abaAtiva === 'profissionais'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profissionais
            </button>
            <button
              onClick={() => setAbaAtiva('servicos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                abaAtiva === 'servicos'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Serviços
            </button>
            <button
              onClick={() => setAbaAtiva('especialidades')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                abaAtiva === 'especialidades'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Especialidades
            </button>
            <button
              className="py-4 px-1 border-b-2 border-transparent text-gray-400 font-medium text-sm cursor-not-allowed"
              disabled
              title="Funcionalidade em desenvolvimento"
            >
              Calendário
            </button>
            <button
              className="py-4 px-1 border-b-2 border-transparent text-gray-400 font-medium text-sm cursor-not-allowed"
              disabled
              title="Funcionalidade em desenvolvimento"
            >
              Solicitações
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {abaAtiva === 'profissionais' && <TabProfissionais />}
        {abaAtiva === 'servicos' && <TabServicos />}
        {abaAtiva === 'especialidades' && <TabEspecialidades />}
      </div>
    </div>
  );
};

export default AdminDashboard;