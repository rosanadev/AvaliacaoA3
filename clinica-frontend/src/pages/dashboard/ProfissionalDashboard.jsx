import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profissionalAPI, solicitacaoAPi} from '../../api/services';
import { Link } from 'react-router-dom';

// Navbar do Profissional
const ProfissionalNavbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            🌸 Rosa Beauty (Profissional)
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 hidden sm:block">Profissional: {user?.nome}</span>
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

const ProfissionalDashboard = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.idUsuario) {
      carregarAgenda();
    }
  }, [user]);

  const carregarAgenda = async () => {
    setLoading(true);
    setError('');
    try {
      const futuros = await profissionalAPI.listarAgendamentos(user.idUsuario, null, null);
      setAgendamentos(futuros || []); 
    } catch (err) {
      setError('Erro ao carregar agenda.');
      setAgendamentos([]); 
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataHora) => {
    if (!dataHora) return 'Data indisponível';
    return new Date(dataHora).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatarDataCurta = (dataHora) => {
    if (!dataHora) return '';
    return new Date(dataHora).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AGENDADO':
        return 'bg-green-100 text-green-800';
      case 'CONCLUÍDO':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      case 'ALTERADO':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Separar agendamentos por data
  const agruparPorData = (agendamentos) => {
    const grupos = {};
    agendamentos.forEach(ag => {
      const data = new Date(ag.dataHora).toLocaleDateString('pt-BR');
      if (!grupos[data]) {
        grupos[data] = [];
      }
      grupos[data].push(ag);
    });
    return grupos;
  };

  const agendamentosAgrupados = agruparPorData(agendamentos);
  const agendamentosFuturos = agendamentos.filter(ag => 
    new Date(ag.dataHora) >= new Date() && ag.status === 'AGENDADO'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfissionalNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Minha Agenda</h1>

        {/* Resumo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Agendamentos Futuros</p>
              <p className="text-3xl font-bold text-green-600">{agendamentosFuturos.length}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total de Agendamentos</p>
              <p className="text-3xl font-bold text-blue-600">{agendamentos.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Próximo Atendimento</p>
              <p className="text-lg font-bold text-purple-600">
                {agendamentosFuturos.length > 0 
                  ? formatarDataCurta(agendamentosFuturos[0].dataHora)
                  : 'Nenhum'
                }
              </p>
            </div>
          </div>
        </div>

        {loading && <p className="text-center py-12">Carregando agenda...</p>}
        {error && <p className="text-red-500 text-center py-12">{error}</p>}

        {!loading && !error && agendamentos.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600">Você não possui agendamentos no momento.</p>
          </div>
        )}

        {/* Agenda por Data */}
        {!loading && !error && agendamentos.length > 0 && (
          <div className="space-y-6">
            {Object.entries(agendamentosAgrupados).map(([data, agendamentosDia]) => (
              <div key={data} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  📅 {data}
                </h2>
                <div className="space-y-4">
                  {agendamentosDia.map((ag) => (
                    <div 
                      key={ag.idAgendamento} 
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(ag.status)}`}>
                              {ag.status}
                            </span>
                            <span className="text-lg font-semibold text-gray-900">
                              {new Date(ag.dataHora).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-primary-600">
                              {ag.servico?.nome || 'Serviço não encontrado'}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Cliente:</span> {ag.cliente?.nome || 'Cliente não encontrado'}
                            </p>
                            <p className="text-gray-600 text-sm">
                              <span className="font-medium">Telefone:</span> {ag.cliente?.telefone || 'Não informado'}
                            </p>
                            <p className="text-gray-600 text-sm">
                              <span className="font-medium">Email:</span> {ag.cliente?.email || 'Não informado'}
                            </p>
                            {ag.servico?.duracao_em_minutos && (
                              <p className="text-gray-600 text-sm">
                                <span className="font-medium">Duração:</span> {ag.servico.duracao_em_minutos} minutos
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Botões de Ação - [P2] Solicitações */}
                        <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                          {ag.status === 'AGENDADO' && (
                            <>
                              <button 
                                className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 opacity-50 cursor-not-allowed"
                                disabled
                                title="Funcionalidade em desenvolvimento"
                              >
                                Solicitar Alteração
                              </button>
                              <button 
                                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 opacity-50 cursor-not-allowed"
                                disabled
                                title="Funcionalidade em desenvolvimento"
                              >
                                Solicitar Cancelamento
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfissionalDashboard;