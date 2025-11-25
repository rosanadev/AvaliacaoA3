import React, { useState, useEffect } from 'react';
import { administradorAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

const AdminProfissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [profissionalEditando, setProfissionalEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    carregarProfissionais();
  }, []);

  const carregarProfissionais = async () => {
    try {
      setLoading(true);
      const response = await administradorAPI.listarProfissionais();
      setProfissionais(response.data);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar profissionais');
    } finally {
      setLoading(false);
    }
  };

  const deletar = async (id) => {
    if (window.confirm('Confirma exclusão? Este profissional será removido de especialidades e agendamentos futuros serão CANCELADOS.')) {
      try {
        await administradorAPI.deletarProfissional(id);
        toast.success('Profissional excluído');
        carregarProfissionais();
      } catch (error) {
        const msg = error.response?.data?.message || error.response?.data || 'Erro ao excluir. Verifique o console do servidor.';
        toast.error(msg);
        console.error(error);
      }
    }
  };

  const handleEditar = (profissional) => {
    setProfissionalEditando(profissional);
    setFormData({
      nome: profissional.nome || '',
      email: profissional.email || '',
      telefone: profissional.telefone || '',
      cep: profissional.cep || '',
      complemento: profissional.complemento || '',
      bairro: profissional.bairro || '',
      cidade: profissional.cidade || '',
      estado: profissional.estado || ''
    });
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setProfissionalEditando(null);
    setProcessando(false);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'telefone') value = value.replace(/\D/g, '').slice(0, 11);
    else if (name === 'cep') value = value.replace(/\D/g, '').slice(0, 8);
    else if (name === 'estado') value = value.toUpperCase().slice(0, 2);

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    setProcessando(true);
    try {
      await administradorAPI.atualizarProfissional(profissionalEditando.idUsuario, formData);
      toast.success('Profissional atualizado!');
      fecharModal();
      carregarProfissionais();
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao atualizar profissional';
      toast.error(msg);
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
              <p>Carregando profissionais...</p>
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
            Gerenciar Profissionais
          </h1>
        </div>
        
        <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
          Use esta tela para editar ou excluir profissionais existentes. Para cadastrar, vá à tela de <strong>Especialidades</strong>.
        </p>

        {profissionais.length > 0 ? (
          <div className="card">
            <div className="card-body">
                <div className="table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Registro</th>
                        <th style={{ width: '150px' }}>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {profissionais.map(p => (
                        <tr key={p.idUsuario}>
                        <td>{p.nome}</td>
                        <td>{p.email}</td>
                        <td>{p.telefone}</td>
                        <td>{p.registroProfissional || 'N/A'}</td>
                        <td>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button className="btn btn-outline" onClick={() => handleEditar(p)}>Editar</button>
                              <button className="btn btn-danger" onClick={() => deletar(p.idUsuario)}>Excluir</button>
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
            <p>Nenhum profissional cadastrado</p>
          </div>
        )}
      </div>

      {showModal && profissionalEditando && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Editar Profissional</h2>
              <button className="modal-close" onClick={fecharModal}>×</button>
            </div>
            <form onSubmit={handleSalvarEdicao}>
              <p style={{ color: 'var(--text-light)', marginBottom: '15px' }}>
                Editando: {profissionalEditando.nome} (ID: {profissionalEditando.idUsuario})
              </p>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nome Completo *</label>
                  <input type="text" name="nome" className="form-control" value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefone *</label>
                  <input type="text" name="telefone" className="form-control" value={formData.telefone} onChange={handleChange} required placeholder="00000000000" />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">CEP *</label>
                  <input type="text" name="cep" className="form-control" value={formData.cep} onChange={handleChange} required placeholder="00000000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Bairro *</label>
                  <input type="text" name="bairro" className="form-control" value={formData.bairro} onChange={handleChange} required />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cidade *</label>
                  <input type="text" name="cidade" className="form-control" value={formData.cidade} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado (UF) *</label>
                  <input type="text" name="estado" className="form-control" value={formData.estado} onChange={handleChange} required placeholder="BA" />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Complemento</label>
                <input type="text" name="complemento" className="form-control" value={formData.complemento} onChange={handleChange} />
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

export default AdminProfissionais;