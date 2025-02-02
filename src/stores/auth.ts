import { defineStore } from 'pinia'
import type {User} from "../types";

/**
 * `useAuthStore` is a Pinia store used for managing authentication-related state and actions
 * in the application. The store tracks the user's information, authentication token,
 * and includes operations to update or clear these values. The state is persisted to support
 * maintaining relevant data across application sessions.
 *
 * Store Features:
 * - State:
 *   - `user`: Represents the current authenticated user, or `null` if no user is logged in.
 *   - `token`: Represents the authentication token, or `null` if no token is available.
 * - Actions:
 *   - `setUser(user: User | null)`: Updates the `user` state and synchronizes the user's roles in local storage.
 *   - `setToken(newToken: string | null)`: Updates the `token` state and synchronizes it with local storage.
 *   - `logout()`: Clears user and token data, effectively logging the user out.
 */
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: null as string | null
    }),

    actions: {

        /**
         * Sets the current user and updates the user's roles in local storage.
         * If the user is not provided, it removes the stored roles from local storage.
         *
         * @param {User|null} user - The user object containing roles or null to unset the current user.
         * @return {void}
         */
        setUser(user: User | null) {
            this.user = user
            if (user) {
                localStorage.setItem('user-roles', JSON.stringify(user.roles))
            } else {
                localStorage.removeItem('user-roles')
            }
        },

        /**
         * Updates the stored token value and synchronizes it with local storage.
         * If a new token is provided, it saves the token to local storage.
         * If the value is null, it removes the token from local storage.
         *
         * @param {string|null} newToken The new token to be set, or null to remove the token.
         * @return {void} Does not return any value.
         */
        setToken(newToken: string | null) {
            this.token = newToken
            if (newToken) {
                localStorage.setItem('user-token', newToken)
            }  else {
                localStorage.removeItem('user-token')
            }
        },

        /**
         * Logs the user out by clearing the user data and authentication token.
         *
         * @return {void} Does not return a value.
         */
        logout() {
            this.setUser(null)
            this.setToken(null)
        }
    },
    persist: true
})
