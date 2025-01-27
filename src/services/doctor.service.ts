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

    async updateAvailabilities(availabilities: Availability[]) {
        const { data } = await api.post('/availabilities', { availabilities })
        return data
    },

    async getDoctorAppointments() {
        const { data } = await api.get('/appointments')
        return data
    }
}
