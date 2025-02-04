export interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    phone?: string
    roles: string[]
}

export interface LoginCredentials {
    username: string
    password: string
}

// Disponibilité
export interface Appointment {
    id: string
    doctorId: string
    patient: {
        first_name: string
        last_name: string
        phone: string
    }
    date: string
    status: 'En attente' | 'Programmée'
    type: string
    reason?: string
    notes?: string
}

export interface Doctor {
    id: string
    first_name: string
    last_name: string
    speciality: string
    location: string
    availabilities: Availability[]
}


export interface Availability {
    id?: number
    date: string
    slots: string[]
}

export interface PaginatedAvailability {
    data: Availability[];
    total: number;
    page: number;
    maxPage: number;
    pageSize: number;
}
export interface PaginatedAppointment {
    data: Appointment[];
    total: number;
    page: number;
    maxPage: number;
    pageSize: number;
}

export interface TimeSlot {
    time: string;
    day: string;
}

export interface DayInfo {
    short: string;
    full: string;
    date: Date;
}

export interface Schedule {
    id?: number;
    date: string;
    slots: string[];
}
