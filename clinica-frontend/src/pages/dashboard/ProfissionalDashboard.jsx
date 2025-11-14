import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profissionalAPI, solicitacaoAPI } from '../../api/services';
import { Link } from 'react-router-dom';

// Navbar
const ProfissionalNavbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            🌸 Rosa Beauty
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 hidden sm:block">Profissional: {user?.nome}</span>
            <button
              onClick={onLogout}
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

// Componente principal
const ProfissionalDashboard = () => {
  const { user, logout } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarAgendamentos = async () => {
    if (!user?.idUsuario) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await profissionalAPI.listarAgendamentos(user.idUsuario);
      setAgendamentos(data || []);
    } catch (err) {
      setError('Erro ao carregar agenda.');
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, [user]);

  const handleSolicitarCancelamento = async (agendamento) => {
    const motivo = prompt("Por favor, insira o motivo da sua solicitação de CANCELAMENTO:");
    if (!motivo) return;

    const solicitacaoDTO = {
      agendamentoId: agendamento.idAgendamento,
      profissionalId: user.idUsuario,
      descricao: motivo,
      // --- A CORREÇÃO ESTÁ AQUI ---
      tipo: 'CANCELAR' // <-- DEVE SER 'CANCELAR' (sem 'MENTO')
    };

    try {
      await solicitacaoAPI.criar(solicitacaoDTO);
      alert('Solicitação de cancelamento enviada ao administrador!');
      carregarAgendamentos(); // Recarrega
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao enviar solicitação.');
    }
  };

  const formatarData = (dataHora, tipo = 'full') => {
    const data = new Date(dataHora);
    if (tipo === 'data') {
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    if (tipo === 'hora') {
      return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    return data.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfissionalNavbar user={user} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Minha Agenda</h1>
        
        {loading && <p>Carregando agenda...</p>}
        {error && <p className="text-red-500 bg-red-50 p-4 rounded-md">{error}</p>}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meus Próximos Atendimentos</h2>
          
          {!loading && agendamentos.length === 0 && (
            <p className="text-gray-600">Você não possui atendimentos futuros.</p>
          )}
          
          <div className="space-y-4">
            {agendamentos.map((ag) => (
              <div key={ag.idAgendamento} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center">
                {/* Informações do Agendamento */}
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-bold text-primary-600 mr-4">
                      📅 {formatarData(ag.dataHora, 'data')}
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      {formatarData(ag.dataHora, 'hora')}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{ag.servico?.nome || 'Serviço'}</p>
                  
                  <div className="mt-3 bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-700 font-semibold">Cliente: {ag.cliente?.nome || 'Não encontrado'}</p>
                    <p className="text-sm text-gray-500">Telefone: {ag.cliente?.telefone || 'Não informado'}</p>
                    <p className="text-sm text-gray-500">Email: {ag.cliente?.email || 'Não informado'}</p>
                  </div>

                  <span className={`mt-3 inline-block text-sm font-medium px-2 py-0.5 rounded-full ${
                    ag.status === 'AGENDADO' ? 'bg-green-100 text-green-800' : 
                    ag.status === 'SOLICITADO' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {ag.status}
                  </span>
                </div>
                
                {/* Botões de Ação */}
                <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col space-y-2">
                  <button 
                    onClick={() => alert('Função de Reagendamento a implementar!')}
                    disabled={ag.status !== 'AGENDADO'}
                    className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
                  >
                    Solicitar Alteração
                  </button>
                  <button 
                    onClick={() => handleSolicitarCancelamento(ag)}
                    disabled={ag.status !== 'AGENDADO'}
                    className="bg-yellow-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-600 disabled:opacity-50"
                  >
                    Solicitar Cancelamento
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ProfissionalDashboard;