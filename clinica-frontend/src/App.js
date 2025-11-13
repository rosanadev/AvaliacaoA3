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
import ProfissionalDashboard from './pages/dashboard/ProfissionalDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

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
                <ProfissionalDashboard />
              </PrivateRoute>
            }
          />

          {/* Rotas do Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute tipoPermitido="admin">
                <AdminDashboard />
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