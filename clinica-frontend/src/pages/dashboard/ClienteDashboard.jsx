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

// Modal de Reagendamento
const ModalReagendar = ({ agendamento, onClose, onReagendar }) => {
  const [novaDataHora, setNovaDataHora] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!novaDataHora) {
      setError('Por favor, selecione uma nova data e hora.');
      return;
    }

    // Validar se é com pelo menos 24h de antecedência
    const dataEscolhida = new Date(novaDataHora);
    const agora = new Date();
    const diferencaHoras = (dataEscolhida - agora) / (1000 * 60 * 60);

    if (diferencaHoras < 24) {
      setError('O reagendamento deve ser feito com pelo menos 24 horas de antecedência.');
      return;
    }

    setSubmitting(true);
    try {
      await agendamentoAPI.reagendar(agendamento.idAgendamento, novaDataHora);
      alert('Agendamento reagendado com sucesso!');
      onReagendar();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Erro ao reagendar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reagendar Serviço</h2>
        
        <div className="mb-4 bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600">Serviço: <span className="font-semibold">{agendamento.servico?.nome}</span></p>
          <p className="text-sm text-gray-600">Data atual: <span className="font-semibold">
            {new Date(agendamento.dataHora).toLocaleString('pt-BR')}
          </span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="novaDataHora" className="block text-sm font-medium text-gray-700 mb-1">
              Nova Data e Hora
            </label>
            <input
              type="datetime-local"
              id="novaDataHora"
              value={novaDataHora}
              onChange={(e) => setNovaDataHora(e.target.value)}
              className="mt-1 input-field"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Reagendamento deve ser feito com pelo menos 24 horas de antecedência
            </p>
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
              className="flex-1 btn-primary disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Reagendando...' : 'Confirmar'}
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

    setSubmitting(true);
    try {
      await avaliacaoAPI.criar(agendamento.idAgendamento, {
        nota,
        comentario: comentario.trim(),
      });
      alert('Avaliação enviada com sucesso! Obrigado pelo feedback.');
      onAvaliar();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Avaliar Atendimento</h2>
        
        <div className="mb-4 bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600">Serviço: <span className="font-semibold">{agendamento.servico?.nome}</span></p>
          <p className="text-sm text-gray-600">Profissional: <span className="font-semibold">{agendamento.profissional?.nome}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nota (1 a 5 estrelas)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((estrela) => (
                <button
                  key={estrela}
                  type="button"
                  onClick={() => setNota(estrela)}
                  className="text-3xl focus:outline-none"
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
              className="mt-1 input-field resize-none"
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
              className="flex-1 btn-primary disabled:opacity-50"
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
  
  // Estados dos modais
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
      setAgendamentosFuturos(futuros || []); 

      const passados = await clienteAPI.listarAgendamentos(user.idUsuario, 'passados');
      setAgendamentosPassados(passados || []); 
    } catch (err) {
      setError('Erro ao carregar agendamentos.');
      setAgendamentosFuturos([]); 
      setAgendamentosPassados([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (agendamentoId) => {
    if (!window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      return;
    }
    
    try {
      await agendamentoAPI.cancelar(agendamentoId);
      alert('Agendamento cancelado com sucesso!');
      carregarAgendamentos();
    } catch (err) {
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

        {/* Agendamentos Futuros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Próximos Agendamentos</h2>
          {!loading && !error && agendamentosFuturos.length === 0 && (
            <p className="text-gray-600">
              Você não possui agendamentos futuros.{' '}
              <Link to="/servicos" className="text-primary-600 hover:underline">Agendar um serviço</Link>
            </p>
          )}
          <div className="space-y-4">
            {agendamentosFuturos.map((ag) => (
              <div key={ag.idAgendamento} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center">
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
                    onClick={() => setModalReagendar({ open: true, agendamento: ag })}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                  >
                    Reagendar
                  </button>
                  <button 
                    onClick={() => handleCancelar(ag.idAgendamento)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico de Agendamentos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Histórico</h2>
          {!loading && !error && agendamentosPassados.length === 0 && (
            <p className="text-gray-600">Você não possui histórico de agendamentos.</p>
          )}
          <div className="space-y-4">
            {agendamentosPassados.map((ag) => (
              <div key={ag.idAgendamento} className="border rounded-lg p-4">
                <p className="font-bold">{ag.servico?.nome || 'Serviço não encontrado'}</p>
                <p className="text-gray-700">Com: {ag.profissional?.nome || 'Profissional a definir'}</p>
                <p className="text-gray-600">{formatarData(ag.dataHora)}</p>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${
                  ag.status === 'CONCLUÍDO' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                }`}>
                  {ag.status}
                </span>
                {ag.status === 'CONCLUÍDO' && !ag.avaliacao && (
                  <button 
                    onClick={() => setModalAvaliar({ open: true, agendamento: ag })}
                    className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600"
                  >
                    ⭐ Avaliar Serviço
                  </button>
                )}
                {ag.avaliacao && (
                  <p className="text-sm text-green-600 mt-2">✓ Avaliado</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modais */}
      {modalReagendar.open && (
        <ModalReagendar
          agendamento={modalReagendar.agendamento}
          onClose={() => setModalReagendar({ open: false, agendamento: null })}
          onReagendar={carregarAgendamentos}
        />
      )}

      {modalAvaliar.open && (
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