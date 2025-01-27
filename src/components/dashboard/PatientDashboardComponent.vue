<script setup lang="ts">


import {useAuthStore} from "../../stores/auth.ts";
import {onMounted, ref} from "vue";
import type {Appointment} from "../../types";
import {appointmentService} from "../../services/appointment.service.ts";
import {format} from "date-fns";
import {fr} from "date-fns/locale";

const authStore = useAuthStore()
const appointments = ref<Appointment[]>([])
const loading = ref(true)
const error = ref('')

async function handleCancelAppointment(appointmentId: string) {
    try {
        const updatedAppointment = await appointmentService.cancelAppointment(appointmentId)
        appointments.value = appointments.value.map(apt =>
            apt.id === updatedAppointment.id ? updatedAppointment : apt
        )
    } catch (e) {
        error.value = 'Erreur lors de l\'annulation du rendez-vous'
    }
}

function formatDate(date: string) {
    const timestamp: number = Date.parse(date);
    return format(new Date(timestamp), 'PPP à HH:mm', { locale: fr })
}

onMounted(async () => {
    try {
        appointments.value = await appointmentService.getUserAppointments()
    } catch (e) {
        error.value = 'Erreur lors du chargement des rendez-vous'
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h2 class="text-2xl font-bold text-gray-900">
                    Tableau de bord - {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
                </h2>
            </div>

            <div v-if="loading" class="px-4 py-5 sm:p-6 text-center">
                <p>Chargement...</p>
            </div>

            <div v-else-if="error" class="px-4 py-5 sm:p-6 text-center text-red-500">
                {{ error }}
            </div>

            <div v-else class="px-4 py-5 sm:p-6">
                <div v-if="appointments.length === 0" class="text-center text-gray-500">
                    Aucun rendez-vous programmé
                </div>

                <div v-else class="space-y-4">
                    <div
                        v-for="appointment in appointments"
                        :key="appointment.id"
                        class="border border-[#39b52d] rounded-lg p-4 flex justify-between items-center"
                        :class="{
                                  'bg-gray-50': appointment.status === 'cancelled',
                                  'bg-white': appointment.status !== 'cancelled'
                                }"
                    >
                        <div>
                            <p class="font-semibold">
                                {{ formatDate(appointment.date) }}
                            </p>
                            <p class="text-sm text-gray-500">
                                Type: {{ appointment.type }}
                            </p>
                            <p class="text-sm" :class="{
                                'text-green-600': appointment.status === 'confirmed',
                                'text-yellow-600': appointment.status === 'pending',
                                'text-red-600': appointment.status === 'Cancelled'
                              }"
                            >
                                Statut: {{ appointment.status }}
                            </p>
                        </div>

                        <button
                            v-if="appointment.status !== 'cancelled'"
                            @click="handleCancelAppointment(appointment.id)"
                            class="px-4 py-2 text-sm text-red-600 hover:text-red-800"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
