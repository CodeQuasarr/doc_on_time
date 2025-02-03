<script lang="ts" setup>

import {onMounted, ref} from "vue";
import type {PaginatedAppointment, Schedule} from "../../types";
import {doctorService} from "../../services/doctor.service.ts";
import AppointmentOfDayComponent from "./AppointmentOfDayComponent.vue";
import TheAvailabilityList from "./TheAvailabilityList.vue";
import TheWeeklyCalendar from "./TheWeeklyCalendar.vue";
import {handleApiCall} from "../../utils/apiHandler.ts";

const error = ref('')

// Rendez-vous du jour
const currentDayAppointments = ref<PaginatedAppointment|null>(null)
const currentDayAppointmentHours = ref<string[]>([])
const currentAndNextDayAvailability = ref<Schedule[]|null>(null)
const weekAvailability = ref<Schedule[]|null>(null)
const weekAppointment = ref<Schedule[]|null>(null)


const loadCurrentDayAppointments = async (page: number = 1) => {
    await handleApiCall(
        async () => {
            currentDayAppointments.value = await doctorService.getDoctorCurrentDayAppointments(page);
            if (currentDayAppointments.value?.data) {
                currentDayAppointmentHours.value = await doctorService.getTodayDoctorAppointmentsHourly();
            }
        },
        error,
        "Erreur lors du chargement des rendez-vous"
    );
}

const loadCurrentAndNextDayAvailability = async () => {
    await handleApiCall(
        async () => {
            currentAndNextDayAvailability.value = await doctorService.getDoctorCurrentAndNextDayAvailability();
        },
        error,
        "Erreur lors du chargement des disponibilités"
    );
}

const loadWeekAvailability = async () => {
    await handleApiCall(
        async () => {
            weekAvailability.value = await doctorService.getDoctorWeekAvailability(new Date().toString());
        },
        error,
        "Erreur lors du chargement des disponibilités"
    );
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

const availabilityWasUpdated = (newAvailability: Schedule) => {
    if (newAvailability.date === currentAndNextDayAvailability.value![0].date) {
        currentAndNextDayAvailability.value![0].slots = newAvailability.slots
    } else {
        currentAndNextDayAvailability.value![1].slots = newAvailability.slots
    }
}

onMounted(async () => {
    await handleApiCall(
        async () => {
            await Promise.all([
                loadCurrentDayAppointments(),
                loadCurrentAndNextDayAvailability(),
                loadWeekAvailability(),
                loadWeekAppointment()
            ]);
        },
        error,
        "Erreur lors du chargement des données"
    );
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
                @availability-was-updated="availabilityWasUpdated($event)"
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
<!--            <TheQuickActions />-->
        </div>

    </div>
</template>

<style scoped>

</style>

