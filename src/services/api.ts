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

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
    response => response,
    error => {
        // Si l'erreur est 401 (Unauthorized) ou 403 (Forbidden)
        if (error.response && (error.response.status === 401)) {
            localStorage.clear()
            // On récupère le store d'authentification
            console.error('error', error.response)
            // On déconnecte l'utilisateur
            // authStore.logout()
            // On redirige vers la page de connexion
            router.push('/login')
        }
        return Promise.reject(error)
    }
)

export default api
