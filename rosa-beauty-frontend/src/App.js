import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Settings, LogIn, LogOut, Plus, Edit, Trash2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

const SistemaAgendamento = () => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [telaAtual, setTelaAtual] = useState('login');
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const fazerLogin = async (email, senha, tipo) => {
    setLoading(true);
    try {
      const endpoint = tipo === 'cliente' ? '/clientes/login' : 
                      tipo === 'profissional' ? '/profissionais/login' : 
                      '/administrador/login';
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (response.ok) {
        const usuario = await response.json();
        setUsuarioLogado(usuario);
        setTipoUsuario(tipo);
        setTelaAtual('dashboard');
        mostrarMensagem('Login realizado com sucesso!', 'sucesso');
      } else {
        mostrarMensagem('Credenciais inválidas', 'erro');
      }
    } catch (error) {
      mostrarMensagem('Erro ao fazer login', 'erro');
    } finally {
      setLoading(false);
    }
  };

  const cadastrarCliente = async (dadosCliente) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosCliente)
      });

      if (response.ok) {
        mostrarMensagem('Cadastro realizado! Faça login.', 'sucesso');
        setTelaAtual('login');
      } else {
        mostrarMensagem('Erro no cadastro', 'erro');
      }
    } catch (error) {
      mostrarMensagem('Erro ao cadastrar', 'erro');
    } finally {
      setLoading(false);
    }
  };

  const carregarServicos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/servicos`);
      const data = await response.json();
      setServicos(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  };

  const carregarAgendamentos = async () => {
    try {
      let endpoint = '/agendamentos';
      if (tipoUsuario === 'cliente') {
        endpoint = `/clientes/${usuarioLogado.idUsuario}/agendamentos`;
      } else if (tipoUsuario === 'profissional') {
        endpoint = `/profissionais/${usuarioLogado.idUsuario}/agendamentos`;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const data = await response.json();
      setAgendamentos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setAgendamentos([]);
    }
  };

  const criarAgendamento = async (agendamento) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agendamento)
      });

      if (response.ok) {
        mostrarMensagem('Agendamento criado com sucesso!', 'sucesso');
        carregarAgendamentos();
        setTelaAtual('dashboard');
      } else {
        const erro = await response.text();
        mostrarMensagem(`Erro: ${erro}`, 'erro');
      }
    } catch (error) {
      mostrarMensagem('Erro ao criar agendamento', 'erro');
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 3000);
  };

  useEffect(() => {
    if (usuarioLogado) {
      carregarServicos();
      carregarAgendamentos();
    }
  }, [usuarioLogado, tipoUsuario]);

  const TelaLogin = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipoLogin, setTipoLogin] = useState('cliente');

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-pink-600 mb-2">Rosa Beauty</h1>
            <p className="text-gray-600">Sistema de Agendamento</p>
          </div>

          <div className="flex gap-2 mb-6">
            {['cliente', 'profissional', 'admin'].map(tipo => (
              <button
                key={tipo}
                onClick={() => setTipoLogin(tipo)}
                className={`flex-1 py-2 rounded-lg font-medium transition ${
                  tipoLogin === tipo
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <button
              onClick={() => fazerLogin(email, senha, tipoLogin)}
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          {tipoLogin === 'cliente' && (
            <button
              onClick={() => setTelaAtual('cadastro')}
              className="w-full mt-4 text-pink-600 hover:underline"
            >
              Não tem conta? Cadastre-se
            </button>
          )}
        </div>
      </div>
    );
  };

  const TelaCadastro = () => {
    const [dados, setDados] = useState({
      nome: '', cpf: '', data_nascimento: '', email: '', senha: '',
      telefone: '', cep: '', complemento: '', bairro: '', cidade: '', estado: ''
    });

    const handleCadastro = () => {
      if (!dados.nome || !dados.email || !dados.senha) {
        mostrarMensagem('Preencha todos os campos obrigatórios', 'erro');
        return;
      }
      cadastrarCliente(dados);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-pink-600 mb-6">Cadastro de Cliente</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome Completo *"
                value={dados.nome}
                onChange={(e) => setDados({...dados, nome: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <input
                type="text"
                placeholder="CPF *"
                value={dados.cpf}
                onChange={(e) => setDados({...dados, cpf: e.target.value.replace(/\D/g, '')})}
                maxLength="11"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <input
                type="date"
                value={dados.data_nascimento}
                onChange={(e) => setDados({...dados, data_nascimento: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <input
                type="email"
                placeholder="Email *"
                value={dados.email}
                onChange={(e) => setDados({...dados, email: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <input
                type="password"
                placeholder="Senha *"
                value={dados.senha}
                onChange={(e) => setDados({...dados, senha: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <input
                type="tel"
                placeholder="Telefone *"
                value={dados.telefone}
                onChange={(e) => setDados({...dados, telefone: e.target.value.replace(/\D/g, '')})}
                maxLength="11"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="CEP"
                value={dados.cep}
                onChange={(e) => setDados({...dados, cep: e.target.value.replace(/\D/g, '')})}
                maxLength="8"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <input
                type="text"
                placeholder="Bairro"
                value={dados.bairro}
                onChange={(e) => setDados({...dados, bairro: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <input
                type="text"
                placeholder="Complemento"
                value={dados.complemento}
                onChange={(e) => setDados({...dados, complemento: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <input
                type="text"
                placeholder="Cidade"
                value={dados.cidade}
                onChange={(e) => setDados({...dados, cidade: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <input
                type="text"
                placeholder="Estado (UF)"
                maxLength="2"
                value={dados.estado}
                onChange={(e) => setDados({...dados, estado: e.target.value.toUpperCase()})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setTelaAtual('login')}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Voltar
              </button>
              <button
                onClick={handleCadastro}
                disabled={loading}
                className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-pink-600">Rosa Beauty</h1>
              <span className="text-gray-600">Olá, {usuarioLogado?.nome}</span>
            </div>
            <button
              onClick={() => {
                setUsuarioLogado(null);
                setTipoUsuario(null);
                setTelaAtual('login');
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer">
              <Calendar className="text-pink-600 mb-2" size={32} />
              <h3 className="font-bold text-lg">Agendamentos</h3>
              <p className="text-gray-600 text-sm">{agendamentos.length} encontrados</p>
            </div>
            
            {tipoUsuario === 'cliente' && (
              <button
                onClick={() => setTelaAtual('novo-agendamento')}
                className="bg-pink-600 text-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <Plus className="mb-2" size={32} />
                <h3 className="font-bold text-lg">Novo Agendamento</h3>
                <p className="text-sm">Agende seu serviço</p>
              </button>
            )}
            
            {tipoUsuario === 'admin' && (
              <div className="bg-purple-600 text-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer">
                <Settings className="mb-2" size={32} />
                <h3 className="font-bold text-lg">Gerenciar</h3>
                <p className="text-sm">Profissionais e Serviços</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Meus Agendamentos</h2>
            {agendamentos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum agendamento encontrado</p>
            ) : (
              <div className="space-y-4">
                {agendamentos.map(ag => (
                  <div key={ag.id || ag.idAgendamento} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition">
                    <div>
                      <h3 className="font-bold">{ag.servico?.nome || 'Serviço'}</h3>
                      <p className="text-sm text-gray-600">
                        {ag.dataHora ? new Date(ag.dataHora).toLocaleString('pt-BR') : 'Data não definida'}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
                        ag.status === 'AGENDADO' ? 'bg-green-100 text-green-800' :
                        ag.status === 'CONCLUÍDO' ? 'bg-blue-100 text-blue-800' :
                        ag.status === 'CANCELADO' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ag.status || 'PENDENTE'}
                      </span>
                    </div>
                    {tipoUsuario === 'cliente' && ag.status === 'AGENDADO' && (
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                          <Edit size={20} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded transition">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const NovoAgendamento = () => {
    const [formData, setFormData] = useState({
      servicoId: '',
      profissionalId: '1',
      dataHora: '',
      pagamentoParcial: true
    });

    const handleAgendar = () => {
      if (!formData.servicoId || !formData.dataHora) {
        mostrarMensagem('Selecione o serviço e a data/hora', 'erro');
        return;
      }

      const agendamento = {
        cliente: { idUsuario: usuarioLogado.idUsuario },
        servico: { id: parseInt(formData.servicoId) },
        profissional: { idUsuario: parseInt(formData.profissionalId) },
        dataHora: formData.dataHora,
        pagamentoParcial: formData.pagamentoParcial,
        status: 'AGENDADO'
      };
      criarAgendamento(agendamento);
    };

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-pink-600 mb-6">Novo Agendamento</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serviço *
              </label>
              <select
                value={formData.servicoId}
                onChange={(e) => setFormData({...formData, servicoId: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              >
                <option value="">Selecione um serviço</option>
                {servicos.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nome} - R$ {s.preco} ({s.duracaoEmMinutos || s.duracao_em_minutos} min)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data e Hora *
              </label>
              <input
                type="datetime-local"
                value={formData.dataHora}
                onChange={(e) => setFormData({...formData, dataHora: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.pagamentoParcial}
                  onChange={(e) => setFormData({...formData, pagamentoParcial: e.target.checked})}
                  className="mt-1 w-4 h-4 text-pink-600"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 block">
                    Pagamento Parcelado
                  </span>
                  <span className="text-xs text-gray-600">
                    Pague 50% agora e 50% no dia do serviço
                  </span>
                </div>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setTelaAtual('dashboard')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Voltar
              </button>
              <button
                onClick={handleAgendar}
                disabled={loading}
                className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50 font-medium"
              >
                {loading ? 'Agendando...' : 'Confirmar Agendamento'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {mensagem && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          mensagem.tipo === 'sucesso' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium`}>
          {mensagem.texto}
        </div>
      )}

      {telaAtual === 'login' && <TelaLogin />}
      {telaAtual === 'cadastro' && <TelaCadastro />}
      {telaAtual === 'dashboard' && <Dashboard />}
      {telaAtual === 'novo-agendamento' && <NovoAgendamento />}
    </div>
  );
};

export default SistemaAgendamento;