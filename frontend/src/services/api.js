import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== CLIENTE APIs ==========
export const clienteAPI = {
  listar: () => api.get('/clientes'),
  cadastrar: (cliente) => api.post('/clientes', cliente),
  buscarPorId: (id) => api.get(`/clientes/${id}`),
  login: (credenciais) => api.post('/clientes/login', credenciais),
  buscarAgendamentos: (id, filtro) => {
    const url = filtro ? `/clientes/${id}/agendamentos?filtro=${filtro}` : `/clientes/${id}/agendamentos`;
    return api.get(url);
  },
};

// ========== PROFISSIONAL APIs ==========
export const profissionalAPI = {
  listar: () => api.get('/profissionais'),
  buscarPorId: (id) => api.get(`/profissionais/${id}`),
  login: (credenciais) => api.post('/profissionais/login', credenciais),
  buscarAgendamentos: (id) => api.get(`/profissionais/${id}/agendamentos`),
};

// ========== ADMINISTRADOR APIs ==========
export const administradorAPI = {
  login: (credenciais) => api.post('/administrador/login', credenciais),
  listarSolicitacoes: () => api.get('/administrador/solicitacoes'),
  listarProfissionais: () => api.get('/administrador/profissionais'),
  criarProfissional: (profissional) => api.post('/administrador/profissionais', profissional),
  atualizarProfissional: (id, profissional) => api.put(`/administrador/profissionais/${id}`, profissional),
  deletarProfissional: (id) => api.delete(`/administrador/profissionais/${id}`),
  processarSolicitacao: (id, novoStatus) => api.patch(`/administrador/solicitacoes/${id}/status?novoStatus=${novoStatus}`),
  atualizarAgendamento: (id, agendamento) => api.put(`/administrador/agendamentos/${id}`, agendamento),
  deletarAgendamento: (id) => api.delete(`/administrador/agendamentos/${id}`),
  buscarCalendarioCompleto: (dataInicio, dataFim) => {
    let url = '/administrador/calendario';
    const params = [];
    if (dataInicio) params.push(`dataInicio=${dataInicio}`);
    if (dataFim) params.push(`dataFim=${dataFim}`);
    if (params.length > 0) url += '?' + params.join('&');
    return api.get(url);
  },
  buscarCalendarioProfissional: (profissionalId, dataInicio, dataFim) => {
    let url = `/administrador/calendario/profissional/${profissionalId}`;
    const params = [];
    if (dataInicio) params.push(`dataInicio=${dataInicio}`);
    if (dataFim) params.push(`dataFim=${dataFim}`);
    if (params.length > 0) url += '?' + params.join('&');
    return api.get(url);
  },

  // --- ADICIONE ESTAS DUAS FUNÇÕES ---
  associarServico: (especialidadeId, servicoId) => 
    api.put(`/administrador/especialidades/${especialidadeId}/servicos/${servicoId}`),
  
  associarProfissional: (especialidadeId, profissionalId) => 
    api.put(`/administrador/especialidades/${especialidadeId}/profissionais/${profissionalId}`),
};

// ========== SERVIÇO APIs ==========
export const servicoAPI = {
  listar: () => api.get('/servicos'),
  criar: (servico) => api.post('/servicos', servico),
  buscarPorId: (id) => api.get(`/servicos/${id}`),
  atualizar: (id, servico) => api.put(`/servicos/${id}`, servico),
  deletar: (id) => api.delete(`/servicos/${id}`),
  listarProfissionais: (id) => api.get(`/servicos/${id}/profissionais`),
};

// ========== AGENDAMENTO APIs ==========
export const agendamentoAPI = {
  listar: () => api.get('/agendamentos'),
  criar: (agendamento) => api.post('/agendamentos', agendamento),
  buscarPorId: (id) => api.get(`/agendamentos/${id}`),
  cancelar: (id) => api.delete(`/agendamentos/${id}`),
  reagendar: (id, novaDataHora) => api.put(`/agendamentos/${id}/reagendar`, novaDataHora, {
    headers: { 'Content-Type': 'application/json' }
  }),
  atualizarStatus: (id, novoStatus) => api.patch(`/agendamentos/${id}/status?novoStatus=${novoStatus}`),
  listarHistorico: (status) => {
    const url = status ? `/agendamentos/historico?status=${status}` : '/agendamentos/historico';
    return api.get(url);
  },
  listarPassados: () => api.get('/agendamentos/passados'),
};

// ========== AVALIAÇÃO APIs ==========
export const avaliacaoAPI = {
  criar: (agendamentoId, avaliacao) => api.post(`/avaliacoes/${agendamentoId}`, avaliacao),
};

// ========== SOLICITAÇÃO APIs ==========
export const solicitacaoAPI = {
  listar: () => api.get('/solicitacoes'),
  criar: (solicitacao) => api.post('/solicitacoes', solicitacao),
  criarReagendamento: (solicitacao) => api.post('/solicitacoes/reagendamento', solicitacao),
};

// ========== ESPECIALIDADE APIs ==========
export const especialidadeAPI = {
  listar: () => api.get('/especialidades'),
  criar: (especialidade) => api.post('/especialidades', especialidade),
  buscarPorId: (id) => api.get(`/especialidades/${id}`),
  atualizar: (id, especialidade) => api.put(`/especialidades/${id}`, especialidade),
  deletar: (id) => api.delete(`/especialidades/${id}`),
  associarServico: (especialidadeId, servicoId) => 
    api.put(`/especialidades/${especialidadeId}/servicos/${servicoId}`),
  desassociarServico: (especialidadeId, servicoId) => 
    api.delete(`/especialidades/${especialidadeId}/servicos/${servicoId}`),
  associarProfissional: (especialidadeId, profissionalId) => 
    api.put(`/especialidades/${especialidadeId}/profissionais/${profissionalId}`),
  desassociarProfissional: (especialidadeId, profissionalId) => 
    api.delete(`/especialidades/${especialidadeId}/profissionais/${profissionalId}`),
};

export default api;