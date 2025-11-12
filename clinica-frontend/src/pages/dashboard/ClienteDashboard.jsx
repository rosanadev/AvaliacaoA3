import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { clienteAPI, agendamentoAPI } from '../../api/services';
import { Link } from 'react-router-dom';

// Componente de Navbar interno do Dashboard
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
            {/* Link para Agendar Novo Serviço */}
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

// Componente principal do Dashboard
const ClienteDashboard = () => {
  const { user } = useAuth();
  const [agendamentosFuturos, setAgendamentosFuturos] = useState([]);
  const [agendamentosPassados, setAgendamentosPassados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Só carrega os agendamentos se o usuário estiver disponível
    if (user?.idUsuario) {
      carregarAgendamentos();
    }
  }, [user]); // Dependência do 'user' garante que isso rode após o login

  const carregarAgendamentos = async () => {
    setLoading(true);
    setError('');
    try {
      // Busca agendamentos futuros
      const futuros = await clienteAPI.listarAgendamentos(user.idUsuario, 'futuros');
      setAgendamentosFuturos(futuros);

      // Busca agendamentos passados
      const passados = await clienteAPI.listarAgendamentos(user.idUsuario, 'passados');
      setAgendamentosPassados(passados);
    } catch (err) {
      setError('Erro ao carregar agendamentos.');
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
      // Chama a API de cancelamento do backend
      await agendamentoAPI.cancelar(agendamentoId);
      alert('Agendamento cancelado com sucesso!');
      carregarAgendamentos(); // Recarrega a lista
    } catch (err) {
      // O backend deve retornar um erro 400 se a regra das 24h for violada
      const errorMsg = err.response?.data?.message || err.response?.data || 'Erro ao cancelar. Tente novamente.';
      alert(errorMsg);
    }
  };

  // Helper para formatar data e hora
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

        {loading && <p>Carregando agendamentos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Agendamentos Futuros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Próximos Agendamentos</h2>
          {!loading && !error && agendamentosFuturos.length === 0 && (
            <p className="text-gray-600">Você não possui agendamentos futuros. <Link to="/servicos" className="text-primary-600 hover:underline">Agendar um serviço</Link></p>
          )}
          <div className="space-y-4">
            {agendamentosFuturos.map((ag) => (
              <div key={ag.idAgendamento} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <p className="font-bold text-primary-600">{ag.servico?.nome || 'Serviço não encontrado'}</p>
                  <p className="text-gray-700">Com: {ag.profissional?.nome || 'Profissional a definir'}</p>
                  <p className="text-gray-600">{formatarData(ag.dataHora)}</p>
                  <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                    ag.status === 'AGENDADO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ag.status}
                  </span>
                </div>
                <div className="mt-4 sm:mt-0">
                  {/* [P2] Botão de Cancelar */}
                  <button 
                    onClick={() => handleCancelar(ag.idAgendamento)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 mr-2"
                  >
                    Cancelar
                  </button>
                  {/* [P3] Botão de Reagendar (a implementar) */}
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 opacity-50 cursor-not-allowed" disabled>
                    Reagendar
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
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                    ag.status === 'CONCLUÍDO' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {ag.status}
                  </span>
                {/* [P3] Avaliação (a implementar) */}
                {ag.status === 'CONCLUÍDO' && !ag.avaliacao && (
                  <button className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 opacity-50 cursor-not-allowed" disabled>
                    Avaliar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteDashboard;