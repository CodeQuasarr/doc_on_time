import api from './api'
import type {Doctor, Availability, PaginatedAvailability} from '../types'

export const doctorService = {
    async getAllDoctors(filters?: { speciality?: string; location?: string }) {
        const { data } = await api.get<Doctor[]>('/doctors', { params: filters })
        return data
    },

    async getDoctorAvailabilities(date: Date, currentPage: number = 1) {
        const { data } = await api.get<PaginatedAvailability>(`/availabilities`, {
            params: { date: date.toISOString(), page:  currentPage}
        })
        return data
    },

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

    async getDoctorAppointments(currentPage: number = 1) {
        const { data } = await api.get('/appointments', {
            params: {page:  currentPage}
        })
        return data
    }
}
