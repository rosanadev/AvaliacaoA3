import React, { useState, useEffect } from 'react';
import { administradorAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

const AdminSolicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    try {
      setLoading(true);
      const response = await administradorAPI.listarSolicitacoes();
      setSolicitacoes(response.data);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  const processar = async (id, status) => {
    try {
      await administradorAPI.processarSolicitacao(id, status);
      toast.success(`Solicitação ${status === 'APROVADA' ? 'aprovada' : 'recusada'}!`);
      carregarSolicitacoes();
    } catch (error) {
      toast.error('Erro ao processar solicitação');
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PENDENTE': 'badge-warning',
      'APROVADA': 'badge-success',
      'RECUSADA': 'badge-error'
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
          Gerenciar Solicitações
        </h1>

        {solicitacoes.length > 0 ? (
          <div className="grid grid-2">
            {solicitacoes.map(sol => (
              <div key={sol.id} className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{sol.tipo}</span>
                    <span className={`badge ${getStatusBadge(sol.status)}`}>{sol.status}</span>
                  </div>
                </div>
                <div className="card-body">
                  <p><strong>Profissional:</strong> {sol.profissional?.nome}</p>
                  <p><strong>Data Criação:</strong> {formatarData(sol.dataCriacao)}</p>
                  <p><strong>Descrição:</strong> {sol.descricao}</p>
                </div>
                {sol.status === 'PENDENTE' && (
                  <div className="card-footer">
                    <button
                      className="btn btn-danger"
                      onClick={() => processar(sol.id, 'RECUSADA')}
                    >
                      Recusar
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => processar(sol.id, 'APROVADA')}
                    >
                      Aprovar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Nenhuma solicitação</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSolicitacoes;