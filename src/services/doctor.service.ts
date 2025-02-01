import api from './api'
import type {Doctor, Availability, PaginatedAvailability} from '../types'

/**
 * An object providing services and API calls for managing doctor data, availability, and appointments.
 *
 * @type {Object}
 * @property {function(filters?: { speciality?: string; location?: string }): Promise<Doctor[]>} getAllDoctors
 * Fetches a list of all doctors with optional filters for speciality and location.
 *
 * @property {function(date: Date, currentPage?: number): Promise<PaginatedAvailability>} getDoctorAvailabilities
 * Fetches the availabilities of doctors for the next two days starting from a given date.
 *
 * @property {function(availabilities: Availability, availabilityId: number): Promise<Object>} updateAvailabilities
 * Updates an existing availability or creates a new one based on the given availability data and identifier.
 *
 * @property {function(currentPage?: number): Promise<Object>} getDoctorAppointments
 * Fetches the list of doctor appointments for the current date, optionally supports pagination.
 *
 * @property {function(): Promise<Object>} getTodayDoctorAppointmentsHourly
 * Retrieves hourly appointment data for doctors for the current day.
 */
export const doctorService = {
    async getAllDoctors(filters?: { speciality?: string; location?: string }) {
        const { data } = await api.get<Doctor[]>('/doctors', { params: filters })
        return data
    },

    /**
     * Fetches the availabilities of doctors for the next two days starting from the provided date.
     *
     * @param {Date} date - The start date from which to fetch doctor's availabilities.
     * @param {number} [currentPage=1] - The current page of the paginated results, defaults to 1.
     * @return {Promise<PaginatedAvailability>} A promise resolving to the paginated availabilities.
     */
    async getDoctorAvailability(date: Date, currentPage: number = 1) {
        const { data } = await api.get<PaginatedAvailability>(`/next-two-days-availabilities`, {
            params: { date: date.toISOString(), page:  currentPage}
        })
        return data
    },

    async getDoctorCurrentAndNextDayAvailability() {
        const { data } = await api.get<PaginatedAvailability>(`/next-two-days-availabilities`)
        return data
    },

    async getDoctorWeekAvailability() {
        const { data } = await api.get<PaginatedAvailability>(`/availabilities/week`)
        return data
    },

    async getDoctorWeekAppointment() {
        const { data } = await api.get<PaginatedAvailability>(`/appointments/week`)
        return data
    },

    /**
     * Updates availability information by creating a new availability or updating an existing one.
     *
     * @param {Availability} availabilities - The availability object containing the date and slots to be updated.
     * @param {number} availabilityId - The unique identifier for the availability to update. If the value is 0, a new availability is created.
     * @return {Promise<Object>} A promise that resolves to the response data from the API after updating or creating the availability.
     */
    async updateAvailabilities(availabilities: Availability, availabilityId: number) {

        const date = new Date(availabilities.date);

        // Extraire l'année, le mois et le jour
        const formattedDate = date.toISOString().split('T')[0];

        if (availabilityId === 0) {
            const { data } = await api.post(`/availabilities`, {
                date: formattedDate,
                slots: availabilities.slots
            })
            return data
        }

        const { data } = await api.put(`/availabilities/${availabilityId}`, {
            date: formattedDate,
            slots: availabilities.slots
        })
        return data
    },

    /**
     * Fetches a list of doctor appointments for the current date.
     *
     * @param {number} [currentPage=1] - The page number for paginated appointment data. Defaults to 1.
     * @return {Promise<Object>} A promise resolving to the data object containing doctor appointments.
     */
    async getDoctorCurrentDayAppointments(currentPage: number = 1) {
        const date = new Date();

        // Extraire l'année, le mois et le jour
        const formattedDate = date.toISOString().split('T')[0];
        const { data } = await api.get('/appointments', {
            params: {date: formattedDate, page:  currentPage}
        })
        return data
    },

    /**
     * Retrieves the hourly doctor appointments for the current day.
     *
     * @return {Promise<Object>} A promise that resolves to an object containing the hourly appointment data for the specified date.
     */
    async getTodayDoctorAppointmentsHourly() {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        const { data } = await api.get(`/appointments/hours`, {
            params: { date: formattedDate }
        })
        return data
    },

    async getWeeklyDateAndHourAppointments() {
        const { data } = await api.get(`/appointments/week`)
        return data
    }
}
