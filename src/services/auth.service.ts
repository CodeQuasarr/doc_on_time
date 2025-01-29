import api from './api'
import type {User} from '../types'

export interface LoginCredentials {
    username: string
    password: string
}

export const authService = {
    async login(credentials: LoginCredentials) {
        // Effectuer la requête de connexion pour obtenir le token
        const {data} = await api.post<{token: string}>('/login_check', credentials);
        console.log(data);
        localStorage.setItem('user-token', data.token);
        const token = data.token;

        // Effectuer une requête pour obtenir les informations de l'utilisateur
        const userData = await api.get<User>('/me');
        console.log(userData.data);
        // Retourner un objet contenant à la fois le token et l'utilisateur
        return {
            token: token,
            user: userData.data
        };
    }
}
