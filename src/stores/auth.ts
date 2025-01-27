import { defineStore } from 'pinia'
import type {User} from "../types";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: null as string | null
    }),

    actions: {
        setUser(user: User | null) {
            this.user = user
            if (user) {
                localStorage.setItem('user-roles', JSON.stringify(user.roles))
            } else {
                localStorage.removeItem('user-roles')
            }
        },

        setToken(newToken: string | null) {
            this.token = newToken
            if (newToken) {
                localStorage.setItem('user-token', newToken)
            }  else {
                localStorage.removeItem('user-token')
            }
        },

        logout() {
            this.setUser(null)
            this.setToken(null)
        }
    },
    persist: true
})
