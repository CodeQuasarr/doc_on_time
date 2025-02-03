<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {doctorService} from '../services/doctor.service'
import type {Availability, Schedule} from '../types'
import VueDatePicker from '@vuepic/vue-datepicker'
import {addDays, format, isSameDay, parseISO, startOfWeek} from 'date-fns'
import {fr} from 'date-fns/locale'
import AuthTemplate from "../layouts/AuthTemplate.vue";
import {BellAlertIcon} from "@heroicons/vue/24/outline";
import {handleApiCall} from "../utils/apiHandler.ts";
import {reWriteDate} from "../utils/formateDate.ts";

const availabilities = ref<Availability[]>([])
const selectedWeek = ref(new Date())
const loading = ref(false)
const error = ref('')

const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
]
const weekAppointment = ref<Schedule[]|null>(null)

onMounted(async () => {

    await handleApiCall(
        async () => {
            await Promise.all([
                loadWeekAppointment(),
                loadAvailabilities()
            ]);
        },
        error,
        "Erreur lors du chargement des données"
    );
})

async function loadAvailabilities() {
    try {
        loading.value = true
        let currentDate = new Date()
        if (Array.isArray(selectedWeek.value)) {
            currentDate = selectedWeek.value[0]
        }
        availabilities.value = await doctorService.getDoctorWeekAvailability(currentDate)
    } catch (e) {
        error.value = 'Erreur lors du chargement des disponibilités'
    } finally {
        loading.value = false
    }
}

function getWeekDays() {
    let currentDate = new Date()
    if (Array.isArray(selectedWeek.value)) {
        currentDate = selectedWeek.value[0]
    }
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    return Array.from({ length: 5 }, (_, i) => addDays(start, i))
}

function isSlotAvailable(date: Date, slot: string) {
    return availabilities.value.some(a =>
        isSameDay(parseISO(a.date.toString()), date) &&
        a.slots.includes(slot)
    )
}

async function toggleSlot(date: Date, slot: string) {
    const dateStr = format(date, 'yyyy-MM-dd')
    const availability = availabilities.value.find(a =>
        isSameDay(parseISO(a.date.toString()), date)
    )

    let updatedAvailabilities: Availability[]

    if (availability) {
        // Mettre à jour les créneaux existants
        if (availability.slots.includes(slot)) {
            availability.slots = availability.slots.filter(s => s !== slot)
        } else {
            availability.slots = [...availability.slots, slot].sort()
        }
        updatedAvailabilities = [...availabilities.value]
    } else {
        // Créer une nouvelle disponibilité
        updatedAvailabilities = [
            ...availabilities.value,
            { date: new Date(dateStr), slots: [slot] }
        ]
    }

    try {
        if (availability?.id) {
            await doctorService.updateAvailabilities(availability, availability.id)
        } else {
            await doctorService.createAvailabilities(availability)
        }
        availabilities.value = updatedAvailabilities
    } catch (e) {
        error.value = 'Erreur lors de la mise à jour des disponibilités'
    }
}

function formatDate(date: Date) {
    return format(date, 'EEEE d MMMM', { locale: fr })
}

const loadWeekAppointment = async () => {
    await handleApiCall(
        async () => {
            weekAppointment.value = await doctorService.getDoctorWeekAppointment();
        },
        error,
        "Erreur lors du chargement des disponibilités"
    );
}
</script>

<template>
    <AuthTemplate>
        <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900">Gestion des disponibilités</h1>
                <VueDatePicker
                    v-model="selectedWeek"
                    :locale="'fr'"
                    :min-date="new Date()"
                    week-picker
                    auto-apply
                    @update:model-value="loadAvailabilities"
                />
            </div>

            <div v-if="error" class="mb-4 text-red-500">
                {{ error }}
            </div>

            <div v-if="loading" class="text-center py-4">
                Chargement...
            </div>

            <div v-else class="grid grid-cols-6 gap-4">
                <!-- En-têtes des colonnes -->
                <div class="col-span-1"></div>
                <div
                    v-for="day in getWeekDays()"
                    :key="day.toISOString()"
                    class="text-center font-medium"
                >
                    {{ formatDate(day) }}
                </div>

                <!-- Grille des créneaux -->
                <template v-for="slot in timeSlots" :key="slot">
                    <!-- Heure -->
                    <div class="text-right pr-4 py-2">
                        {{ slot }}
                    </div>

                    <!-- Créneaux pour chaque jour -->
                    <div
                        v-for="(day, index) in getWeekDays()"
                        :key="`${day.toISOString()}-${slot}`"
                        :class="{
                              'bg-[#299020] text-white ': isSlotAvailable(day, slot),
                              'bg-gray-100 hover:bg-gray-200': !isSlotAvailable(day, slot)
                        }"
                        class="p-2 relative group text-sm rounded text-center transition-colors duration-200"
                    >
                        <button class="w-full h-full cursor-pointer" @click="toggleSlot(day, slot)">
                            <span v-if="isSlotAvailable(day, slot)">Disponible</span>
                            <span v-else>-</span>
                        </button>
                        <div
                            v-if="weekAppointment && weekAppointment[index] && weekAppointment[index].date === reWriteDate(day) && weekAppointment[index].slots.includes(slot)"
                            class="font-bold bg-[#d7f6d1]/60 absolute right-0 top-0 border border-white w-full h-full flex items-center justify-center gap-1">
                            <BellAlertIcon class="w-8 h-8 text-green-500" />
                            Rendez-vous
                        </div>
                    </div>

                </template>
            </div>

            <div class="mt-6">
                <h2 class="text-lg font-medium mb-4">Légende</h2>
                <div class="flex space-x-4">
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#299020] rounded mr-2"></div>
                        <span>Créneau disponible</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#d7f6d1]/60 rounded mr-2"></div>
                        <span>Rendez-vous avec 1 patient</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-gray-100 rounded mr-2"></div>
                        <span>Créneau non disponible</span>
                    </div>
                </div>
            </div>
        </div>
    </AuthTemplate>
</template>
