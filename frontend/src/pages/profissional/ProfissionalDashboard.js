import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profissionalAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

const ProfissionalDashboard = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      const response = await profissionalAPI.buscarAgendamentos(user.idUsuario);
      
      const agendamentosFuturos = Array.from(response.data)
        .filter(a => {
          const isProfissionalCorreto = a.profissional?.idUsuario === user.idUsuario;
          const isFuturo = new Date(a.dataHora) > new Date();
          const isStatusValido = a.status === 'AGENDADO' || a.status === 'ALTERADO';
          
          return isProfissionalCorreto && isFuturo && isStatusValido;
        })
        .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
        .slice(0, 10);
        
      setAgendamentos(agendamentosFuturos);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast.error('Erro ao carregar agenda');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataHora) => {
    if (!dataHora) return 'Data inválida';
    return new Date(dataHora).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'AGENDADO': 'badge-info',
      'CONCLUÍDO': 'badge-success',
      'CANCELADO': 'badge-error',
      'ALTERADO': 'badge-warning'
    };
    return badges[status] || 'badge-info';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container fade-in">
        <h1 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>
          Olá, {user.nome}! 👋
        </h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
          Aqui está sua agenda de atendimentos
        </p>

        <div className="card">
          <div className="card-header">📅 Próximos Atendimentos</div>
          <div className="card-body">
            {agendamentos.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Data/Hora</th>
                      <th>Cliente</th>
                      <th>Serviço</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.map(ag => (
                      <tr key={ag.idAgendamento}>
                        <td>{formatarData(ag.dataHora)}</td>
                        <td>{ag.cliente?.nome || 'Cliente não informado'}</td>
                        <td>{ag.servico?.nome || 'Serviço não informado'}</td>
                        <td>
                          <span className={`badge ${getStatusBadge(ag.status)}`}>
                            {ag.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <p>Nenhum atendimento agendado</p>
              </div>
            )}
          </div>
        </div>

        {/* Card de Resumo */}
        <div className="grid grid-2" style={{ marginTop: '20px' }}>
          <div className="card">
            <div className="card-header">📊 Resumo</div>
            <div className="card-body">
              <p><strong>Total de atendimentos futuros:</strong> {agendamentos.length}</p>
              <p><strong>Profissional:</strong> {user.nome}</p>
              {user.registroProfissional && (
                <p><strong>Registro:</strong> {user.registroProfissional}</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">💡 Dicas</div>
            <div className="card-body">
              <p>✓ Verifique sua agenda regularmente</p>
              <p>✓ Caso precise alterar um atendimento, use a aba "Solicitações"</p>
              <p>✓ Entre em contato com os clientes se necessário</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfissionalDashboard;