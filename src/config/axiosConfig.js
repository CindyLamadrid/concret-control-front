import axios from 'axios';

// Crear instancia de axios
const axiosInstance = axios.create();

// Interceptor para agregar el token a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Si existe el token, agregarlo a los headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
