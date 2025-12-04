import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, userType, logout, isCliente, isProfissional, isAdministrador } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Você saiu da sua conta');
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (isCliente()) return '/cliente/dashboard';
    if (isProfissional()) return '/profissional/dashboard';
    if (isAdministrador()) return '/admin/dashboard';
    return '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to={getDashboardLink()} className="navbar-brand">
          🌸 Rosa Beauty
        </Link>

        <div className="navbar-menu">
          {isCliente() && (
            <>
              <Link to="/cliente/dashboard" className="navbar-link">
                Início
              </Link>
              <Link to="/cliente/servicos" className="navbar-link">
                Serviços
              </Link>
              <Link to="/cliente/agendamentos" className="navbar-link">
                Meus Agendamentos
              </Link>
            </>
          )}

          {isProfissional() && (
            <>
              <Link to="/profissional/dashboard" className="navbar-link">
                Início
              </Link>
              <Link to="/profissional/agenda" className="navbar-link">
                Minha Agenda
              </Link>
              <Link to="/profissional/solicitacoes" className="navbar-link">
                Solicitações
              </Link>
            </>
          )}

          {isAdministrador() && (
            <>
              <Link to="/admin/dashboard" className="navbar-link">
                Início
              </Link>
              <Link to="/admin/calendario" className="navbar-link">
                Calendário
              </Link>
              <Link to="/admin/profissionais" className="navbar-link">
                Profissionais
              </Link>
              <Link to="/admin/servicos" className="navbar-link">
                Serviços
              </Link>
              {/* LINK ADICIONADO */}
              <Link to="/admin/especialidades" className="navbar-link">
                Especialidades
              </Link>
              <Link to="/admin/solicitacoes" className="navbar-link">
                Solicitações
              </Link>
              <Link to="/admin/historico" className="navbar-link">
                Histórico
              </Link>
            </>
          )}

          <div className="navbar-user">
            <span className="navbar-username">{user?.nome}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;