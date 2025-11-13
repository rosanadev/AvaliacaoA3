import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { servicoAPI, agendamentoAPI } from '../api/services';

const Agendar = () => {
  const { servicoId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [servico, setServico] = useState(null);
  const [profissionais, setProfissionais] = useState([]);

  const [formData, setFormData] = useState({
    profissionalId: '',
    dataHora: '',
    pagamentoParcial: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [servicoId]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError('');
      
      const dadosServico = await servicoAPI.buscarPorId(servicoId);
      setServico(dadosServico);

      const response = await servicoAPI.listarProfissionaisPorServico(servicoId);
      console.log('Profissionais retornados:', response);
      
      // ✅ CORREÇÃO: Converte Set ou qualquer estrutura para Array
      let dadosProfissionais = [];
      
      if (Array.isArray(response)) {
        dadosProfissionais = response;
      } else if (response && typeof response === 'object') {
        // Se for um Set ou objeto iterável
        if (response[Symbol.iterator]) {
          dadosProfissionais = Array.from(response);
        } else {
          // Se for um objeto com propriedades
          dadosProfissionais = Object.values(response);
        }
      }
      
      setProfissionais(dadosProfissionais);

      if (dadosProfissionais.length > 0) {
        setFormData(f => ({ ...f, profissionalId: dadosProfissionais[0].idUsuario }));
      }

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados do agendamento: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.profissionalId || !formData.dataHora) {
      setError('Por favor, selecione um profissional e uma data/hora.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const agendamentoDTO = {
        cliente: { idUsuario: user.idUsuario },
        profissional: { idUsuario: parseInt(formData.profissionalId) },
        servico: { id: parseInt(servicoId) },
        dataHora: formData.dataHora,
        pagamentoParcial: formData.pagamentoParcial,
      };

      await agendamentoAPI.criar(agendamentoDTO);
      alert('Agendamento realizado com sucesso!');
      navigate('/cliente/dashboard');

    } catch (err) {
      console.error('Erro ao criar agendamento:', err);
      setError(err.response?.data?.message || err.response?.data || 'Erro ao criar agendamento.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !servico) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="text-center">
           <p className="text-red-500 mb-4">{error}</p>
           <Link to="/servicos" className="text-primary-600 hover:underline">Voltar aos serviços</Link>
         </div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Link to="/servicos" className="text-sm text-primary-600 hover:text-primary-500">
          &larr; Voltar aos serviços
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 mt-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agendar Serviço</h1>
          <p className="text-xl text-primary-600 font-semibold">{servico.nome}</p>
          <p className="text-gray-600 mt-2">{servico.descricao}</p>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {/* Seleção de Profissional */}
            <div>
              <label htmlFor="profissionalId" className="block text-sm font-medium text-gray-700">
                Escolha o(a) profissional
              </label>
              <select
                id="profissionalId"
                name="profissionalId"
                value={formData.profissionalId}
                onChange={handleChange}
                className="mt-1 input-field"
                required
                disabled={profissionais.length === 0}
              >
                {profissionais.length === 0 ? (
                  <option value="">Nenhum profissional disponível para este serviço</option>
                ) : (
                  profissionais.map(p => (
                    <option key={p.idUsuario} value={p.idUsuario}>
                      {p.nome}
                    </option>
                  ))
                )}
              </select>
              {profissionais.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  Nenhum profissional está disponível para este serviço no momento. 
                  Entre em contato com a clínica.
                </p>
              )}
            </div>

            {/* Seleção de Data e Hora */}
            <div>
              <label htmlFor="dataHora" className="block text-sm font-medium text-gray-700">
                Escolha a data e hora
              </label>
              <input
                id="dataHora"
                name="dataHora"
                type="datetime-local"
                value={formData.dataHora}
                onChange={handleChange}
                className="mt-1 input-field"
                required
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="mt-1 text-sm text-gray-500">
                Horário de funcionamento: 8h às 18h
              </p>
            </div>

            {/* Opção de Pagamento */}
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="pagamentoParcial"
                  name="pagamentoParcial"
                  type="checkbox"
                  checked={formData.pagamentoParcial}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="pagamentoParcial" className="font-medium text-gray-700">
                  Pagar 50% agora (sinal)
                </label>
                <p className="text-gray-500">O restante será pago na clínica.</p>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={submitting || profissionais.length === 0}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Agendando...' : `Confirmar Agendamento (R$ ${servico.preco})`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Agendar;