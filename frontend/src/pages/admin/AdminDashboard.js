import React, { useState, useEffect } from 'react';
import { administradorAPI, servicoAPI, agendamentoAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAgendamentos: 0,
    totalProfissionais: 0,
    totalServicos: 0,
    solicitacoesPendentes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [agendamentos, profissionais, servicos, solicitacoes] = await Promise.all([
        agendamentoAPI.listar(),
        administradorAPI.listarProfissionais(),
        servicoAPI.listar(),
        administradorAPI.listarSolicitacoes()
      ]);

      setStats({
        totalAgendamentos: agendamentos.data.length,
        totalProfissionais: profissionais.data.length,
        totalServicos: servicos.data.length,
        solicitacoesPendentes: solicitacoes.data.filter(s => s.status === 'PENDENTE').length
      });
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
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
          Painel Administrativo 🎯
        </h1>

        <div className="grid grid-4">
          <div className="card">
            <div className="card-header">📅 Agendamentos</div>
            <div className="card-body text-center">
              <h2 style={{ color: 'var(--primary-color)', fontSize: '3rem' }}>
                {stats.totalAgendamentos}
              </h2>
            </div>
          </div>
          <div className="card">
            <div className="card-header">👥 Profissionais</div>
            <div className="card-body text-center">
              <h2 style={{ color: 'var(--primary-color)', fontSize: '3rem' }}>
                {stats.totalProfissionais}
              </h2>
            </div>
          </div>
          <div className="card">
            <div className="card-header">✨ Serviços</div>
            <div className="card-body text-center">
              <h2 style={{ color: 'var(--primary-color)', fontSize: '3rem' }}>
                {stats.totalServicos}
              </h2>
            </div>
          </div>
          <div className="card">
            <div className="card-header">📋 Solicitações</div>
            <div className="card-body text-center">
              <h2 style={{ color: stats.solicitacoesPendentes > 0 ? 'var(--warning)' : 'var(--primary-color)', fontSize: '3rem' }}>
                {stats.solicitacoesPendentes}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;