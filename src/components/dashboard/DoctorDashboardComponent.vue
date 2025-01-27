<script lang="ts" setup>

import {onMounted, ref} from "vue";
import type {Appointment, Availability} from "../../types";
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {doctorService} from "../../services/doctor.service.ts";
import AppointmentOfDayComponent from "./AppointmentOfDayComponent.vue";

const appointments = ref<Appointment[]>([])
const selectedAppointment = ref<Appointment | null>(null)
const consultationNotes = ref('')
const availabilities = ref<Availability[]>([])
const newAvailability = ref<Availability>({
    date: new Date(),
    slots: []
})
const loading = ref(true)
const error = ref('')

onMounted(async () => {
    await Promise.all([
        loadAppointments(),
        loadAvailabilities()
    ])
})

async function loadAppointments() {
    try {
        appointments.value = await doctorService.getDoctorAppointments()
    } catch (e) {
        error.value = 'Erreur lors du chargement des rendez-vous'
    }
}

async function loadAvailabilities() {
    try {
        availabilities.value = await doctorService.getDoctorAvailabilities('current', new Date())
    } catch (e) {
        error.value = 'Erreur lors du chargement des disponibilités'
    }
}


async function saveConsultationNotes() {
    if (!selectedAppointment.value) return

    try {
        await consultationService.addConsultationNotes(
            selectedAppointment.value.id,
            consultationNotes.value
        )
        selectedAppointment.value = null
        consultationNotes.value = ''
    } catch (e) {
        error.value = 'Erreur lors de l\'enregistrement des notes'
    }
}

async function addAvailability() {
    try {
        await doctorService.updateAvailabilities([...availabilities.value, newAvailability.value])
        availabilities.value.push({...newAvailability.value})
        newAvailability.value = {
            date: new Date(),
            slots: []
        }
    } catch (e) {
        error.value = 'Erreur lors de l\'ajout des disponibilités'
    }
}


function formatDate(date: string) {
    const timestamp: number = Date.parse(date);
    return format(new Date(timestamp), 'PPP à HH:mm', {locale: fr})
}

</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Rendez-vous du jour-->
            <AppointmentOfDayComponent
                :appointments="appointments"
                @open-consultation-notes="selectedAppointment = $event"
            />
            <!-- Gestion des disponibilités -->
            <div class="bg-[#f3f4f1] shadow rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Gérer mes disponibilités</h2>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-[#474c3f]">Date</label>
                        <VueDatePicker
                            v-model="newAvailability.date"
                            :format="'dd-MM-yyyy'"
                            :locale="'fr'"
                            :min-date="new Date()"
                            class="mb-2"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-[#474c3f]">Créneaux</label>
                        <div class="grid grid-cols-4 gap-2">
                            <button
                                v-for="hour in ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']"
                                :key="hour"
                                @click="newAvailability.slots.includes(hour) ? newAvailability.slots = newAvailability.slots.filter(s => s !== hour) : newAvailability.slots.push(hour)"
                                class="px-2 py-1 text-sm rounded"
                                :class="{ 'bg-[#299020] text-white': newAvailability.slots.includes(hour), 'bg-[#e6e7e0]': !newAvailability.slots.includes(hour) }"
                            >
                                {{ hour }}
                            </button>
                        </div>
                    </div>

                    <button
                        @click="addAvailability"
                        class="w-full bg-[#299020] text-white py-2 px-4 rounded-md hover:bg-[#216e1d]"
                    >
                        Ajouter ces disponibilités
                    </button>
                </div>

                <div class="mt-6">
                    <h3 class="font-medium mb-2">Disponibilités actuelles</h3>
                    <div class="space-y-2">
                        <div
                            v-for="(availability, index) in availabilities"
                            :key="index"
                            class="border border-[#39b52d] rounded p-2"
                        >
                            <p class="font-medium">
                                {{ format(new Date(availability.date), 'PPP', { locale: fr }) }}
                            </p>
                            <div class="flex flex-wrap gap-1 mt-1">
                                    <span
                                        v-for="slot in availability.slots"
                                        :key="slot"
                                        class="px-5 py-2 text-md bg-[#e6e7e0] rounded"
                                    >
                                      {{ slot }}
                                    </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal pour les notes de consultation -->
        <div
            v-if="selectedAppointment"
            class="fixed inset-0 bg-[#767d66] bg-opacity-75 flex items-center justify-center"
        >
            <div class="bg-[#f3f4f1] rounded-lg p-6 max-w-lg w-full">
                <h3 class="text-lg font-medium mb-4">
                    Notes de consultation - {{ formatDate(selectedAppointment.date) }}
                </h3>

                <textarea
                    v-model="consultationNotes"
                    class="w-full border border-[#39b52d] rounded-md p-2"
                    placeholder="Saisissez vos notes..."
                    rows="4"
                ></textarea>

                <div class="mt-4 flex justify-end space-x-2">
                    <button
                        class="px-4 py-2 text-[#474c3f] hover:text-[#353730]"
                        @click="selectedAppointment = null"
                    >
                        Annuler
                    </button>
                    <button
                        class="px-4 py-2 bg-[#299020] text-white rounded-md hover:bg-[#216e1d]"
                        @click="saveConsultationNotes"
                    >
                        Enregistrer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>

