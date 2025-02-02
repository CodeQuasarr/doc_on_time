import api from './api'
import type {Appointment, PaginatedAppointment} from '../types'

/**
 * Service object for managing user appointments.
 * Provides methods for retrieving user appointments, creating new appointments,
 * and canceling existing appointments.
 */
export const appointmentService = {

    /**
     * Fetches a paginated list of user appointments from the API.
     *
     * @return {Promise<PaginatedAppointment>} A promise that resolves with the paginated appointment data.
     */
    async getUserAppointments() {
        const { data } = await api.get<PaginatedAppointment>('/appointments')
        return data
    },

    /**
     * Creates a new appointment by sending the appointment details to the server.
     *
     * @param {Object} appointment - The details of the appointment to be created.
     * @param {string} appointment.doctorId - The ID of the doctor for the appointment.
     * @param {Date} appointment.date - The date and time of the appointment.
     * @param {string} appointment.type - The type of the appointment (e.g., consultation, follow-up).
     * @return {Promise<Appointment>} A promise that resolves to the created appointment object.
     */
    async createAppointment(appointment: { doctorId: string; date: Date; type: string }) {
        const { data } = await api.post<Appointment>('/appointments', appointment)
        return data
    },

    /**
     * Cancels an appointment by its ID.
     *
     * @param appointmentId - The unique identifier of the appointment to cancel.
     * @returns The updated appointment object after cancellation.
     * @throws Will throw an error if the API request fails.
     */
    async cancelAppointment(appointmentId: string) {
        const {data} = await api.patch<Appointment>(`/appointments/${appointmentId}/cancel`)
        return data
    }
}
