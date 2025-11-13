import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { administradorAPI, especialidadeAPI, servicoAPI } from '../../api/services';

// Navbar (igual)
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

// --- ABA 1: GERENCIAR SERVIÇOS (Versão 100% Corrigida) ---
const TabServicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [novoServico, setNovoServico] = useState({
    nome: '',
    descricao: '',
    preco: 0.0,
    duracaoEmMinutos: 30 // CORREÇÃO: camelCase
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  useEffect(() => { carregarServicos(); }, []);

  const carregarServicos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await servicoAPI.listar();
      setServicos(data || []); 
    } catch (err) { 
      setError('Erro ao carregar serviços.'); 
      setServicos([]);
    } 
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;

    if (type === 'number') {
      if (name === 'preco') {
        parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) parsedValue = 0.0;
      } else if (name === 'duracaoEmMinutos') { // CORREÇÃO: camelCase
        parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue)) parsedValue = 0;
      }
    }
    
    setNovoServico({ 
      ...novoServico, 
      [name]: parsedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await servicoAPI.criar(novoServico); 
      
      alert('Serviço criado com sucesso!');
      setNovoServico({ nome: '', descricao: '', preco: 0.0, duracaoEmMinutos: 30 }); // CORREÇÃO: camelCase
      carregarServicos();
    } catch (err) {
      let errorMsg = 'Erro ao criar serviço.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (typeof err.response.data === 'object') {
          errorMsg = Object.values(err.response.data).join(', ');
        }
      }
      setFormError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Coluna da Lista */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Serviços Cadastrados</h2>
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="bg-white rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {servicos.length === 0 && !loading && (
              <li className="p-4 text-gray-500">Nenhum serviço cadastrado.</li>
            )}
            {Array.isArray(servicos) && servicos.map(s => (
              <li key={s.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-primary-600">{s.nome}</p>
                  <p className="text-sm text-gray-500">R$ {s.preco.toFixed(2)} | {s.duracaoEmMinutos} min</p> {/* CORREÇÃO: camelCase */}
                </div>
                <div>
                  <button className="text-sm text-blue-600 hover:underline opacity-50" disabled>Editar</button>
                  <button className="text-sm text-red-600 hover:underline ml-4 opacity-50" disabled>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Coluna do Formulário */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cadastrar Novo Serviço</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome do Serviço</label>
              <input type="text" name="nome" value={novoServico.nome} onChange={handleChange} className="mt-1 input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea name="descricao" value={novoServico.descricao} onChange={handleChange} className="mt-1 input-field" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                <input type="number" name="preco" step="0.01" min="0.01" value={novoServico.preco} onChange={handleChange} className="mt-1 input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duração (min)</label>
                <input 
                  type="number" 
                  name="duracaoEmMinutos" // CORREÇÃO: camelCase
                  step="1" 
                  min="1"
                  value={novoServico.duracaoEmMinutos} // CORREÇÃO: camelCase
                  onChange={handleChange} 
                  className="mt-1 input-field" 
                  required 
                />
              </div>
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


// --- ABA 2: GERENCIAR PROFISSIONAIS (Corrigido) ---
const TabProfissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [novoProf, setNovoProf] = useState({
    nome: '', email: '', senha: '', cpf: '', data_nascimento: '', 
    telefone: '', cep: '', complemento: '', bairro: '', cidade: '', 
    estado: '', registroProfissional: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  useEffect(() => { carregarProfissionais(); }, []);
  const carregarProfissionais = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await administradorAPI.listarProfissionais();
      setProfissionais(data || []);
    } catch (err) { 
      setError('Erro ao carregar profissionais.'); 
      setProfissionais([]);
    } 
    finally { setLoading(false); }
  };
  const handleChange = (e) => setNovoProf({ ...novoProf, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await administradorAPI.criarProfissional(novoProf);
      alert('Profissional criado com sucesso!');
      setNovoProf({ nome: '', email: '', senha: '', cpf: '', data_nascimento: '', telefone: '', cep: '', complemento: '', bairro: '', cidade: '', estado: '', registroProfissional: '' });
      carregarProfissionais();
    } catch (err) {
      let errorMsg = 'Erro ao criar profissional.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (typeof err.response.data === 'object') {
          errorMsg = Object.values(err.response.data).join(', ');
        }
      }
      setFormError(errorMsg);
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
            {profissionais.length === 0 && !loading && (
              <li className="p-4 text-gray-500">Nenhum profissional cadastrado.</li>
            )}
            {Array.isArray(profissionais) && profissionais.map(p => (
              <li key={p.idUsuario} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-primary-600">{p.nome}</p>
                  <p className="text-sm text-gray-500">{p.email}</p>
                </div>
                <div>
                  <button className="text-sm text-blue-600 hover:underline opacity-50" disabled>Editar</button>
                  <button className="text-sm text-red-600 hover:underline ml-4 opacity-50" disabled>Excluir</button>
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
            {/* ... (todos os outros campos de profissional) ... */}
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

// --- ABA 3: GERENCIAR ESPECIALIDADES (Corrigido) ---
const TabEspecialidades = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novoNomeEsp, setNovoNomeEsp] = useState('');
  const [espSelecionadaId, setEspSelecionadaId] = useState('');
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState('');
  const [profSelecionadoId, setProfSelecionadoId] = useState('');

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [espData, profData, servData] = await Promise.all([
        especialidadeAPI.listar(),
        administradorAPI.listarProfissionais(),
        servicoAPI.listar(),
      ]);
      setEspecialidades(espData || []);
      setProfissionais(profData || []);
      setServicos(servData || []);
    } catch (err) { alert('Erro ao carregar dados. Tente recarregar a página.'); } 
    finally { setLoading(false); }
  };
  const handleCriarEspecialidade = async (e) => {
    e.preventDefault();
    if (!novoNomeEsp) return;
    try {
      await especialidadeAPI.criar({ nome: novoNomeEsp });
      alert('Especialidade criada!');
      setNovoNomeEsp('');
      carregarDados();
    } catch (err) { alert('Erro ao criar especialidade.'); }
  };
  const handleAssociarServico = async () => {
    if (!espSelecionadaId || !servicoSelecionadoId) {
      alert("Selecione uma especialidade E um serviço.");
      return;
    }
    try {
      await administradorAPI.associarServicoEspecialidade(espSelecionadaId, servicoSelecionadoId);
      alert('Serviço associado com sucesso!');
      setServicoSelecionadoId('');
    } catch (err) { alert(err.response?.data?.message || 'Erro ao associar serviço.'); }
  };
  const handleAssociarProfissional = async () => {
    if (!espSelecionadaId || !profSelecionadoId) {
      alert("Selecione uma especialidade E um profissional.");
      return;
    }
    try {
      await administradorAPI.associarProfissionalEspecialidade(espSelecionadaId, profSelecionadoId);
      alert('Profissional associado com sucesso!');
      setProfSelecionadoId('');
    } catch (err) { alert(err.response?.data?.message || 'Erro ao associar profissional.'); }
  };

  if (loading) return <p>Carregando dados...</p>;

  return (
    <div className="space-y-8">
      {/* 1. Criar Especialidade */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Criar Nova Especialidade</h2>
        <form onSubmit={handleCriarEspecialidade} className="flex space-x-4">
          <input
            type="text"
            value={novoNomeEsp}
            onChange={(e) => setNovoNomeEsp(e.target.value)}
            placeholder="Nome (ex: Esteticista, Massagista)"
            className="flex-grow input-field"
            required
          />
          <button type="submit" className="btn-primary">
            Criar
          </button>
        </form>
      </div>
      {/* 2. Gerenciar Associações */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Associar "Cola"</h2>
        <p className="text-gray-600 mb-6">Escolha uma especialidade para gerenciar suas associações.</p>
        <label className="block text-sm font-medium text-gray-700">
          1. Selecione a Especialidade
        </label>
        <select
          value={espSelecionadaId}
          onChange={(e) => setEspSelecionadaId(e.target.value)}
          className="mt-1 input-field"
        >
          <option value="" disabled>Selecione...</option>
          {/* CORREÇÃO: Usar 'idEspecialidade' */}
          {Array.isArray(especialidades) && especialidades.map(esp => (
            <option key={esp.idEspecialidade} value={esp.idEspecialidade}>
              {esp.nome}
            </option>
          ))}
        </select>
        {espSelecionadaId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
            {/* Associar Serviços */}
            <div>
              <h3 className="text-lg font-medium text-gray-800">Associar Serviços</h3>
              <p className="text-sm text-gray-500 mb-2">Quais serviços esta especialidade realiza?</p>
              <select
                value={servicoSelecionadoId}
                onChange={(e) => setServicoSelecionadoId(e.target.value)}
                className="mt-1 input-field"
              >
                <option value="" disabled>Selecione um serviço para adicionar...</option>
                {Array.isArray(servicos) && servicos.map(s => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
              <button onClick={handleAssociarServico} className="btn-primary mt-2">
                Associar Serviço
              </button>
            </div>
            {/* Associar Profissionais */}
            <div>
              <h3 className="text-lg font-medium text-gray-800">Associar Profissionais</h3>
              <p className="text-sm text-gray-500 mb-2">Quais profissionais têm esta especialidade?</p>
              <select
                value={profSelecionadoId}
                onChange={(e) => setProfSelecionadoId(e.target.value)}
                className="mt-1 input-field"
              >
                <option value="" disabled>Selecione um profissional para adicionar...</option>
                {Array.isArray(profissionais) && profissionais.map(p => (
                  <option key={p.idUsuario} value={p.idUsuario}>{p.nome}</option>
                ))}
              </select>
              <button onClick={handleAssociarProfissional} className="btn-primary mt-2">
                Associar Profissional
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ABA 4: GERENCIAR SOLICITAÇÕES (NOVA!) ---
const TabSolicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await administradorAPI.listarSolicitacoes();
      // Filtra para mostrar apenas as pendentes
      setSolicitacoes(data.filter(s => s.status === 'PENDENTE') || []);
    } catch (err) {
      setError('Erro ao carregar solicitações.');
      setSolicitacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessar = async (id, novoStatus) => {
    // Pede confirmação
    if (!window.confirm(`Tem certeza que deseja ${novoStatus.toLowerCase()} esta solicitação?`)) {
      return;
    }

    try {
      // API: /administrador/solicitacoes/{id}/status?novoStatus=APROVADO (ou RECUSADO)
      await administradorAPI.processarSolicitacao(id, novoStatus);
      alert(`Solicitação ${novoStatus.toLowerCase()}a com sucesso!`);
      carregarSolicitacoes(); // Recarrega a lista
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao processar solicitação.');
    }
  };

  const formatarData = (dataHora) => {
    return new Date(dataHora).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Solicitações Pendentes</h2>
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="space-y-4">
        {solicitacoes.length === 0 && !loading && (
          <p className="text-gray-500">Nenhuma solicitação pendente no momento.</p>
        )}
        {Array.isArray(solicitacoes) && solicitacoes.map(sol => (
          <div key={sol.idSolicitacao} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className={`font-semibold ${
                sol.tipo === 'CANCELAMENTO' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {sol.tipo}
              </span>
              <span className="text-sm text-gray-500">
                Criada em: {formatarData(sol.dataSolicitacao)}
              </span>
            </div>
            
            <p className="text-gray-800 mb-3">
              <strong>Profissional:</strong> {sol.profissional?.nome}<br/>
              <strong>Motivo:</strong> {sol.descricao}
            </p>

            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-semibold text-gray-700">Detalhes do Agendamento:</h4>
              <p className="text-sm text-gray-600">
                <strong>Cliente:</strong> {sol.agendamento?.cliente?.nome}<br/>
                <strong>Serviço:</strong> {sol.agendamento?.servico?.nome}<br/>
                <strong>Data:</strong> {formatarData(sol.agendamento?.dataHora)}
              </p>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button 
                onClick={() => handleProcessar(sol.idSolicitacao, 'RECUSADO')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
              >
                Recusar
              </button>
              <button 
                onClick={() => handleProcessar(sol.idSolicitacao, 'APROVADO')}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
              >
                Aprovar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL (COM 4 ABAS) ---
const AdminDashboard = () => {
  const [abaAtiva, setAbaAtiva] = useState('solicitacoes'); // Mudei para ser a aba padrão

  const renderAba = () => {
    switch (abaAtiva) {
      case 'solicitacoes':
        return <TabSolicitacoes />;
      case 'servicos':
        return <TabServicos />;
      case 'profissionais':
        return <TabProfissionais />;
      case 'especialidades':
        return <TabEspecialidades />;
      default:
        return <TabSolicitacoes />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      {/* Controles das Abas */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8" style={{ overflowX: 'auto' }}>
            {/* NOVA ABA */}
            <button
              onClick={() => setAbaAtiva('solicitacoes')}
              className={`flex-shrink-0 py-4 px-1 border-b-2 font-medium text-sm ${
                abaAtiva === 'solicitacoes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gerenciar Solicitações
            </button>
            <button
              onClick={() => setAbaAtiva('servicos')}
              className={`flex-shrink-0 py-4 px-1 border-b-2 font-medium text-sm ${
                abaAtiva === 'servicos'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gerenciar Serviços
            </button>
            <button
              onClick={() => setAbaAtiva('profissionais')}
              className={`flex-shrink-0 py-4 px-1 border-b-2 font-medium text-sm ${
                abaAtiva === 'profissionais'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gerenciar Profissionais
            </button>
            <button
              onClick={() => setAbaAtiva('especialidades')}
              className={`flex-shrink-0 py-4 px-1 border-b-2 font-medium text-sm ${
                abaAtiva === 'especialidades'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gerenciar Especialidades
            </button>
          </nav>
        </div>
      </div>
      
      {/* Conteúdo da Aba */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderAba()}
      </div>
    </div>
  );
};

export default AdminDashboard;