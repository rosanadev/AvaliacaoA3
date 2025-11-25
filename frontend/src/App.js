import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import ProtectedRoute from './components/ProtectedRoute';

// Páginas públicas
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

// Páginas do Cliente
import ClienteDashboard from './pages/cliente/ClienteDashboard';
import ClienteServicos from './pages/cliente/ClienteServicos';
import ClienteAgendamentos from './pages/cliente/ClienteAgendamentos';

// Páginas do Profissional
import ProfissionalDashboard from './pages/profissional/ProfissionalDashboard';
import ProfissionalSolicitacoes from './pages/profissional/ProfissionalSolicitacoes';

// Páginas do Administrador
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSolicitacoes from './pages/admin/AdminSolicitacoes';
import AdminProfissionais from './pages/admin/AdminProfissionais';
import AdminServicos from './pages/admin/AdminServicos';
import AdminCalendario from './pages/admin/AdminCalendario';
import AdminEspecialidades from './pages/admin/AdminEspecialidades'; 
import AdminHistorico from './pages/admin/AdminHistorico'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Rotas do Cliente */}
            <Route
              path="/cliente/dashboard"
              element={
                <ProtectedRoute allowedUserTypes={['cliente']}>
                  <ClienteDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/servicos"
              element={
                <ProtectedRoute allowedUserTypes={['cliente']}>
                  <ClienteServicos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/agendamentos"
              element={
                <ProtectedRoute allowedUserTypes={['cliente']}>
                  <ClienteAgendamentos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/historico"
              element={
                <ProtectedRoute allowedUserTypes={['cliente']}>
                  <ClienteAgendamentos />
                </ProtectedRoute>
              }
            />

            {/* Rotas do Profissional */}
            <Route
              path="/profissional/dashboard"
              element={
                <ProtectedRoute allowedUserTypes={['profissional']}>
                  <ProfissionalDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profissional/agenda"
              element={
                <ProtectedRoute allowedUserTypes={['profissional']}>
                  <ProfissionalDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profissional/solicitacoes"
              element={
                <ProtectedRoute allowedUserTypes={['profissional']}>
                  <ProfissionalSolicitacoes />
                </ProtectedRoute>
              }
            />

            {/* Rotas do Administrador */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedUserTypes={['administrador']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/solicitacoes"
              element={
                <ProtectedRoute allowedUserTypes={['administrador']}>
                  <AdminSolicitacoes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profissionais"
              element={
                <ProtectedRoute allowedUserTypes={['administrador']}>
                  <AdminProfissionais />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/servicos"
              element={
                <ProtectedRoute allowedUserTypes={['administrador']}>
                  <AdminServicos />
                </ProtectedRoute>
              }
            />
            {/* ROTA ADICIONADA */}
            <Route
              path="/admin/especialidades"
              element={
                <ProtectedRoute allowedUserTypes={['administrador']}>
                  <AdminEspecialidades />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/calendario"
              element={
                <ProtectedRoute allowedUserTypes={['administrador']}>
                  <AdminCalendario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/historico"
              element={
                <ProtectedRoute allowedUserTypes={['administrador']}>
                  <AdminHistorico />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;