<script lang="ts" setup>

import {onMounted, ref} from "vue";
import type {PaginatedAppointment, PaginatedAvailability} from "../../types";
import {doctorService} from "../../services/doctor.service.ts";
import AppointmentOfDayComponent from "./AppointmentOfDayComponent.vue";
import TheAvailabilityList from "./TheAvailabilityList.vue";
import TheQuickActions from "./TheQuickActions.vue";
import TheWeeklyCalendar from "./TheWeeklyCalendar.vue";

const error = ref('')

// Rendez-vous du jour
const currentDayAppointments = ref<PaginatedAppointment|null>(null)
const currentDayAppointmentHours = ref<string[]>([])

// Disponibilités actuelles
const currentAndNextDayAvailability = ref<PaginatedAvailability|null>(null)
const weekAvailability = ref<PaginatedAvailability|null>(null)
const weekAppointment = ref<PaginatedAvailability|null>(null)


const loadCurrentDayAppointments = async (page: number = 1) => {
    try {
        currentDayAppointments.value = await doctorService.getDoctorCurrentDayAppointments(page)
        if (currentDayAppointments.value?.data) {
            currentDayAppointmentHours.value = await doctorService.getTodayDoctorAppointmentsHourly()
        }
    } catch (e) {
        error.value = 'Erreur lors du chargement des rendez-vous'
    }
}

async function loadCurrentAndNextDayAvailability() {
    try {
        currentAndNextDayAvailability.value = await doctorService.getDoctorCurrentAndNextDayAvailability()
    } catch (e) {
        error.value = 'Erreur lors du chargement des disponibilités'
    }
}

async function loadWeekAvailability() {
    try {
        weekAvailability.value! = await doctorService.getDoctorWeekAvailability()
    } catch (e) {
        error.value = 'Erreur lors du chargement des disponibilités'
    }
}

async function loadWeekAppointment() {
    try {
        weekAppointment.value = await doctorService.getDoctorWeekAppointment()
    } catch (e) {
        error.value = 'Erreur lors du chargement des disponibilités'
    }
}

onMounted(async () => {
    try {
        await Promise.all([
            loadCurrentDayAppointments(),
            loadCurrentAndNextDayAvailability(),
            loadWeekAvailability(),
            loadWeekAppointment()
        ]);
    } catch (e) {
        error.value = "Erreur lors du chargement des données";
    }
})
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- gauche -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Rendez-vous du jour-->
            <AppointmentOfDayComponent
                v-if="currentDayAppointments"
                :appointments="currentDayAppointments"
                @next-appointment="loadCurrentDayAppointments($event)"
            />
            <!-- Gérer mes disponibilités -->
            <TheWeeklyCalendar
                v-if="weekAvailability"
                :week-availability="weekAvailability"
                :week-appointment="weekAppointment || []"
            />
        </div>

        <!-- droite -->
        <div class="space-y-6">
            <!-- Disponibilités actuelles -->
            <TheAvailabilityList
                :availabilities="currentAndNextDayAvailability"
                :appointment-hours="currentDayAppointmentHours"
            />
            <!-- Action Rapide -->
            <TheQuickActions />
        </div>

    </div>
</template>

<style scoped>

</style>

