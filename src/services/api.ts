import axios from 'axios';

/**
 * Axios instance configured for making HTTP requests to the application's API.
 * The base URL is set dynamically based on the `VITE_API_URL` environment variable or defaults to `http://localhost:3000/api`.
 *
 * This instance can be used to send requests to the server with predefined configurations,
 * simplifying the setup required for each request.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

// Intercept the request and add the Authorization header if a token is available
api.interceptors.request.use(config => {
    const token = localStorage.getItem('user-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercept the response and check for a 401 (unauthorized) status code
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Si une erreur arrive
        if (error.response && error.response.status === 401) {
            // Passez le router ici ou utilisez un autre mécanisme pour rediriger
            const router = error.config.router;  // Assurez-vous d'ajouter ce champ dans la configuration d'axios

            // Supprimer tous les éléments stockés dans localStorage
            localStorage.clear();

            // Rediriger vers la page d'accueil
            router.push({ name: "home" });
        }

        return Promise.reject(error);
    }
);

export default api;
