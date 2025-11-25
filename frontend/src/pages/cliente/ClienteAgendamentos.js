import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { clienteAPI, agendamentoAPI, avaliacaoAPI } from '../../services/api'; 
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom'; 

const ClienteAgendamentos = () => {
  const { user } = useAuth();
  const location = useLocation(); 
  
  const [filtro, setFiltro] = useState(location.state?.filtro || 'futuros');
  
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [showModalReagendar, setShowModalReagendar] = useState(false);
  const [showModalAvaliar, setShowModalAvaliar] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [processando, setProcessando] = useState(false);

  const [novaDataHora, setNovaDataHora] = useState('');
  
  const [avaliacao, setAvaliacao] = useState({
    nota: 5,
    comentario: ''
  });

  useEffect(() => {
    carregarAgendamentos();
  }, [filtro, user.idUsuario]); 
  const carregarAgendamentos = async () => {
    if (!user?.idUsuario) return; 
    try {
      setLoading(true);
      const response = await clienteAPI.buscarAgendamentos(user.idUsuario, filtro);
      
      setAgendamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataHora) => {
    if (!dataHora) return 'Data inválida';
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
    if (!valor) return 'R$ 0,00';
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

  const podeInteragir = (agendamento) => {
    if (!agendamento || !agendamento.dataHora) return false;
    const dataAgendamento = new Date(agendamento.dataHora);
    const agora = new Date();
    const diferencaHoras = (dataAgendamento - agora) / (1000 * 60 * 60);
    
    return (agendamento.status === 'AGENDADO' || agendamento.status === 'ALTERADO') && diferencaHoras >= 24;
  }

  const podeAvaliar = (agendamento) => {
    return agendamento && agendamento.status === 'CONCLUÍDO' && !agendamento.avaliacao;
  };

  const abrirModalCancelar = (agendamento) => {
    if (!podeInteragir(agendamento)) {
      toast.error('Não é possível cancelar agendamentos com menos de 24h de antecedência');
      return;
    }
    setAgendamentoSelecionado(agendamento);
    setShowModalCancelar(true);
  };

  const handleCancelar = async () => {
    if (!agendamentoSelecionado?.idAgendamento) {
      toast.error('Agendamento inválido');
      return;
    }

    setProcessando(true);
    try {
      const response = await agendamentoAPI.cancelar(agendamentoSelecionado.idAgendamento);
      if (response.status === 204 || response.status === 200) {
        toast.success('Agendamento cancelado com sucesso!');
        setShowModalCancelar(false);
        carregarAgendamentos(); 
      }
    } catch (error) {
      const mensagem = error.response?.data || 'Erro ao cancelar agendamento';
      toast.error(mensagem);
      console.error('Erro ao cancelar:', error);
    } finally {
      setProcessando(false);
    }
  };

  const abrirModalReagendar = (agendamento) => {
    if (!podeInteragir(agendamento)) {
      toast.error('Não é possível reagendar agendamentos com menos de 24h de antecedência');
      return;
    }
    setAgendamentoSelecionado(agendamento);
    setNovaDataHora('');
    setShowModalReagendar(true);
  };

  const handleReagendar = async (e) => {
    e.preventDefault();
    
    if (!agendamentoSelecionado?.idAgendamento) {
      toast.error('Agendamento inválido');
      return;
    }

    if (!novaDataHora) {
      toast.error('Selecione uma nova data e hora');
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

    setProcessando(true);
    try {

      const response = await agendamentoAPI.reagendar(agendamentoSelecionado.idAgendamento, novaDataHora);
      
      if (response.status === 200) {
        toast.success('Agendamento reagendado com sucesso!');
        setShowModalReagendar(false);
        carregarAgendamentos(); 
      }
    } catch (error) {
      const mensagem = error.response?.data || 'Erro ao reagendar. O horário pode estar indisponível.';
      toast.error(mensagem);
      console.error('Erro ao reagendar:', error);
    } finally {
      setProcessando(false);
    }
  };

  const abrirModalAvaliar = (agendamento) => {
    if (!podeAvaliar(agendamento)) {
      toast.error('Apenas agendamentos concluídos e não avaliados podem ser avaliados');
      return;
    }
    setAgendamentoSelecionado(agendamento);
    setAvaliacao({ nota: 5, comentario: '' });
    setShowModalAvaliar(true);
  };

  const handleAvaliar = async (e) => {
    e.preventDefault();
    
    if (!agendamentoSelecionado?.idAgendamento) {
      toast.error('Agendamento inválido');
      return;
    }

    if (!avaliacao.comentario || avaliacao.comentario.trim().length === 0) {
      toast.error('Por favor, escreva um comentário sobre o atendimento');
      return;
    }

    setProcessando(true);
    try {
      const response = await avaliacaoAPI.criar(agendamentoSelecionado.idAgendamento, avaliacao);
      
      if (response.status === 201) {
        toast.success('Avaliação enviada com sucesso!');
        setShowModalAvaliar(false);
        carregarAgendamentos();
      }
    } catch (error) {
      const mensagem = error.response?.data?.message || 
                      error.response?.data || 
                      'Erro ao enviar avaliação';
      toast.error(mensagem);
      console.error('Erro ao avaliar:', error);
    } finally {
      setProcessando(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando agendamentos...</p>
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
            Meus Agendamentos 📅
          </h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
            Gerencie seus agendamentos
          </p>

          {/* Filtros */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-body">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  className={`btn ${filtro === 'futuros' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFiltro('futuros')}
                >
                  Próximos
                </button>
                <button
                  className={`btn ${filtro === 'passados' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFiltro('passados')}
                >
                  Passados
                </button>
                <button
                  className={`btn ${filtro === '' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFiltro('')}
                >
                  Todos
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Agendamentos */}
          {agendamentos.length > 0 ? (
            <div className="grid grid-2">
              {agendamentos.map((agendamento) => (
                <div key={agendamento.idAgendamento} className="card">
                  <div className="card-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{agendamento.servico?.nome || 'Serviço não informado'}</span>
                      <span className={`badge ${getStatusBadge(agendamento.status)}`}>
                        {agendamento.status}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <p><strong>📅 Data:</strong> {formatarData(agendamento.dataHora)}</p>
                    <p><strong>👤 Profissional:</strong> {agendamento.profissional?.nome || 'Não informado'}</p>
                    <p><strong>💰 Valor:</strong> {formatarMoeda(agendamento.servico?.preco)}</p>
                    {agendamento.pagamentoParcial && (
                      <p style={{ fontSize: '0.9rem', color: 'var(--warning)' }}>
                        ⚠️ Pagamento parcial (50%)
                      </p>
                    )}
                    {agendamento.avaliacao && (
                      <div style={{ marginTop: '10px', padding: '10px', background: 'var(--background)', borderRadius: '5px' }}>
                        <p><strong>⭐ Sua avaliação:</strong> {agendamento.avaliacao.nota}/5</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                          {agendamento.avaliacao.comentario}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="card-footer">
                    {podeInteragir(agendamento) && (
                      <>
                        <button
                          className="btn btn-danger"
                          onClick={() => abrirModalCancelar(agendamento)}
                        >
                          Cancelar
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => abrirModalReagendar(agendamento)}
                        >
                          Reagendar
                        </button>
                      </>
                    )}
                    {podeAvaliar(agendamento) && (
                      <button
                        className="btn btn-success"
                        onClick={() => abrirModalAvaliar(agendamento)}
                      >
                        Avaliar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h2 className="empty-state-title">Nenhum agendamento encontrado</h2>
              <p>Você não tem agendamentos {filtro === 'futuros' ? 'futuros' : filtro === 'passados' ? 'passados' : ''}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Cancelar */}
      {showModalCancelar && agendamentoSelecionado && (
        <div className="modal-overlay" onClick={() => setShowModalCancelar(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Confirmar Cancelamento</h2>
              <button className="modal-close" onClick={() => setShowModalCancelar(false)}>×</button>
            </div>
            <p>Tem certeza que deseja cancelar este agendamento?</p>
            <p><strong>{agendamentoSelecionado.servico?.nome}</strong></p>
            <p>{formatarData(agendamentoSelecionado.dataHora)}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowModalCancelar(false)}
                disabled={processando}
              >
                Não
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={handleCancelar}
                disabled={processando}
              >
                {processando ? 'Cancelando...' : 'Sim, Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reagendar */}
      {showModalReagendar && agendamentoSelecionado && (
        <div className="modal-overlay" onClick={() => setShowModalReagendar(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Reagendar Atendimento</h2>
              <button className="modal-close" onClick={() => setShowModalReagendar(false)}>×</button>
            </div>
            <form onSubmit={handleReagendar}>
              <div className="form-group">
                <label className="form-label">Nova Data e Hora *</label>
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
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowModalReagendar(false)}
                  disabled={processando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={processando}
                >
                  {processando ? 'Reagendando...' : 'Confirmar Reagendamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Avaliar */}
      {showModalAvaliar && agendamentoSelecionado && (
        <div className="modal-overlay" onClick={() => setShowModalAvaliar(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Avaliar Atendimento</h2>
              <button className="modal-close" onClick={() => setShowModalAvaliar(false)}>×</button>
            </div>
            <form onSubmit={handleAvaliar}>
              <div className="form-group">
                <label className="form-label">Nota (1 a 5) *</label>
                <div style={{ display: 'flex', gap: '10px', fontSize: '2rem', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map((nota) => (
                    <span
                      key={nota}
                      onClick={() => setAvaliacao({ ...avaliacao, nota })}
                      style={{
                        cursor: 'pointer',
                        color: nota <= avaliacao.nota ? 'gold' : 'lightgray',
                        transition: 'all 0.2s'
                      }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <p style={{ textAlign: 'center', marginTop: '10px', color: 'var(--primary-color)' }}>
                  {avaliacao.nota} {avaliacao.nota === 1 ? 'estrela' : 'estrelas'}
                </p>
              </div>
              <div className="form-group">
                <label className="form-label">Comentário *</label>
                <textarea
                  className="form-control"
                  value={avaliacao.comentario}
                  onChange={(e) => setAvaliacao({ ...avaliacao, comentario: e.target.value })}
                  rows="4"
                  required
                  maxLength="500"
                  placeholder="Conte-nos sobre sua experiência..."
                />
                <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  {avaliacao.comentario.length}/500 caracteres
                </small>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowModalAvaliar(false)}
                  disabled={processando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{ flex: 1 }}
                  disabled={processando}
                >
                  {processando ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ClienteAgendamentos;