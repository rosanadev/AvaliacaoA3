import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Servicos from './pages/Servicos';
import Cadastro from './pages/Cadastro';
import Agendar from './pages/Agendar';
import ClienteDashboard from './pages/dashboard/ClienteDashboard';

// Componente de Rota Privada
const PrivateRoute = ({ children, tipoPermitido }) => {
  const { isAuthenticated, tipoUsuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (tipoPermitido && tipoUsuario !== tipoPermitido) {
    return <Navigate to="/" />;
  }

  return children;
};

// Componente temporário de Dashboard
const DashboardPlaceholder = ({ tipo }) => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold text-primary-600">
              🌸 Rosa Beauty
            </span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dashboard {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Bem-vindo(a), {user?.nome}!
          </p>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mt-8">
            <p className="text-gray-700">
              🎉 <strong>Login realizado com sucesso!</strong>
            </p>
            <p className="text-gray-600 mt-2">
              O dashboard completo está em desenvolvimento.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Tipo de usuário: <span className="font-semibold">{tipo}</span>
            </p>
            <p className="text-sm text-gray-500">
              ID: <span className="font-semibold">{user?.idUsuario}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas do Cliente */}
          <Route
            path="/cliente/dashboard"
            element={
              <PrivateRoute tipoPermitido="cliente">
                <ClienteDashboard /> 
              </PrivateRoute>
            }
          />
          <Route
            path="/agendar/:servicoId"
            element={
              <PrivateRoute tipoPermitido="cliente">
                <Agendar />
              </PrivateRoute>
            }
          />

          {/* Rotas do Profissional */}
          <Route
            path="/profissional/dashboard"
            element={
              <PrivateRoute tipoPermitido="profissional">
                <DashboardPlaceholder tipo="profissional" />
              </PrivateRoute>
            }
          />

          {/* Rotas do Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute tipoPermitido="admin">
                <DashboardPlaceholder tipo="admin" />
              </PrivateRoute>
            }
          />

          {/* Rota 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;