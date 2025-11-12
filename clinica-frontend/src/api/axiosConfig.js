import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {

    const userItem = localStorage.getItem('user');
    if (userItem && userItem !== "null") {
      const user = JSON.parse(userItem);
      if (user.idUsuario) {
        config.headers['X-User-Id'] = user.idUsuario;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {

    return Promise.reject(error);
  }
);

export default api;
