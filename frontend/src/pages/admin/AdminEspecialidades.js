import React, { useState, useEffect } from 'react';
import { especialidadeAPI, administradorAPI, servicoAPI } from '../../services/api'; 
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

const AdminEspecialidades = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(false);

  const [showAssociarProfissional, setShowAssociarProfissional] = useState(false);
  const [showAssociarServico, setShowAssociarServico] = useState(false);
  const [showCriarEspecialidade, setShowCriarEspecialidade] = useState(false);
  
  const [isCreatingNew, setIsCreatingNew] = useState(false); 

  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState(null);
  
  const [profissionalId, setProfissionalId] = useState('');
  const [servicoId, setServicoId] = useState('');


  const [formEspecialidade, setFormEspecialidade] = useState({ nome: '', descricao: '' });
  
  const [formServico, setFormServico] = useState({ 
    nome: '', 
    descricao: '', 
    preco: '',
    duracao_em_minutos: 30 
  });
  
  const [formProfissional, setFormProfissional] = useState({
    nome: '', cpf: '', data_nascimento: '', email: '', senha: '',
    telefone: '', cep: '', complemento: '', bairro: '', cidade: '',
    estado: '', registroProfissional: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resEsp, resProf, resServ] = await Promise.all([
        especialidadeAPI.listar(),
        administradorAPI.listarProfissionais(),
        servicoAPI.listar()
      ]);
      setEspecialidades(resEsp.data);
      setProfissionais(resProf.data);
      setServicos(resServ.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const resetarForms = () => {
    setFormEspecialidade({ nome: '', descricao: '' });
    setFormServico({ nome: '', descricao: '', preco: '', duracao_em_minutos: 30 });
    setFormProfissional({
      nome: '', cpf: '', data_nascimento: '', email: '', senha: '',
      telefone: '', cep: '', complemento: '', bairro: '', cidade: '',
      estado: '', registroProfissional: ''
    });
    setServicoId('');
    setProfissionalId('');
    setIsCreatingNew(false);
  };
  
  const fecharModais = () => {
    setShowAssociarProfissional(false);
    setShowAssociarServico(false);
    setShowCriarEspecialidade(false);
    resetarForms();
  }

  const handleApiError = (error, defaultMessage) => {
    if (error.response && error.response.status === 400) {
      const errors = error.response.data; 
      
      if (errors.nome) toast.error(`Nome: ${errors.nome}`);
      else if (errors.descricao) toast.error(`Descrição: ${errors.descricao}`);
      else if (errors.preco) toast.error(`Preço: ${errors.preco}`);
      else if (errors.duracao_em_minutos) toast.error(`Duração: ${errors.duracao_em_minutos}`); 
      else if (errors.email) toast.error(`Email: ${errors.email}`);
      else if (errors.cpf) toast.error(`CPF: ${errors.cpf}`);
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

  const handleCriarEspecialidade = async (e) => {
    e.preventDefault();
    setProcessando(true);
    try {
      await especialidadeAPI.criar(formEspecialidade);
      toast.success('Especialidade criada!');
      fecharModais();
      carregarDados();
    } catch (error) { 
      handleApiError(error, 'Erro ao criar especialidade');
    }
    finally { setProcessando(false); }
  };

  const handleAssociarProfissional = async (e) => {
    e.preventDefault();
    if (!especialidadeSelecionada || !profissionalId) return;
    setProcessando(true);
    try {
      await administradorAPI.associarProfissional(especialidadeSelecionada.idEspecialidade, profissionalId);
      toast.success('Profissional associado!');
      fecharModais();
      carregarDados();
    } catch (error) { 
      handleApiError(error, 'Erro ao associar profissional');
    }
    finally { setProcessando(false); }
  };

  const handleAssociarServico = async (e) => {
    e.preventDefault();
    if (!especialidadeSelecionada || !servicoId) return;
     setProcessando(true);
    try {
      await administradorAPI.associarServico(especialidadeSelecionada.idEspecialidade, servicoId);
      toast.success('Serviço associado!');
      fecharModais();
      carregarDados();
    } catch (error) { 
      handleApiError(error, 'Erro ao associar serviço');
    }
    finally { setProcessando(false); }
  };
  
  const handleCriarEAssociarServico = async (e) => {
    e.preventDefault();
    setProcessando(true);
    
    const servicoDTO = {
      nome: formServico.nome,
      descricao: formServico.descricao,
      preco: parseFloat(formServico.preco),
      duracaoEmMinutos: parseInt(formServico.duracao_em_minutos, 10) 
    };


    try {
      const servicoResponse = await servicoAPI.criar(servicoDTO);
      const novoServicoId = servicoResponse.data.id;
      toast.info('Serviço criado... associando...');
      
      await administradorAPI.associarServico(especialidadeSelecionada.idEspecialidade, novoServicoId);
      
      toast.success('Serviço criado e associado com sucesso!');
      fecharModais();
      carregarDados();
    } catch (error) { 
      handleApiError(error, 'Erro ao criar e associar serviço');
    } finally { setProcessando(false); }
  };

  const handleCriarEAssociarProfissional = async (e) => {
    e.preventDefault();
    setProcessando(true);
    
    try {
      const profResponse = await administradorAPI.criarProfissional(formProfissional);
      const novoProfissionalId = profResponse.data.idUsuario;
      toast.info('Profissional criado... associando...');

      await administradorAPI.associarProfissional(especialidadeSelecionada.idEspecialidade, novoProfissionalId);

      toast.success('Profissional criado e associado com sucesso!');
      fecharModais();
      carregarDados();
    } catch (error) { 
       handleApiError(error, 'Erro ao criar e associar profissional');
    } finally { setProcessando(false); }
  };
  
  const handleChange = (e, setForm) => {
    let { name, value } = e.target;
    
    if (name === 'cpf') value = value.replace(/\D/g, '').slice(0, 11);
    else if (name === 'telefone') value = value.replace(/\D/g, '').slice(0, 11);
    else if (name === 'cep') value = value.replace(/\D/g, '').slice(0, 8);
    else if (name === 'estado') value = value.toUpperCase().slice(0, 2);

    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const abrirModalAssociarServico = (esp) => {
    resetarForms();
    setEspecialidadeSelecionada(esp);
    setShowAssociarServico(true);
  };
  
  const abrirModalAssociarProfissional = (esp) => {
    resetarForms();
    setEspecialidadeSelecionada(esp);
    setShowAssociarProfissional(true);
  };
  
  const abrirModalCriarEspecialidade = () => {
    resetarForms();
    setShowCriarEspecialidade(true);
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
      <div className="container fade-in">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
          <h1 style={{ color: 'var(--primary-color)', margin: 0 }}>
            Especialidades
          </h1>
          <button className="btn btn-primary" onClick={abrirModalCriarEspecialidade}>
            + Nova Especialidade
          </button>
        </div>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
          Esta é a tela principal. Crie especialidades e associe serviços e profissionais a elas.
        </p>

        {especialidades.length > 0 ? (
          <div className="grid grid-3">
            {especialidades.map(esp => (
              <div key={esp.idEspecialidade} className="card">
                <div className="card-header">{esp.nome}</div>
                <div className="card-body">
                  <p>{esp.descricao}</p>
                  
                  <div>
                    <strong>Profissionais:</strong>
                    {esp.profissionais && esp.profissionais.length > 0 ? (
                      <ul>{esp.profissionais.map(p => <li key={p.idUsuario}>{p.nome}</li>)}</ul>
                    ) : (<p style={{fontSize: '0.9rem', color: 'var(--text-light)'}}>Nenhum</p>)}
                  </div>
                  
                  <div style={{marginTop: '15px'}}>
                    <strong>Serviços:</strong>
                    {esp.servicos && esp.servicos.length > 0 ? (
                      <ul>{esp.servicos.map(s => <li key={s.id}>{s.nome}</li>)}</ul>
                    ) : (<p style={{fontSize: '0.9rem', color: 'var(--text-light)'}}>Nenhum</p>)}
                  </div>
                </div>
                
                <div className="card-footer" style={{ justifyContent: 'space-around' }}>
                  <button className="btn btn-outline" onClick={() => abrirModalAssociarServico(esp)}>
                    + Associar Serviço
                  </button>
                  <button className="btn btn-outline" onClick={() => abrirModalAssociarProfissional(esp)}>
                    + Associar Prof.
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Nenhuma especialidade cadastrada</p>
          </div>
        )}
      </div>

      {/* Modal Criar Especialidade */}
      {showCriarEspecialidade && (
        <div className="modal-overlay" onClick={fecharModais}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nova Especialidade</h2>
              <button className="modal-close" onClick={fecharModais}>×</button>
            </div>
            <form onSubmit={handleCriarEspecialidade}>
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input type="text" className="form-control" value={formEspecialidade.nome} onChange={(e) => handleChange(e, setFormEspecialidade)} name="nome" required />
              </div>
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea className="form-control" value={formEspecialidade.descricao} onChange={(e) => handleChange(e, setFormEspecialidade)} name="descricao" rows="3"></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={processando}>
                {processando ? 'Salvando...' : 'Salvar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Associar/Criar Serviço */}
      {showAssociarServico && (
        <div className="modal-overlay" onClick={fecharModais}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Associar Serviço</h2>
              <button className="modal-close" onClick={fecharModais}>×</button>
            </div>
            
            <button type="button" className="btn btn-link" onClick={() => setIsCreatingNew(!isCreatingNew)}>
              {isCreatingNew ? 'Ou, selecionar um serviço existente' : 'Ou, cadastrar um novo serviço para associar'}
            </button>

            {!isCreatingNew && (
              <form onSubmit={handleAssociarServico} style={{marginTop: '10px'}}>
                <div className="form-group">
                  <label className="form-label">Selecione o Serviço *</label>
                  <select className="form-control" value={servicoId} onChange={(e) => setServicoId(e.target.value)} required>
                    <option value="">-- Selecione --</option>
                    {servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={processando}>
                  {processando ? 'Associando...' : 'Associar Serviço Existente'}
                </button>
              </form>
            )}
            
            {isCreatingNew && (
              <form onSubmit={handleCriarEAssociarServico} style={{marginTop: '10px'}}>
                <div className="form-group">
                    <label className="form-label">Nome do Novo Serviço *</label>
                    <input type="text" name="nome" className="form-control" value={formServico.nome} onChange={(e) => handleChange(e, setFormServico)} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Descrição *</label>
                    <textarea name="descricao" className="form-control" rows="3" value={formServico.descricao} onChange={(e) => handleChange(e, setFormServico)} required></textarea>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Preço (R$) *</label>
                        <input type="number" name="preco" className="form-control" value={formServico.preco} onChange={(e) => handleChange(e, setFormServico)} required min="0.01" step="0.01" placeholder="Ex: 50.00" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Duração (min) *</label>
                        <input type="number" name="duracao_em_minutos" className="form-control" value={formServico.duracao_em_minutos} onChange={(e) => handleChange(e, setFormServico)} required min="1" />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={processando}>
                  {processando ? 'Salvando...' : 'Cadastrar e Associar'}
                </button>
              </form>
            )}
            
          </div>
        </div>
      )}

      {/* Modal Associar/Criar Profissional */}
      {showAssociarProfissional && (
         <div className="modal-overlay" onClick={fecharModais}>
         <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
           <div className="modal-header">
             <h2 className="modal-title">Associar Profissional</h2>
             <button className="modal-close" onClick={fecharModais}>×</button>
           </div>
           
            <button type="button" className="btn btn-link" onClick={() => setIsCreatingNew(!isCreatingNew)}>
              {isCreatingNew ? 'Ou, selecionar um profissional existente' : 'Ou, cadastrar um novo profissional para associar'}
            </button>
            
            {!isCreatingNew && (
              <form onSubmit={handleAssociarProfissional} style={{marginTop: '10px'}}>
                <div className="form-group">
                  <label className="form-label">Selecione o Profissional *</label>
                  <select className="form-control" value={profissionalId} onChange={(e) => setProfissionalId(e.target.value)} required>
                    <option value="">-- Selecione --</option>
                    {profissionais.map(p => <option key={p.idUsuario} value={p.idUsuario}>{p.nome}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={processando}>
                  {processando ? 'Associando...' : 'Associar Profissional Existente'}
                </button>
              </form>
            )}
            
            {isCreatingNew && (
              <form onSubmit={handleCriarEAssociarProfissional} style={{marginTop: '10px'}}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nome Completo *</label>
                    <input type="text" name="nome" className="form-control" value={formProfissional.nome} onChange={(e) => handleChange(e, setFormProfissional)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CPF *</label>
                    <input type="text" name="cpf" className="form-control" value={formProfissional.cpf} onChange={(e) => handleChange(e, setFormProfissional)} required placeholder="00000000000" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Data de Nascimento *</label>
                    <input type="date" name="data_nascimento" className="form-control" value={formProfissional.data_nascimento} onChange={(e) => handleChange(e, setFormProfissional)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone *</label>
                    <input type="text" name="telefone" className="form-control" value={formProfissional.telefone} onChange={(e) => handleChange(e, setFormProfissional)} required placeholder="00000000000" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input type="email" name="email" className="form-control" value={formProfissional.email} onChange={(e) => handleChange(e, setFormProfissional)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Senha *</label>
                    <input type="password" name="senha" className="form-control" value={formProfissional.senha} onChange={(e) => handleChange(e, setFormProfissional)} required minLength="6" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">CEP *</label>
                    <input type="text" name="cep" className="form-control" value={formProfissional.cep} onChange={(e) => handleChange(e, setFormProfissional)} required placeholder="00000000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bairro *</label>
                    <input type="text" name="bairro" className="form-control" value={formProfissional.bairro} onChange={(e) => handleChange(e, setFormProfissional)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Cidade *</label>
                    <input type="text" name="cidade" className="form-control" value={formProfissional.cidade} onChange={(e) => handleChange(e, setFormProfissional)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estado (UF) *</label>
                    <input type="text" name="estado" className="form-control" value={formProfissional.estado} onChange={(e) => handleChange(e, setFormProfissional)} required placeholder="BA" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Complemento</label>
                    <input type="text" name="complemento" className="form-control" value={formProfissional.complemento} onChange={(e) => handleChange(e, setFormProfissional)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Registro Profissional</label>
                    <input type="text" name="registroProfissional" className="form-control" value={formProfissional.registroProfissional} onChange={(e) => handleChange(e, setFormProfissional)} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={processando}>
                  {processando ? 'Salvando...' : 'Cadastrar e Associar'}
                </button>
              </form>
            )}
         </div>
       </div>
      )}
    </>
  );
};

export default AdminEspecialidades;