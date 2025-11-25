import React, { useState, useEffect } from 'react';
import { servicoAPI, agendamentoAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

const ClienteServicos = () => {
  const { user } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [profissionais, setProfissionais] = useState([]);
  const [profissionalId, setProfissionalId] = useState('');
  const [dataHora, setDataHora] = useState('');

  const [pagamentoParcial, setPagamentoParcial] = useState(true);

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      setLoading(true);
      const response = await servicoAPI.listar();
      setServicos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const abrirModalAgendar = async (servico) => {
    try {
      setLoading(true);
      setShowModal(true); 
      const response = await servicoAPI.listarProfissionais(servico.id);
      
      if (response.data.length === 0) {
          toast.error('Nenhum profissional habilitado para este serviço. Contacte o administrador.');
          setShowModal(false); 
          return;
      }
      
      setProfissionais(response.data);
      setServicoSelecionado(servico);
      setProfissionalId('');
      setDataHora('');
      setPagamentoParcial(true); 
    } catch (error) {
      toast.error('Erro ao buscar profissionais para este serviço');
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAgendar = async (e) => {
    e.preventDefault();
    
    if (!servicoSelecionado || !profissionalId || !dataHora) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const dataHoraSelecionada = new Date(dataHora);
    const hora = dataHoraSelecionada.getHours();
    
    if (hora < 8 || hora >= 18) {
      toast.error('Horário fora do expediente. Funcionamos das 8h às 18h.');
      return;
    }

    if (dataHoraSelecionada < new Date()) {
      toast.error('Não é possível agendar em data passada');
      return;
    }

    setProcessando(true);
    try {
      const novoAgendamento = {
        dataHora: dataHora,
        pagamentoParcial: pagamentoParcial,
        cliente: { idUsuario: user.idUsuario },
        profissional: { idUsuario: parseInt(profissionalId, 10) },
        servico: { id: servicoSelecionado.id }
      };

      const response = await agendamentoAPI.criar(novoAgendamento);
      
      if (response.status === 201) {
        toast.success('Agendamento realizado com sucesso!');
        setShowModal(false);
      }
    } catch (error) {
      const mensagem = error.response?.data?.message || 
                      error.response?.data || 
                      'Erro ao realizar agendamento';
      toast.error(mensagem);
      console.error('Erro ao agendar:', error);
    } finally {
      setProcessando(false);
    }
  };

  if (loading && !showModal) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando serviços...</p>
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
            Nossos Serviços ✨
          </h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
            Escolha o serviço que deseja agendar
          </p>

          {servicos.length > 0 ? (
            <div className="grid grid-3">
              {servicos.map(s => (
                <div key={s.id} className="card">
                  <div className="card-header">{s.nome}</div>
                  <div className="card-body">
                    <p>{s.descricao}</p>
                    <p><strong>Preço:</strong> {formatarMoeda(s.preco)}</p>
                    <p><strong>Duração:</strong> {s.duracaoEmMinutos || 'N/A'} min</p>
                  </div>
                  <div className="card-footer" style={{ justifyContent: 'flex-start' }}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => abrirModalAgendar(s)}
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nenhum serviço cadastrado no momento</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Agendamento */}
      {showModal && servicoSelecionado && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Agendar: {servicoSelecionado.nome}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleAgendar}>
              <div className="form-group">
                <label className="form-label">Profissional *</label>
                <select
                  className="form-control"
                  value={profissionalId}
                  onChange={(e) => setProfissionalId(e.target.value)}
                  required
                >
                  <option value="">Selecione um profissional</option>
                  {profissionais.length > 0 ? (
                    profissionais.map(p => (
                      <option key={p.idUsuario} value={p.idUsuario}>{p.nome}</option>
                    ))
                  ) : (
                    <option value="" disabled>Nenhum profissional disponível</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Data e Hora *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={dataHora}
                  onChange={(e) => setDataHora(e.target.value)}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
                <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  Horário de funcionamento: 8h às 18h
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Opção de Pagamento</label>
                <div>
                  <input 
                    type="checkbox" 
                    id="pagamentoParcial"
                    checked={pagamentoParcial} 
                    onChange={(e) => setPagamentoParcial(e.target.checked)} 
                  />
                  <label htmlFor="pagamentoParcial" style={{ marginLeft: '10px' }}>
                    Pague 50% antes
                  </label>
                </div>
                <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  Valor total: {formatarMoeda(servicoSelecionado.preco)}
                </small>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowModal(false)}
                  disabled={processando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={processando || loading || profissionais.length === 0}
                >
                  {processando ? 'Agendando...' : 'Confirmar Agendamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ClienteServicos;