import React, { useState, useEffect } from 'react';
import { agendamentoAPI } from '../../services/api'; 
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

const AdminHistorico = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState(''); 

  useEffect(() => {
    carregarHistorico();
  }, [filtro]); 

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const response = await agendamentoAPI.listarHistorico(filtro);
      
      const ordenados = response.data.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
      setAgendamentos(ordenados);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar histórico');
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
    return badges[status] || 'badge-primary';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container fade-in">
        <h1 style={{ color: 'var(--primary-color)', marginBottom: '30px' }}>
          Histórico de Agendamentos
        </h1>

        {/* Card de Filtros */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-body" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className={`btn ${filtro === '' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFiltro('')}
            >
              Todos
            </button>
            <button
              className={`btn ${filtro === 'CONCLUÍDO' ? 'btn-success' : 'btn-outline'}`}
              onClick={() => setFiltro('CONCLUÍDO')}
            >
              Concluídos
            </button>
            <button
              className={`btn ${filtro === 'CANCELADO' ? 'btn-danger' : 'btn-outline'}`}
              onClick={() => setFiltro('CANCELADO')}
            >
              Cancelados
            </button>
            <button
              className={`btn ${filtro === 'AGENDADO' ? 'btn-info' : 'btn-outline'}`}
              onClick={() => setFiltro('AGENDADO')}
            >
              Agendados
            </button>
             <button
              className={`btn ${filtro === 'ALTERADO' ? 'btn-warning' : 'btn-outline'}`}
              onClick={() => setFiltro('ALTERADO')}
            >
              Alterados
            </button>
          </div>
        </div>


        {agendamentos.length > 0 ? (
          <div className="card">
            <div className="card-body">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Data/Hora</th>
                      <th>Cliente</th>
                      <th>Serviço</th>
                      <th>Profissional</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.map(ag => (
                      <tr key={ag.idAgendamento}>
                        <td>{formatarData(ag.dataHora)}</td>
                        <td>{ag.cliente?.nome}</td>
                        <td>{ag.servico?.nome}</td>
                        <td>{ag.profissional?.nome}</td>
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
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>Nenhum agendamento encontrado para este filtro</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminHistorico;