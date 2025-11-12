import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                🌸 Rosa Beauty
              </span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/servicos"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Serviços
              </Link>
              <Link
                to="/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="bg-white border-2 border-primary-600 text-primary-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-50"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Bem-vinda à
            <span className="text-primary-600"> Clínica Rosa Beauty</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Sua beleza é nossa especialidade. Agende seus tratamentos com os
            melhores profissionais de estética da região.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              to="/servicos"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Ver Serviços
            </Link>
            <Link
              to="/cadastro"
              className="bg-white border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Criar Conta
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">💆‍♀️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Profissionais Qualificados
            </h3>
            <p className="text-gray-600">
              Equipe especializada e experiente para cuidar de você
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Agendamento Fácil
            </h3>
            <p className="text-gray-600">
              Marque seus horários online de forma rápida e prática
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Qualidade Garantida
            </h3>
            <p className="text-gray-600">
              Tratamentos de excelência com produtos premium
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Rosa Beauty. Todos os direitos reservados.</p>
            <p className="mt-2 text-sm">
              Salvador, Bahia - Brasil
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;