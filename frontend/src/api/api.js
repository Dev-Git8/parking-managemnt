import axios from 'axios';

const API_URLs = {
    development: 'http://localhost:5000/api',
    production: '/api'
};

const api = axios.create({
    baseURL: API_URLs[import.meta.env.MODE] || API_URLs.development,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor to add Access Token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor to handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post(
                    `${API_URLs[import.meta.env.MODE] || API_URLs.development}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                
                localStorage.setItem('accessToken', data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
