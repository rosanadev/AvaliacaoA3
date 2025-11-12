import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicoAPI } from '../api/services';

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const data = await servicoAPI.listar();
      setServicos(data);
    } catch (err) {
      setError('Erro ao carregar serviços');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco);
  };

  const formatarDuracao = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    
    if (horas > 0 && mins > 0) {
      return `${horas}h ${mins}min`;
    } else if (horas > 0) {
      return `${horas}h`;
    } else {
      return `${mins}min`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              🌸 Rosa Beauty
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 px-3 py-2"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Nossos Serviços</h1>
          <p className="mt-4 text-xl text-gray-600">
            Escolha o tratamento perfeito para você
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Carregando serviços...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Lista de Serviços */}
        {!loading && !error && servicos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              Nenhum serviço disponível no momento
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Por favor, volte mais tarde
            </p>
          </div>
        )}

        {!loading && !error && servicos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicos.map((servico) => (
              <div
                key={servico.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {servico.nome}
                  </h3>
                  <p className="text-gray-600 mb-4">{servico.descricao}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Preço</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {formatarPreco(servico.preco)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Duração</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatarDuracao(servico.duracao_em_minutos)}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="block w-full text-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Agendar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {!loading && !error && servicos.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-4">
              Pronta para transformar sua beleza?
            </p>
            <Link
              to="/cadastro"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Criar Conta e Agendar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Servicos;