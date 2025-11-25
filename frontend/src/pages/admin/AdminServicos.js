import React, { useState, useEffect } from 'react';
import { servicoAPI } from '../../services/api'; 
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

const AdminServicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [servicoEditando, setServicoEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: 0,
    duracao_em_minutos: 30 
  });
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    carregarServicos();
  }, []);

  const handleApiError = (error, defaultMessage) => {
    if (error.response && error.response.status === 400) {
      const errors = error.response.data;
      
      if (errors.nome) toast.error(`Nome: ${errors.nome}`);
      else if (errors.descricao) toast.error(`Descrição: ${errors.descricao}`);
      else if (errors.preco) toast.error(`Preço: ${errors.preco}`);
      else if (errors.duracao_em_minutos) toast.error(`Duração: ${errors.duracao_em_minutos}`);
      else {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
          toast.error(`${errorKeys[0]}: ${errors[errorKeys[0]]}`);
        } else {
          toast.error('Erro de validação. Verifique os campos.');
        }
      }
    } else {
      toast.error(error.response?.data?.message || defaultMessage);
    }
    console.error(error);
  };

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

  const deletar = async (id) => {
    if (window.confirm('Confirma exclusão? Este serviço será removido de especialidades e agendamentos futuros serão CANCELADOS.')) {
      try {
        await servicoAPI.deletar(id);
        toast.success('Serviço excluído');
        carregarServicos();
      } catch (error) {
        handleApiError(error, 'Erro ao excluir serviço.');
      }
    }
  };
  
  const handleEditar = (servico) => {
    setServicoEditando(servico);
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco,
      duracao_em_minutos: servico.duracaoEmMinutos 
    });
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setServicoEditando(null);
    setProcessando(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    setProcessando(true);
    try {
      const dadosAtualizados = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        duracaoEmMinutos: parseInt(formData.duracao_em_minutos, 10) 
      };

      if (!dadosAtualizados.nome || dadosAtualizados.nome.trim().length === 0) {
        toast.error("O campo Nome é obrigatório.");
        setProcessando(false);
        return;
      }
      if (!dadosAtualizados.descricao || dadosAtualizados.descricao.trim().length === 0) {
        toast.error("O campo Descrição é obrigatório.");
        setProcessando(false);
        return;
      }
      if (isNaN(dadosAtualizados.preco) || dadosAtualizados.preco <= 0) {
         toast.error("O Preço deve ser maior que zero.");
         setProcessando(false);
         return;
      }
       if (isNaN(dadosAtualizados.duracaoEmMinutos) || dadosAtualizados.duracaoEmMinutos < 1) { 
         toast.error("A Duração deve ser de no mínimo 1 minuto.");
         setProcessando(false);
         return;
      }
      // --- FIM DA CORREÇÃO ---

      await servicoAPI.atualizar(servicoEditando.id, dadosAtualizados);
      toast.success('Serviço atualizado!');
      fecharModal();
      carregarServicos();
    } catch (error) {
      handleApiError(error, 'Erro ao atualizar serviço');
    } finally {
      setProcessando(false);
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  if (loading) {
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
      <div className="container fade-in">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: 'var(--primary-color)', margin: 0 }}>
            Gerenciar Serviços
          </h1>
        </div>
        
        <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
          Use esta tela para editar ou excluir serviços existentes. Para cadastrar, vá à tela de <strong>Especialidades</strong>.
        </p>

        {servicos.length > 0 ? (
          <div className="card">
            <div className="card-body">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Preço</th>
                      <th>Duração</th>
                      <th style={{ width: '150px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicos.map(s => (
                      <tr key={s.id}>
                        <td>{s.nome}</td>
                        <td>{formatarMoeda(s.preco)}</td>
                        <td>{s.duracaoEmMinutos} min</td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn btn-outline" onClick={() => handleEditar(s)}>Editar</button>
                            <button className="btn btn-danger" onClick={() => deletar(s.id)}>Excluir</button>
                          </div>
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
            <p>Nenhum serviço cadastrado</p>
          </div>
        )}
      </div>

      {showModal && servicoEditando && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Editar Serviço</h2>
              <button className="modal-close" onClick={fecharModal}>×</button>
            </div>
            <form onSubmit={handleSalvarEdicao}>
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input type="text" name="nome" className="form-control" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Descrição *</label>
                <textarea name="descricao" className="form-control" rows="3" value={formData.descricao} onChange={handleChange} required></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Preço (R$) *</label>
                  <input type="number" name="preco" className="form-control" value={formData.preco} onChange={handleChange} required min="0.01" step="0.01" />
                </div>
                <div className="form-group">
                  <label className="form-label">Duração (min) *</label>
                  <input type="number" name="duracao_em_minutos" className="form-control" value={formData.duracao_em_minutos} onChange={handleChange} required min="1" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={fecharModal} disabled={processando}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={processando}>
                  {processando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminServicos;