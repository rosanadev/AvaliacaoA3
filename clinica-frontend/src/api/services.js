import api from './axiosConfig';

export const servicoAPI = {
  // Listar todos os serviços
  listar: async () => {
    const response = await api.get('/servicos');
    return response.data;
  },

  // Buscar serviço por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/servicos/${id}`);
    return response.data;
  },

  // Criar novo serviço (admin)
  criar: async (servico) => {
    const response = await api.post('/servicos', servico);
    return response.data;
  },

  // Deletar serviço (admin)
  deletar: async (id) => {
    await api.delete(`/servicos/${id}`);
  },

  listarProfissionaisPorServico: async (id) => {
    const response = await api.get(`/servicos/${id}/profissionais`);
    return response.data;
  },
};

export const clienteAPI = {
  // Cadastrar cliente
  cadastrar: async (cliente) => {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  // Login
  login: async (email, senha) => {
    const response = await api.post('/clientes/login', { email, senha });
    return response.data;
  },

  // Buscar cliente por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  // Listar agendamentos do cliente
  listarAgendamentos: async (id, filtro = null) => {
    const url = filtro 
      ? `/clientes/${id}/agendamentos?filtro=${filtro}`
      : `/clientes/${id}/agendamentos`;
    const response = await api.get(url);
    return response.data;
  },
};

export const agendamentoAPI = {
  // Criar agendamento
  criar: async (agendamento) => {
    const response = await api.post('/agendamentos', agendamento);
    return response.data;
  },

  // Listar todos
  listar: async () => {
    const response = await api.get('/agendamentos');
    return response.data;
  },

  // Buscar por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/agendamentos/${id}`);
    return response.data;
  },

  // Cancelar
  cancelar: async (id) => {
    await api.delete(`/agendamentos/${id}`);
  },

  // Reagendar
  reagendar: async (id, novaDataHora) => {
    const response = await api.put(`/agendamentos/${id}/reagendar`, novaDataHora);
    return response.data;
  },

  // Atualizar status
  atualizarStatus: async (id, novoStatus) => {
    const response = await api.patch(`/agendamentos/${id}/status?novoStatus=${novoStatus}`);
    return response.data;
  },
};

export const avaliacaoAPI = {
  // Criar avaliação
  criar: async (agendamentoId, avaliacao) => {
    const response = await api.post(`/avaliacoes/${agendamentoId}`, avaliacao);
    return response.data;
  },
};

export const profissionalAPI = {
  // Login
  login: async (email, senha) => {
    const response = await api.post('/profissionais/login', { email, senha });
    return response.data;
  },

  // Buscar por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/profissionais/${id}`);
    return response.data;
  },

  // Listar agendamentos
  listarAgendamentos: async (id) => {
    const response = await api.get(`/profissionais/${id}/agendamentos`);
    return response.data;
  },
};

export const administradorAPI = {
  // Login
  login: async (email, senha) => {
    const response = await api.post('/administrador/login', { email, senha });
    return response.data;
  },

  // Listar profissionais
  listarProfissionais: async () => {
    const response = await api.get('/administrador/profissionais');
    return response.data;
  },

  // Criar profissional
  criarProfissional: async (profissional) => {
    const response = await api.post('/administrador/profissionais', profissional);
    return response.data;
  },

  // Atualizar profissional
  atualizarProfissional: async (id, profissional) => {
    const response = await api.put(`/administrador/profissionais/${id}`, profissional);
    return response.data;
  },

  // Deletar profissional
  deletarProfissional: async (id) => {
    await api.delete(`/administrador/profissionais/${id}`);
  },

  // Listar solicitações
  listarSolicitacoes: async () => {
    const response = await api.get('/administrador/solicitacoes');
    return response.data;
  },

  // Processar solicitação
  processarSolicitacao: async (id, novoStatus) => {
    const response = await api.patch(`/administrador/solicitacoes/${id}/status?novoStatus=${novoStatus}`);
    return response.data;
  },

  // Calendário completo
  getCalendarioCompleto: async (dataInicio = null, dataFim = null) => {
    let url = '/administrador/calendario';
    if (dataInicio && dataFim) {
      url += `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  associarServicoEspecialidade: async (especialidadeId, servicoId) => {
    const response = await api.put(`/administrador/especialidades/${especialidadeId}/servicos/${servicoId}`);
    return response.data;
  },

  associarProfissionalEspecialidade: async (especialidadeId, profissionalId) => {
    const response = await api.put(`/administrador/especialidades/${especialidadeId}/profissionais/${profissionalId}`);
    return response.data;
  },

};


export const especialidadeAPI = {
  criar: async (especialidade) => {
    // espera um objeto { nome: "Nome da Especialidade" }
    const response = await api.post('/especialidades', especialidade);
    return response.data;
  },
  listar: async () => {
    const response = await api.get('/especialidades');
    return response.data;
  },
};

