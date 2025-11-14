import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { clienteAPI, agendamentoAPI, avaliacaoAPI } from '../../api/services';
import { Link } from 'react-router-dom';

// Componente de Navbar
const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            🌸 Rosa Beauty
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              to="/servicos"
              className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
            >
              Agendar Serviço
            </Link>
            <span className="text-gray-700 hidden sm:block">Olá, {user?.nome}!</span>
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

// ✅ FUNÇÃO UTILITÁRIA: Extrair ID do agendamento (trata múltiplos formatos)
const getAgendamentoId = (agendamento) => {
  if (!agendamento) {
    console.error('❌ Agendamento é null ou undefined');
    return null;
  }
  
  // Tenta múltiplos formatos possíveis
  const id = agendamento.idAgendamento || agendamento.id_agendamento || agendamento.id;
  
  console.log('🔍 Extraindo ID:', {
    agendamento: agendamento,
    idAgendamento: agendamento.idAgendamento,
    id_agendamento: agendamento.id_agendamento,
    id: agendamento.id,
    idFinal: id
  });
  
  return id;
};

// Modal de Reagendamento com seletor visual
const ModalReagendar = ({ agendamento, onClose, onReagendar }) => {
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Gerar horários disponíveis (08:00 às 18:00, a cada 30min)
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
    console.log('📦 Agendamento recebido no modal:', agendamento);
  }, [agendamento]);

  const converterParaISO = (data, horario) => {
    if (!data || !horario) return '';
    return `${data}T${horario}:00`;
  };

  const validar24Horas = (data, horario) => {
    if (!data || !horario) return false;
    const dataHoraEscolhida = new Date(`${data}T${horario}`);
    const agora = new Date();
    const diferencaHoras = (dataHoraEscolhida - agora) / (1000 * 60 * 60);
    return diferencaHoras >= 24;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!dataSelecionada || !horarioSelecionado) {
      setError('Por favor, selecione uma data e um horário.');
      return;
    }

    // ✅ VALIDAÇÃO ROBUSTA: Extrai ID de múltiplos formatos
    const agendamentoId = getAgendamentoId(agendamento);
    
    if (!agendamentoId) {
      console.error('❌ ERRO: ID do agendamento não encontrado', agendamento);
      setError('Erro: Agendamento inválido. ID não encontrado.');
      return;
    }

    if (!validar24Horas(dataSelecionada, horarioSelecionado)) {
      setError('O reagendamento deve ser feito com pelo menos 24 horas de antecedência.');
      return;
    }

    setSubmitting(true);
    try {
      const dataHoraISO = converterParaISO(dataSelecionada, horarioSelecionado);
      console.log('✅ Reagendando:', { 
        id: agendamentoId, 
        dataHora: dataHoraISO,
        agendamentoCompleto: agendamento 
      });
      
      await agendamentoAPI.reagendar(agendamentoId, { dataHora: dataHoraISO });
      alert('Agendamento reagendado com sucesso!');
      onReagendar();
      onClose();
    } catch (err) {
      console.error('❌ Erro ao reagendar:', err);
      const errorMsg = err.response?.data?.message || err.response?.data || 'Erro ao reagendar. Tente novamente.';
      setError(errorMsg);
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reagendar Serviço</h2>
        
        <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-gray-700"><strong>Serviço:</strong> {agendamento.servico?.nome}</p>
          <p className="text-sm text-gray-700"><strong>Profissional:</strong> {agendamento.profissional?.nome}</p>
          <p className="text-sm text-gray-700"><strong>Data atual:</strong> {new Date(agendamento.dataHora).toLocaleString('pt-BR')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="dataSelecionada" className="block text-sm font-medium text-gray-700 mb-2">
              📅 Selecione a nova data
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
                🕐 Selecione o horário
              </label>
              <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {horariosDisponiveis.map((horario) => {
                  const estaDisponivel = validar24Horas(dataSelecionada, horario);
                  return (
                    <button
                      key={horario}
                      type="button"
                      onClick={() => setHorarioSelecionado(horario)}
                      disabled={!estaDisponivel}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        horarioSelecionado === horario
                          ? 'bg-primary-600 text-white ring-2 ring-primary-600'
                          : estaDisponivel
                          ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {horario}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
              disabled={submitting || !dataSelecionada || !horarioSelecionado}
            >
              {submitting ? 'Reagendando...' : 'Confirmar Reagendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de Avaliação
const ModalAvaliar = ({ agendamento, onClose, onAvaliar }) => {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!comentario.trim()) {
      setError('Por favor, escreva um comentário sobre o atendimento.');
      return;
    }

    // ✅ VALIDAÇÃO ROBUSTA
    const agendamentoId = getAgendamentoId(agendamento);
    
    if (!agendamentoId) {
      console.error('❌ ERRO: ID do agendamento não encontrado', agendamento);
      setError('Erro: Agendamento inválido. ID não encontrado.');
      return;
    }

    setSubmitting(true);
    try {
      console.log('✅ Criando avaliação para agendamento:', agendamentoId);
      await avaliacaoAPI.criar(agendamentoId, {
        nota: nota,
        comentario: comentario.trim()
      });
      
      alert('Avaliação enviada com sucesso!');
      onAvaliar();
      onClose();
    } catch (err) {
      console.error('❌ Erro ao avaliar:', err);
      setError(err.response?.data?.message || 'Erro ao enviar avaliação.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Avaliar Atendimento</h2>
        
        <div className="mb-4 bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600">Serviço: <span className="font-semibold">{agendamento.servico?.nome}</span></p>
          <p className="text-sm text-gray-600">Profissional: <span className="font-semibold">{agendamento.profissional?.nome}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nota (1-5 estrelas)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((estrela) => (
                <button
                  key={estrela}
                  type="button"
                  onClick={() => setNota(estrela)}
                  className={`text-3xl transition-colors ${
                    estrela <= nota ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  {estrela <= nota ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-1">Nota: {nota} estrela{nota !== 1 ? 's' : ''}</p>
          </div>

          <div>
            <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">
              Comentário
            </label>
            <textarea
              id="comentario"
              rows="4"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 resize-none"
              placeholder="Conte-nos sobre sua experiência..."
              maxLength="500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">{comentario.length}/500 caracteres</p>
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
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente principal
const ClienteDashboard = () => {
  const { user } = useAuth();
  const [agendamentosFuturos, setAgendamentosFuturos] = useState([]);
  const [agendamentosPassados, setAgendamentosPassados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [modalReagendar, setModalReagendar] = useState({ open: false, agendamento: null });
  const [modalAvaliar, setModalAvaliar] = useState({ open: false, agendamento: null });

  useEffect(() => {
    if (user?.idUsuario) {
      carregarAgendamentos();
    }
  }, [user]);

  const carregarAgendamentos = async () => {
    setLoading(true);
    setError('');
    try {
      const futuros = await clienteAPI.listarAgendamentos(user.idUsuario, 'futuros');
      console.log('📦 Agendamentos futuros:', futuros);
      setAgendamentosFuturos(futuros || []); 

      const passados = await clienteAPI.listarAgendamentos(user.idUsuario, 'passados');
      console.log('📦 Agendamentos passados:', passados);
      setAgendamentosPassados(passados || []); 
    } catch (err) {
      setError('Erro ao carregar agendamentos.');
      setAgendamentosFuturos([]); 
      setAgendamentosPassados([]);
      console.error('❌ Erro ao carregar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (ag) => {
    // ✅ VALIDAÇÃO ROBUSTA
    const agendamentoId = getAgendamentoId(ag);
    
    if (!agendamentoId) {
      console.error('❌ ERRO: ID do agendamento não encontrado', ag);
      alert('Erro: ID do agendamento inválido.');
      return;
    }

    if (!window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      return;
    }
    
    try {
      console.log('✅ Cancelando agendamento:', agendamentoId);
      await agendamentoAPI.cancelar(agendamentoId);
      alert('Agendamento cancelado com sucesso!');
      carregarAgendamentos();
    } catch (err) {
      console.error('❌ Erro ao cancelar:', err);
      const errorMsg = err.response?.data?.message || err.response?.data || 'Erro ao cancelar. Tente novamente.';
      alert(errorMsg);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Painel</h1>

        {loading && <p className="text-center py-12">Carregando agendamentos...</p>}
        {error && <p className="text-red-500 text-center py-12">{error}</p>}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Próximos Agendamentos</h2>
          {!loading && !error && agendamentosFuturos.length === 0 && (
            <p className="text-gray-600">
              Você não possui agendamentos futuros.{' '}
              <Link to="/servicos" className="text-primary-600 hover:underline">Agendar um serviço</Link>
            </p>
          )}
          <div className="space-y-4">
            {agendamentosFuturos.map((ag) => {
              const agId = getAgendamentoId(ag);
              return (
                <div key={agId || Math.random()} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center">
                  <div>
                    <p className="font-bold text-primary-600">{ag.servico?.nome || 'Serviço não encontrado'}</p>
                    <p className="text-gray-700">Com: {ag.profissional?.nome || 'Profissional a definir'}</p>
                    <p className="text-gray-600">{formatarData(ag.dataHora)}</p>
                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${
                      ag.status === 'AGENDADO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ag.status}
                    </span>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col space-y-2">
                    <button 
                      onClick={() => {
                        console.log('📝 Abrindo modal de reagendamento:', ag);
                        setModalReagendar({ open: true, agendamento: ag });
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                    >
                      Reagendar
                    </button>
                    <button 
                      onClick={() => handleCancelar(ag)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Histórico</h2>
          {!loading && !error && agendamentosPassados.length === 0 && (
            <p className="text-gray-600">Você não possui histórico de agendamentos.</p>
          )}
          <div className="space-y-4">
            {agendamentosPassados.map((ag) => {
              const agId = getAgendamentoId(ag);
              return (
                <div key={agId || Math.random()} className="border rounded-lg p-4">
                  <p className="font-bold">{ag.servico?.nome || 'Serviço não encontrado'}</p>
                  <p className="text-gray-700">Com: {ag.profissional?.nome || 'Profissional a definir'}</p>
                  <p className="text-gray-600">{formatarData(ag.dataHora)}</p>
                  <span className={`text-sm font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${
                    ag.status === 'CONCLUÍDO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {ag.status}
                  </span>
                  
                  {ag.status === 'CONCLUÍDO' && !ag.avaliado && (
                    <button
                      onClick={() => {
                        console.log('📝 Abrindo modal de avaliação:', ag);
                        setModalAvaliar({ open: true, agendamento: ag });
                      }}
                      className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600"
                    >
                      Avaliar
                    </button>
                  )}
                  {ag.avaliado && (
                    <span className="mt-2 text-sm text-green-600 block">✓ Avaliado</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {modalReagendar.open && modalReagendar.agendamento && (
        <ModalReagendar
          agendamento={modalReagendar.agendamento}
          onClose={() => setModalReagendar({ open: false, agendamento: null })}
          onReagendar={carregarAgendamentos}
        />
      )}

      {modalAvaliar.open && modalAvaliar.agendamento && (
        <ModalAvaliar
          agendamento={modalAvaliar.agendamento}
          onClose={() => setModalAvaliar({ open: false, agendamento: null })}
          onAvaliar={carregarAgendamentos}
        />
      )}
    </div>
  );
};

export default ClienteDashboard;