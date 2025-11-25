import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { clienteAPI, servicoAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

const ClienteDashboard = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [user.idUsuario]); 

  const carregarDados = async () => {
    if (!user?.idUsuario) return; 
    try {
      setLoading(true);
      
      const agendamentosRes = await clienteAPI.buscarAgendamentos(user.idUsuario, 'futuros');
      
      const agendamentosFiltrados = agendamentosRes.data.filter(ag => 
        ag.status === 'AGENDADO' || ag.status === 'ALTERADO'
      );
      
      setAgendamentos(agendamentosFiltrados.slice(0, 5)); 

      const servicosRes = await servicoAPI.listar();
      setServicos(servicosRes.data.slice(0, 3)); 
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar informações');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataHora) => {
    const data = new Date(dataHora);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
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
      <div className="container">
        <div className="fade-in">
          <h1 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>
            Bem-vinda, {user.nome}! 🌸
          </h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
            Estamos felizes em tê-la aqui. Confira seus próximos agendamentos e serviços disponíveis.
          </p>

          <div className="grid grid-2">
            {/* Card de Próximos Agendamentos */}
            <div className="card">
              <div className="card-header">
                📅 Próximos Agendamentos
              </div>
              <div className="card-body">
                {agendamentos.length > 0 ? (
                  <div>
                    {agendamentos.map((agendamento) => (
                      <div
                        key={agendamento.idAgendamento}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          padding: '10px 0',
                          marginBottom: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>{agendamento.servico?.nome}</strong>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '5px 0' }}>
                              {formatarData(agendamento.dataHora)}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '0' }}>
                              Prof.: {agendamento.profissional?.nome}
                            </p>
                          </div>
                          <span className={`badge ${getStatusBadge(agendamento.status)}`}>
                            {agendamento.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Link to="/cliente/agendamentos" className="btn btn-outline" style={{ width: '100%', marginTop: '10px' }}>
                      Ver Todos
                    </Link>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Você não tem agendamentos futuros</p>
                    <Link to="/cliente/servicos" className="btn btn-primary" style={{ marginTop: '10px' }}>
                      Agendar Serviço
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Card de Serviços em Destaque */}
            <div className="card">
              <div className="card-header">
                ✨ Serviços em Destaque
              </div>
              <div className="card-body">
                {servicos.length > 0 ? (
                  <div>
                    {servicos.map((servico) => (
                      <div
                        key={servico.id}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          padding: '10px 0',
                          marginBottom: '10px'
                        }}
                      >
                        <strong>{servico.nome}</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '5px 0' }}>
                          {servico.descricao}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                          <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                            {formatarMoeda(servico.preco)}
                          </span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                            {servico.duracaoEmMinutos || 0} min
                          </span>
                        </div>
                      </div>
                    ))}
                    <Link to="/cliente/servicos" className="btn btn-outline" style={{ width: '100%', marginTop: '10px' }}>
                      Ver Todos os Serviços
                    </Link>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Nenhum serviço disponível no momento</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              🚀 Ações Rápidas
            </div>
            <div className="card-body">
              <div className="grid grid-3">
                <Link to="/cliente/servicos" className="btn btn-primary">
                  📋 Agendar Serviço
                </Link>
                <Link to="/cliente/agendamentos" className="btn btn-outline">
                  📅 Meus Agendamentos
                </Link>
                <Link to="/cliente/agendamentos" state={{ filtro: 'passados' }} className="btn btn-outline">
                  📊 Histórico
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClienteDashboard;