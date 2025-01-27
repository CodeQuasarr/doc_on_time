<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { doctorService } from '../services/doctor.service'
import { appointmentService } from '../services/appointment.service'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Doctor } from '../types'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const doctors = ref<Doctor[]>([])
const selectedDoctor = ref<Doctor | null>(null)
const selectedDate = ref<Date | null>(null)
const selectedSlot = ref<string | null>(null)
const specialityFilter = ref('')
const locationFilter = ref('')

const filteredDoctors = computed(() => {
    let filtered = doctors.value
    if (specialityFilter.value) {
        filtered = filtered.filter(d => d.speciality.toLowerCase().includes(specialityFilter.value.toLowerCase()))
    }
    if (locationFilter.value) {
        filtered = filtered.filter(d => d.location.toLowerCase().includes(locationFilter.value.toLowerCase()))
    }
    return filtered
})

async function loadDoctors() {
    try {
        loading.value = true
        doctors.value = await doctorService.getAllDoctors()
    } catch (e) {
        error.value = 'Erreur lors du chargement des médecins'
    } finally {
        loading.value = false
    }
}

async function handleDoctorSelect(doctor: Doctor) {
    selectedDoctor.value = doctor
    selectedDate.value = null
    selectedSlot.value = null
}

async function handleDateSelect(date: Date) {
    if (!selectedDoctor.value) return

    try {
        loading.value = true
        const availabilities = await doctorService.getDoctorAvailabilities(selectedDoctor.value.id, date)
        selectedDoctor.value = {
            ...selectedDoctor.value,
            availabilities: availabilities
        }
        selectedDate.value = date
        selectedSlot.value = null
    } catch (e) {
        error.value = 'Erreur lors du chargement des disponibilités'
    } finally {
        loading.value = false
    }
}

async function handleBooking() {
    if (!selectedDoctor.value || !selectedDate.value || !selectedSlot.value) return

    try {
        loading.value = true
        await appointmentService.createAppointment({
            doctorId: selectedDoctor.value.id,
            date: new Date(`${format(selectedDate.value, 'yyyy-MM-dd')}T${selectedSlot.value}`),
            type: 'consultation'
        })
        router.push('/dashboard')
    } catch (e) {
        error.value = 'Erreur lors de la prise de rendez-vous'
    } finally {
        loading.value = false
    }
}

loadDoctors()
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white shadow sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h2 class="text-2xl font-bold text-gray-900">
                    Prendre un rendez-vous
                </h2>
            </div>

            <div class="px-4 py-5 sm:p-6">
                <!-- Filtres -->
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
                    <div>
                        <label for="speciality" class="block text-sm font-medium text-gray-700">Spécialité</label>
                        <input
                            type="text"
                            id="speciality"
                            v-model="specialityFilter"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            placeholder="Rechercher une spécialité"
                        />
                    </div>
                    <div>
                        <label for="location" class="block text-sm font-medium text-gray-700">Localisation</label>
                        <input
                            type="text"
                            id="location"
                            v-model="locationFilter"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            placeholder="Rechercher une ville"
                        />
                    </div>
                </div>

                <div v-if="error" class="mb-4 text-red-500">
                    {{ error }}
                </div>

                <!-- Liste des médecins -->
                <div v-if="loading" class="text-center py-4">
                    Chargement...
                </div>

                <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="doctor in filteredDoctors"
                        :key="doctor.id"
                        class="border rounded-lg p-4 cursor-pointer hover:border-primary-500"
                        :class="{ 'border-primary-500': selectedDoctor?.id === doctor.id }"
                        @click="handleDoctorSelect(doctor)"
                    >
                        <h3 class="font-semibold">Dr. {{ doctor.lastName }}</h3>
                        <p class="text-sm text-gray-500">{{ doctor.speciality }}</p>
                        <p class="text-sm text-gray-500">{{ doctor.location }}</p>
                    </div>
                </div>

                <!-- Sélection de la date et de l'heure -->
                <div v-if="selectedDoctor" class="mt-8">
                    <h3 class="text-lg font-semibold mb-4">Choisir une date</h3>
                    <VueDatePicker
                        v-model="selectedDate"
                        :locale="fr"
                        :min-date="new Date()"
                        @update:model-value="handleDateSelect"
                        class="mb-4"
                    />

                    <div v-if="selectedDate && selectedDoctor.availabilities">
                        <h3 class="text-lg font-semibold mb-4">Créneaux disponibles</h3>
                        <div class="grid grid-cols-4 gap-2">
                            <button
                                v-for="slot in selectedDoctor.availabilities[0].slots"
                                :key="slot"
                                @click="selectedSlot = slot"
                                class="px-4 py-2 text-sm rounded-md"
                                :class="{
                  'bg-primary-600 text-white': selectedSlot === slot,
                  'bg-gray-100 hover:bg-gray-200': selectedSlot !== slot
                }"
                            >
                                {{ slot }}
                            </button>
                        </div>
                    </div>

                    <button
                        v-if="selectedSlot"
                        @click="handleBooking"
                        :disabled="loading"
                        class="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
                    >
                        {{ loading ? 'Confirmation en cours...' : 'Confirmer le rendez-vous' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
