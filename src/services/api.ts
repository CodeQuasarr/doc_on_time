import axios from 'axios'
import {useRouter} from "vue-router";

const router = useRouter()

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('user-token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Ajouter un intercepteur pour les réponses
api.interceptors.response.use(
    (response) => {
        // Si la réponse est OK, on la retourne simplement
        return response;
    },
    (error) => {
        // Si une erreur arrive
        if (error.response && error.response.status === 401) {
            const router = useRouter();

            // Supprimer tous les éléments stockés dans localStorage
            localStorage.clear();

            // Rediriger vers la page d'accueil
            router.push({ name: "home" }); // Assurez-vous d'utiliser un nom de route valide
        }

        // Rejeter l'erreur pour laisser le flux d'erreur habituel gérer le reste
        return Promise.reject(error);
    }
);

export default api
