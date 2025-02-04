import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {appointmentService} from "../services/appointment.service.ts";
import api from "../services/api.ts";

vi.mock('./api') // Mock des appels API

describe('appointmentService', () => {
    beforeEach(() => {
        vi.clearAllMocks() // Nettoyer tous les mocks avant chaque test
    })

    describe('getUserAppointments', () => {
        it('should fetch a paginated list of user appointments', async () => {
            // Mock de la réponse de l'API
            const mockResponse = {
                    results: [
                        { id: '1', doctorName: 'Dr. Smith', date: '2023-11-01', type: 'consultation' },
                        { id: '2', doctorName: 'Dr. Johnson', date: '2023-11-02', type: 'follow-up' }
                    ],
                    total: 2,
                    page: 1,
                    pageSize: 10
                };
            vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockResponse })

            // Appel de la méthode à tester
            const result = await appointmentService.getUserAppointments()

            // Vérifications
            expect(api.get).toHaveBeenCalledWith('/appointments')
            expect(result).toEqual(mockResponse)
        })
    })

    describe('cancelAppointment', () => {
        it('should throw an error if the API fails to cancel an appointment', async () => {
            const errorMessage = 'Failed to cancel the appointment';
            vi.spyOn(api, 'patch').mockRejectedValueOnce(new Error(errorMessage))

            const appointmentId = '1'

            await expect(appointmentService.cancelAppointment(appointmentId)).rejects.toThrow(errorMessage)

            // Vérification que l'API a été appelée
            expect(api.patch).toHaveBeenCalledWith(`/appointments/${appointmentId}/cancel`)
        })
    })

    afterEach(() => {
        vi.clearAllMocks() // Nettoyer les mocks après chaque test
    })
})
