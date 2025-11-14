import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profissionalAPI, solicitacaoAPI } from '../../api/services';
import { Link } from 'react-router-dom';

// ✅ FUNÇÃO UTILITÁRIA: Extrair ID do agendamento
const getAgendamentoId = (agendamento) => {
  if (!agendamento) {
    console.error('❌ Agendamento é null ou undefined');
    return null;
  }
  
  const id = agendamento.idAgendamento || agendamento.id_agendamento || agendamento.id;
  
  console.log('🔍 Extraindo ID do agendamento:', {
    agendamento: agendamento,
    idAgendamento: agendamento.idAgendamento,
    id_agendamento: agendamento.id_agendamento,
    id: agendamento.id,
    idFinal: id
  });
  
  return id;
};

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

// Modal para solicitar reagendamento
const ModalSolicitarReagendamento = ({ agendamento, onClose, onSuccess, profissionalId }) => {
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [motivo, setMotivo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const gerarHorarios = () => {
    const horarios = [];
    for (let hora = 8; hora <= 18; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        if (hora === 18 && minuto > 0) break;
        const h = hora.toString().padStart(2, '0');
        const m = minuto.toString().padStart(2, '0');
        horarios.push(`${h}:${m}`);
      }
    }
    return horarios;
  };

  useEffect(() => {
    setHorariosDisponiveis(gerarHorarios());
    console.log('📦 Agendamento recebido no modal de reagendamento:', agendamento);
  }, [agendamento]);

  const converterParaISO = (data, horario) => {
    if (!data || !horario) return '';
    return `${data}T${horario}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!dataSelecionada || !horarioSelecionado || !motivo.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // ✅ VALIDAÇÃO ROBUSTA
    const agendamentoId = getAgendamentoId(agendamento);
    
    if (!agendamentoId || !profissionalId) {
      console.error('❌ ERRO: Dados inválidos', { agendamento, agendamentoId, profissionalId });
      setError('Erro: Dados inválidos.');
      return;
    }

    setSubmitting(true);
    try {
      const dataISO = converterParaISO(dataSelecionada, horarioSelecionado);
      
      const reagendamentoDTO = {
        agendamentoId: agendamentoId,
        profissionalId: profissionalId,
        novaDataHora: dataISO,
        descricao: motivo.trim(),
      };

      console.log('✅ Enviando solicitação de reagendamento:', reagendamentoDTO);
      await solicitacaoAPI.reagendar(reagendamentoDTO);
      alert('Solicitação de reagendamento enviada ao administrador!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('❌ Erro ao solicitar reagendamento:', err);
      setError(err.response?.data?.message || 'Erro ao enviar solicitação.');
    } finally {
      setSubmitting(false);
    }
  };

  const getDataMinima = () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    return amanha.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Solicitar Reagendamento</h2>
        
        <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-gray-700"><strong>Cliente:</strong> {agendamento.cliente?.nome}</p>
          <p className="text-sm text-gray-700"><strong>Serviço:</strong> {agendamento.servico?.nome}</p>
          <p className="text-sm text-gray-700"><strong>Data atual:</strong> {new Date(agendamento.dataHora).toLocaleString('pt-BR')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="dataSelecionada" className="block text-sm font-medium text-gray-700 mb-2">
              📅 Selecione a nova data desejada
            </label>
            <input
              type="date"
              id="dataSelecionada"
              value={dataSelecionada}
              onChange={(e) => {
                setDataSelecionada(e.target.value);
                setHorarioSelecionado('');
              }}
              min={getDataMinima()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              required
            />
          </div>

          {dataSelecionada && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                🕐 Selecione o horário desejado
              </label>
              <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {horariosDisponiveis.map((horario) => (
                  <button
                    key={horario}
                    type="button"
                    onClick={() => setHorarioSelecionado(horario)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      horarioSelecionado === horario
                        ? 'bg-primary-600 text-white ring-2 ring-primary-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {horario}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
              📝 Motivo da Solicitação
            </label>
            <textarea
              id="motivo"
              rows="3"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 resize-none"
              placeholder="Explique o motivo do reagendamento..."
              required
            />
          </div>

          {dataSelecionada && horarioSelecionado && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-900">✓ Nova data e horário selecionados:</p>
              <p className="text-lg font-bold text-green-700 mt-1">
                {new Date(`${dataSelecionada}T${horarioSelecionado}`).toLocaleString('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
              disabled={submitting || !dataSelecionada || !horarioSelecionado || !motivo.trim()}
            >
              {submitting ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para solicitar cancelamento
const ModalSolicitarCancelamento = ({ agendamento, onClose, onSuccess, profissionalId }) => {
  const [motivo, setMotivo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!motivo.trim()) {
      setError('Por favor, informe o motivo do cancelamento.');
      return;
    }

    // ✅ VALIDAÇÃO ROBUSTA
    const agendamentoId = getAgendamentoId(agendamento);
    
    if (!agendamentoId || !profissionalId) {
      console.error('❌ ERRO: Dados inválidos', { agendamento, agendamentoId, profissionalId });
      setError('Erro: Dados inválidos.');
      return;
    }

    setSubmitting(true);
    try {
      const solicitacaoDTO = {
        agendamentoId: agendamentoId,
        profissionalId: profissionalId,
        descricao: motivo.trim(),
        tipo: 'CANCELAR'
      };

      console.log('✅ Enviando solicitação de cancelamento:', solicitacaoDTO);
      await solicitacaoAPI.criar(solicitacaoDTO);
      alert('Solicitação de cancelamento enviada ao administrador!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('❌ Erro ao solicitar cancelamento:', err);
      setError(err.response?.data?.message || 'Erro ao enviar solicitação.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Solicitar Cancelamento</h2>
        
        <div className="mb-4 bg-red-50 border border-red-200 p-3 rounded">
          <p className="text-sm text-gray-700"><strong>Cliente:</strong> {agendamento.cliente?.nome}</p>
          <p className="text-sm text-gray-700"><strong>Serviço:</strong> {agendamento.servico?.nome}</p>
          <p className="text-sm text-gray-700"><strong>Data:</strong> {new Date(agendamento.dataHora).toLocaleString('pt-BR')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
              Motivo do Cancelamento
            </label>
            <textarea
              id="motivo"
              rows="4"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 resize-none"
              placeholder="Explique o motivo do cancelamento..."
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente principal
const ProfissionalDashboard = () => {
  const { user, logout } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [modalReagendar, setModalReagendar] = useState({ open: false, agendamento: null });
  const [modalCancelar, setModalCancelar] = useState({ open: false, agendamento: null });

  const carregarAgendamentos = async () => {
    if (!user?.idUsuario) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await profissionalAPI.listarAgendamentos(user.idUsuario);
      console.log('📦 Agendamentos carregados:', data);
      setAgendamentos(data || []);
    } catch (err) {
      console.error('❌ Erro ao carregar agendamentos:', err);
      setError('Erro ao carregar agenda.');
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, [user]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfissionalNavbar user={user} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Minha Agenda</h1>

        {loading && <p className="text-center py-12">Carregando agendamentos...</p>}
        {error && <p className="text-red-500 text-center py-12">{error}</p>}

        {!loading && !error && agendamentos.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Você não possui agendamentos no momento.</p>
          </div>
        )}

        {!loading && !error && agendamentos.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agendamentos.map((ag) => {
                    const agId = getAgendamentoId(ag);
                    return (
                      <tr key={agId || Math.random()}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatarData(ag.dataHora)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ag.cliente?.nome || 'Cliente não informado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ag.servico?.nome || 'Serviço não informado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ag.status === 'AGENDADO' ? 'bg-green-100 text-green-800' :
                            ag.status === 'CONCLUÍDO' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ag.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          {ag.status === 'AGENDADO' && (
                            <>
                              <button
                                onClick={() => {
                                  console.log('📝 Abrindo modal de reagendamento:', ag);
                                  setModalReagendar({ open: true, agendamento: ag });
                                }}
                                className="text-blue-600 hover:text-blue-900 hover:underline"
                              >
                                Solicitar Reagendamento
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => {
                                  console.log('📝 Abrindo modal de cancelamento:', ag);
                                  setModalCancelar({ open: true, agendamento: ag });
                                }}
                                className="text-red-600 hover:text-red-900 hover:underline"
                              >
                                Solicitar Cancelamento
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modalReagendar.open && modalReagendar.agendamento && (
        <ModalSolicitarReagendamento
          agendamento={modalReagendar.agendamento}
          profissionalId={user.idUsuario}
          onClose={() => setModalReagendar({ open: false, agendamento: null })}
          onSuccess={carregarAgendamentos}
        />
      )}

      {modalCancelar.open && modalCancelar.agendamento && (
        <ModalSolicitarCancelamento
          agendamento={modalCancelar.agendamento}
          profissionalId={user.idUsuario}
          onClose={() => setModalCancelar({ open: false, agendamento: null })}
          onSuccess={carregarAgendamentos}
        />
      )}
    </div>
  );
};

export default ProfissionalDashboard;