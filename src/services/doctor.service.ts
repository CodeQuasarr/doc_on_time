import api from './api'
import type { Doctor, Availability } from '../types'

export const doctorService = {
    async getAllDoctors(filters?: { speciality?: string; location?: string }) {
        const { data } = await api.get<Doctor[]>('/doctors', { params: filters })
        return data
    },

    async getDoctorAvailabilities(doctorId: string, date: Date) {
        const { data } = await api.get<Doctor['availabilities']>(`/availabilities`, {
            params: { date: date.toISOString() }
        })
        return data
    },

    async updateAvailabilities(availabilities: Availability, availabilityId: number) {

        const date = new Date(availabilities.date);

// Extraire l'année, le mois et le jour
        const formattedDate = date.toISOString().split('T')[0];

        const { data } = await api.post(`/availabilities?id=${availabilityId}`, {
            date: formattedDate,
            slots: availabilities.slots
        })
        return data
    },

    async getDoctorAppointments() {
        const { data } = await api.get('/appointments')
        return data
    }
}
