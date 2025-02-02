import api from './api'
import type {Doctor, Availability, PaginatedAvailability, Schedule} from '../types'

/**:
 * An object that provides services for fetching and managing doctor-related data from the API.
 *
 * @property {Function} getAllDoctors - Retrieves a list of doctors optionally filtered by speciality or location.
 * @property {Function} getDoctorAvailability - Fetches the availabilities of doctors for the next two days starting from a given date.
 * @property {Function} getDoctorCurrentAndNextDayAvailability - Fetches the current and next day's availability of doctors.
 * @property {Function} getDoctorWeekAvailability - Fetches the weekly availability of doctors.
 * @property {Function} getDoctorWeekAppointment - Fetches the doctor's appointments for the current week.
 * @property {Function} updateAvailabilities - Updates specific availability data through the API.
 * @property {Function} createAvailabilities - Creates new availabilities using the provided data.
 * @property {Function} getDoctorCurrentDayAppointments - Fetches a paginated list of doctor appointments for the current day.
 * @property {Function} getTodayDoctorAppointmentsHourly - Retrieves the hourly appointments data for the current day.
 * @property {Function} getWeeklyDateAndHourAppointments - Fetches weekly appointment data grouped by date and hour.
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

    /**
     * Fetches the current and next day's availability of doctors.
     *
     * This method sends a request to retrieve the schedule availability of doctors
     * for the current day and the next day. The availability data is returned in an
     * array of schedule objects.
     *
     * @return {Promise<Schedule[]>} A promise that resolves to an array of Schedule objects
     *                               representing the doctor's availability for the next two days.
     */
    async getDoctorCurrentAndNextDayAvailability() {
        const { data } = await api.get<Schedule[]>(`/next-two-days-availabilities`)
        return data
    },

    /**
     * Fetches the weekly availability of doctors from the API.
     *
     * @return {Promise<Schedule[]>} A promise that resolves to an array of Schedule objects representing the doctor's weekly availability.
     */
    async getDoctorWeekAvailability() {
        const { data } = await api.get<Schedule[]>(`/availabilities/week`)
        return data
    },

    /**
     * Fetches the doctor's appointments for the current week.
     *
     * @return {Promise<Schedule[]>} A promise that resolves to an array of Schedule objects representing the doctor's appointments for the week.
     */
    async getDoctorWeekAppointment() {
        const { data } = await api.get<Schedule[]>(`/appointments/week`)
        return data
    },

    /**
     * Updates the availabilities for a specific availability ID by sending updated data to the API.
     *
     * @param {Availability} availabilities - An object containing the updated availability data, including date and slots.
     * @param {number} availabilityId - The unique identifier of the availability to update.
     * @return {Promise<Object>} A promise that resolves to the response data from the API after the update operation.
     */
    async updateAvailabilities(availabilities: Availability, availabilityId: number) {

        const { data } = await api.put(`/availabilities/${availabilityId}`, {
            date: availabilities.date,
            slots: availabilities.slots
        })
        return data
    },

    /**
     * Creates new availabilities using the provided availability schedule.
     *
     * @param {Availability} availabilities - An object containing the availability schedule, including the date and time slots.
     * @return {Promise<Object>} A promise that resolves to the response data from the API after successfully creating the availabilities.
     */
    async createAvailabilities(availabilities: Availability) {

        const { data } = await api.post(`/availabilities`, {
            date: availabilities.date,
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
