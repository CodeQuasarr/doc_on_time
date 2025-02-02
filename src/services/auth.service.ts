import api from './api'
import type {LoginCredentials, User} from '../types'


/**
 * A service for handling user authentication, including login and retrieval of user data.
 *
 * This service provides methods to send login credentials to the server, fetch an authentication token,
 * and retrieve user information for authenticated users.
 */
export const authService = {

    /**
     * Performs user login by sending credentials to the server, retrieving an authentication token,
     * and fetching the user's information.
     *
     * @param {LoginCredentials} credentials - The user's login credentials including username and password.
     * @return {Promise<{token: string, user: User}>} A Promise that resolves to an object containing the authentication token and user information.
     */
    async login(credentials: LoginCredentials) {
        const {data} = await api.post<{token: string}>('/login_check', credentials);
        localStorage.setItem('user-token', data.token);
        const token = data.token;

        const userData = await api.get<User>('/me');

        return {
            token: token,
            user: userData.data
        };
    }
}
