export interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    phone?: string
    role: string[]
}

// Disponibilité
export interface Appointment {
    id: string
    doctorId: string
    patient_id: {
        first_name: string
        last_name: string
        phone: string
    }
    date: string
    status: 'pending' | 'confirmed' | 'cancelled'
    type: string
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
    date: Date
    slots: string[]
}
