import api from './api'
import type {User} from '../types'

export interface LoginCredentials {
    email: string
    password: string
}

export const authService = {
    async login(credentials: LoginCredentials) {
        const {data} = await api.post<{ user: User; token: string }>('/login_check', credentials)
        return data
    },
}
