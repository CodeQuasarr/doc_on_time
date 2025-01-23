export interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    phone: string
    role: 'ROLE_ADMIN' | 'ROLE_DOCTOR' | 'ROLE_PATIENT'
}
