import api from './api'
import type { Appointment } from '../types'

export const appointmentService = {
    async getUserAppointments() {
        const { data } = await api.get<Appointment[]>('/appointments')
        return data
    },

    async createAppointment(appointment: { doctorId: string; date: Date; type: string }) {
        const { data } = await api.post<Appointment>('/appointments', appointment)
        return data
    },

    async cancelAppointment(appointmentId: string) {
        const { data } = await api.patch<Appointment>(`/appointments/${appointmentId}/cancel`)
        return data
    }
}
