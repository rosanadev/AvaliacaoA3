import React, { useState, useEffect } from 'react';
import { administradorAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

const AdminCalendario = () => {
  const [calendario, setCalendario] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCalendario();
  }, []);

  const carregarCalendario = async () => {
    try {
      setLoading(true);
      const response = await administradorAPI.buscarCalendarioCompleto();
      setCalendario(response.data);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar calendário');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataHora) => {
    return new Date(dataHora).toLocaleString('pt-BR');
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
          Calendário Completo
        </h1>

        {Object.keys(calendario).length > 0 ? (
          Object.entries(calendario).map(([profissional, agendamentos]) => (
            <div key={profissional} className="card" style={{ marginBottom: '20px' }}>
              <div className="card-header">{profissional}</div>
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
                            <td>{ag.cliente?.nome}</td>
                            <td>{ag.servico?.nome}</td>
                            <td><span className={`badge badge-${ag.status === 'AGENDADO' ? 'info' : ag.status === 'CONCLUÍDO' ? 'success' : 'error'}`}>{ag.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-light)' }}>Nenhum agendamento</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>Nenhum agendamento no calendário</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminCalendario;