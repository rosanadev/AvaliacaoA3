import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profissionalAPI, solicitacaoAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

const ProfissionalSolicitacoes = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [tipo, setTipo] = useState('CANCELAR');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [novaDataHora, setNovaDataHora] = useState('');

  useEffect(() => {
    carregarAgendamentos();
  }, [user.idUsuario]); 

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      const response = await profissionalAPI.buscarAgendamentos(user.idUsuario);
      

      const agendamentosAtivos = Array.from(response.data)
        .filter(a => 
          a.profissional?.idUsuario === user.idUsuario &&
          a.status !== 'CANCELADO' && 
          a.status !== 'CONCLUÍDO' && 
          new Date(a.dataHora) > new Date()
        )
        .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
        
      setAgendamentos(agendamentosAtivos);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (agendamento) => {
    if (!agendamento || !agendamento.idAgendamento) {
      toast.error('Agendamento inválido');
      return;
    }

    const temPendente = agendamento.solicitacoes?.some(s => s.status === 'PENDENTE');
    if (temPendente) {
        toast.error('Este agendamento já possui uma solicitação pendente.');
        return;
    }

    setAgendamentoSelecionado(agendamento);
    setTipo('CANCELAR');
    setDescricao('');
    setNovaDataHora(''); 
    setShowModal(true);
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    
    if (!agendamentoSelecionado?.idAgendamento || !user?.idUsuario) {
      toast.error('Agendamento ou Usuário inválido');
      return;
    }

    if (!descricao || descricao.trim().length === 0) {
      toast.error('Por favor, descreva o motivo da solicitação');
      return;
    }
    
    let solicitacaoData;
    let apiCall;

    if (tipo === 'ALTERAR') {
      if (!novaDataHora) {
        toast.error('Por favor, informe a nova data e hora sugerida.');
        return;
      }
      
      const dataHoraSelecionada = new Date(novaDataHora);
      const hora = dataHoraSelecionada.getHours();
      
      if (hora < 8 || hora >= 18) {
        toast.error('Horário fora do expediente. Funcionamos das 8h às 18h.');
        return;
      }
      if (dataHoraSelecionada < new Date()) {
        toast.error('Não é possível reagendar para data passada');
        return;
      }

      solicitacaoData = {
        agendamentoId: agendamentoSelecionado.idAgendamento,
        profissionalId: user.idUsuario,
        descricao: descricao.trim(),
        novaDataHora: novaDataHora
      };
      apiCall = solicitacaoAPI.criarReagendamento;

    } else {
      solicitacaoData = {
        agendamentoId: agendamentoSelecionado.idAgendamento,
        profissionalId: user.idUsuario,
        descricao: descricao.trim(),
        tipo: 'CANCELAR'
      };
      apiCall = solicitacaoAPI.criar;
    }
    
    setEnviando(true);

    try {
      const response = await apiCall(solicitacaoData);
      
      if (response.status === 201) {
        toast.success('Solicitação enviada com sucesso! Aguarde aprovação.');
        setShowModal(false);
        setDescricao('');
        setNovaDataHora('');
        carregarAgendamentos(); 
      }
    } catch (error) {
      const mensagem = error.response?.data?.message || 
                      error.response?.data || 
                      'Erro ao enviar solicitação';
      toast.error(mensagem);
      console.error('Erro ao enviar:', error);
    } finally {
      setEnviando(false);
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

  const getSolicitacaoStatus = (agendamento) => {
    if (!agendamento.solicitacoes || agendamento.solicitacoes.length === 0) {
      return null;
    }
    const pendente = agendamento.solicitacoes.find(s => s.status === 'PENDENTE');
    if (pendente) {
      return <span className="badge badge-warning">Solicitação Pendente</span>;
    }

    const maisRecente = agendamento.solicitacoes.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))[0];
    if (maisRecente.status === 'APROVADA') {
      return <span className="badge badge-success">Solicitação Aprovada</span>;
    }
    if (maisRecente.status === 'RECUSADA') {
      return <span className="badge badge-error">Solicitação Recusada</span>;
    }
    return null;
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
        <h1 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>
          Solicitar Alteração/Cancelamento
        </h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
          Envie uma solicitação ao administrador para alterar ou cancelar um agendamento
        </p>

        <div className="card">
          <div className="card-header">Seus Agendamentos Ativos</div>
          <div className="card-body">
            {agendamentos.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Data/Hora</th>
                      <th>Cliente</th>
                      <th>Serviço</th>
                      <th>Status Solicitação</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.map(ag => {
                      const statusSolicitacao = getSolicitacaoStatus(ag);
                      const podeSolicitar = ag.status === 'AGENDADO' && (!statusSolicitacao || statusSolicitacao.props.children === 'Solicitação Recusada');

                      return (
                        <tr key={ag.idAgendamento}>
                          <td>{formatarData(ag.dataHora)}</td>
                          <td>{ag.cliente?.nome || 'Cliente não informado'}</td>
                          <td>{ag.servico?.nome || 'Serviço não informado'}</td>
                          <td>{statusSolicitacao || 'Nenhuma'}</td>
                          <td>
                            <button
                              className="btn btn-outline"
                              onClick={() => abrirModal(ag)}
                              disabled={!podeSolicitar} 
                            >
                              {podeSolicitar ? 'Solicitar' : (ag.status !== 'AGENDADO' ? ag.status : 'Processando')}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <p>Nenhum agendamento ativo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && agendamentoSelecionado && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nova Solicitação</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: 'var(--background)', borderRadius: '5px' }}>
              <p><strong>Agendamento:</strong></p>
              <p>Cliente: {agendamentoSelecionado.cliente?.nome}</p>
              <p>Serviço: {agendamentoSelecionado.servico?.nome}</p>
              <p>Data/Hora: {formatarData(agendamentoSelecionado.dataHora)}</p>
            </div>

            <form onSubmit={handleEnviar}>
              <div className="form-group">
                <label className="form-label">Tipo de Solicitação *</label>
                <select 
                  className="form-control" 
                  value={tipo} 
                  onChange={(e) => setTipo(e.target.value)} 
                  required
                >
                  <option value="CANCELAR">Cancelamento</option>
                  <option value="ALTERAR">Alteração (Reagendamento)</option>
                </select>
              </div>

              {/* CAMPO CONDICIONAL DE DATA/HORA */}
              {tipo === 'ALTERAR' && (
                <div className="form-group">
                  <label className="form-label">Nova Data e Hora Sugerida *</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={novaDataHora}
                    onChange={(e) => setNovaDataHora(e.target.value)}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                    Horário de funcionamento: 8h às 18h
                  </small>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Motivo da Solicitação *</label>
                <textarea
                  className="form-control"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  rows="4"
                  maxLength="500"
                  placeholder="Descreva o motivo da sua solicitação..."
                />
                <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  {descricao.length}/500 caracteres
                </small>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1 }} 
                  onClick={() => setShowModal(false)} 
                  disabled={enviando}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1 }} 
                  disabled={enviando || !descricao.trim() || (tipo === 'ALTERAR' && !novaDataHora)}
                >
                  {enviando ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfissionalSolicitacoes;