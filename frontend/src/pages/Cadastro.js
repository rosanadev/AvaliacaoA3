import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { clienteAPI } from '../services/api';
import { toast } from 'react-toastify';

const Cadastro = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    data_nascimento: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cep: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cpf') {
      value = value.replace(/\D/g, '').slice(0, 11);
    } else if (name === 'telefone') {
      value = value.replace(/\D/g, '').slice(0, 11);
    } else if (name === 'cep') {
      value = value.replace(/\D/g, '').slice(0, 8);
    } else if (name === 'estado') {
      value = value.toUpperCase().slice(0, 2);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem');
      return false;
    }

    if (formData.cpf.length !== 11) {
      toast.error('CPF deve conter 11 dígitos');
      return false;
    }

    if (formData.telefone.length < 10 || formData.telefone.length > 11) {
      toast.error('Telefone inválido');
      return false;
    }

    if (formData.cep.length !== 8) {
      toast.error('CEP deve conter 8 dígitos');
      return false;
    }

    if (formData.estado.length !== 2) {
      toast.error('Estado deve conter 2 letras (UF)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmarSenha, ...clienteData } = formData;
      
      const response = await clienteAPI.cadastrar(clienteData);

      if (response.status === 201) {
        toast.success('Cadastro realizado com sucesso!');
        navigate('/login');
      }
    } catch (error) {
      if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
          Object.values(errors).forEach(msg => toast.error(msg));
        } else {
          toast.error('Erro ao cadastrar. Verifique os dados e tente novamente.');
        }
      } else {
        toast.error('Erro ao cadastrar. Tente novamente.');
      }
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '700px' }}>
        <div className="auth-header">
          <h1 className="auth-title">Rosa Beauty</h1>
          <p className="auth-subtitle">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome Completo *</label>
              <input
                type="text"
                name="nome"
                className="form-control"
                value={formData.nome}
                onChange={handleChange}
                required
                minLength="3"
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label className="form-label">CPF *</label>
              <input
                type="text"
                name="cpf"
                className="form-control"
                value={formData.cpf}
                onChange={handleChange}
                required
                placeholder="00000000000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Data de Nascimento *</label>
              <input
                type="date"
                name="data_nascimento"
                className="form-control"
                value={formData.data_nascimento}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telefone *</label>
              <input
                type="text"
                name="telefone"
                className="form-control"
                value={formData.telefone}
                onChange={handleChange}
                required
                placeholder="00000000000"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength="100"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Senha *</label>
              <input
                type="password"
                name="senha"
                className="form-control"
                value={formData.senha}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Senha *</label>
              <input
                type="password"
                name="confirmarSenha"
                className="form-control"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">CEP *</label>
              <input
                type="text"
                name="cep"
                className="form-control"
                value={formData.cep}
                onChange={handleChange}
                required
                placeholder="00000000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bairro *</label>
              <input
                type="text"
                name="bairro"
                className="form-control"
                value={formData.bairro}
                onChange={handleChange}
                required
                maxLength="100"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cidade *</label>
              <input
                type="text"
                name="cidade"
                className="form-control"
                value={formData.cidade}
                onChange={handleChange}
                required
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estado (UF) *</label>
              <input
                type="text"
                name="estado"
                className="form-control"
                value={formData.estado}
                onChange={handleChange}
                required
                placeholder="BA"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Complemento</label>
            <input
              type="text"
              name="complemento"
              className="form-control"
              value={formData.complemento}
              onChange={handleChange}
              maxLength="255"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="text-center mt-2">
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className="auth-link">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;