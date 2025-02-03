import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {doctorService} from "../services/doctor.service.ts";
import api from "../services/api.ts";

// Mock l'API
vi.mock('./api')

describe('doctorService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllDoctors', () => {
        it('should fetch a list of doctors with filters', async () => {
            const mockResponse = [{ id: 1, name: 'Dr. Smith' }, { id: 2, name: 'Dr. Johnson' }];

            vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockResponse });

            const filters = { speciality: 'Cardiology', location: 'Paris' };
            const result = await doctorService.getAllDoctors(filters);

            expect(api.get).toHaveBeenCalledWith('/doctors', { params: filters });
            expect(result).toEqual(mockResponse);
        });

        it('should fetch all doctors without filters', async () => {
            const mockResponse = [{ id: 1, name: 'Dr. Smith' }];
            vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockResponse });

            const result = await doctorService.getAllDoctors();

            expect(api.get).toHaveBeenCalledWith('/doctors', { params: undefined });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getDoctorAvailabilities', () => {
        it('should fetch availabilities for the given date and page', async () => {
            const mockResponse = [{ id: 3, date: '2023-10-01', slots: ['09:00', '10:00'] }];
            vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockResponse });

            const date = '2023-10-01';
            const currentPage = 2;
            const result = await doctorService.getDoctorAvailabilities(date, currentPage);

            expect(api.get).toHaveBeenCalledWith('/availabilities/week', {
                params: { date, page: currentPage },
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getDoctorCurrentAndNextDayAvailability', () => {
        it('should fetch availabilities for the current and next day', async () => {
            const mockResponse = [{ id: 5, date: '2023-10-01', slots: ['09:00', '10:00'] }];
            vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockResponse });

            const result = await doctorService.getDoctorCurrentAndNextDayAvailability();

            expect(api.get).toHaveBeenCalledWith('/next-two-days-availabilities');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('updateAvailabilities', () => {
        it('should update doctor availabilities', async () => {
            const mockResponse = { success: true, message: 'Availability updated successfully' };
            vi.spyOn(api, 'put').mockResolvedValueOnce({ data: mockResponse });

            const availabilities = { date: '2023-10-01', slots: ['10:00', '11:00'] };
            const availabilityId = 5;
            const result = await doctorService.updateAvailabilities(availabilities, availabilityId);

            expect(api.put).toHaveBeenCalledWith(`/availabilities/${availabilityId}`, {
                date: availabilities.date,
                slots: availabilities.slots,
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('createAvailabilities', () => {
        it('should create doctor availabilities', async () => {
            const mockResponse = { success: true, message: 'Availability created successfully' };
            vi.spyOn(api, 'post').mockResolvedValueOnce({ data: mockResponse });

            const availabilities = { date: '2023-10-01', slots: ['10:00', '11:00'] };
            const result = await doctorService.createAvailabilities(availabilities);

            expect(api.post).toHaveBeenCalledWith('/availabilities', {
                date: availabilities.date,
                slots: availabilities.slots,
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getDoctorCurrentDayAppointments', () => {
        it('should fetch appointments for the current day', async () => {
            const mockResponse = { results: [{ id: 1, patientName: 'John Doe' }] };
            vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockResponse });

            const currentPage = 1;
            const date = new Date().toISOString().split('T')[0];
            const result = await doctorService.getDoctorCurrentDayAppointments(currentPage);

            expect(api.get).toHaveBeenCalledWith('/appointments', {
                params: { date, page: currentPage },
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getTodayDoctorAppointmentsHourly', () => {
        it('should fetch hourly appointments for the current day', async () => {
            const mockResponse = { hourlyData: [{ hour: '09:00', patientCount: 3 }] };
            vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockResponse });

            const date = new Date().toISOString().split('T')[0];
            const result = await doctorService.getTodayDoctorAppointmentsHourly();

            expect(api.get).toHaveBeenCalledWith('/appointments/hours', {
                params: { date },
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getWeeklyDateAndHourAppointments', () => {
        it('should fetch appointments grouped by date and hour for the week', async () => {
            const mockResponse = { weeklyData: [{ date: '2023-10-01', hours: ['10:00'] }] };
            vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockResponse });

            const result = await doctorService.getWeeklyDateAndHourAppointments();

            expect(api.get).toHaveBeenCalledWith('/appointments/week');
            expect(result).toEqual(mockResponse);
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });
});
