import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('user-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Ajouter un intercepteur pour les réponses
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
