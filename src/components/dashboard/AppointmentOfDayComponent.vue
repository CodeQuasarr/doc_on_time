<script setup lang="ts">

import type {Appointment, PaginatedAppointment} from "../../types";
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {VueAwesomePaginate} from "vue-awesome-paginate";
import {ref} from "vue";

const props = defineProps<{
    appointments: PaginatedAppointment
}>()

const currentPage = ref<number>(1)
const emit = defineEmits(['open-consultation-notes', 'next-appointment'])

function formatDate(date: string) {
    const timestamp: number = Date.parse(date);
    return format(new Date(timestamp), 'PPP à HH:mm', { locale: fr })
}

function getDefaultAvatar(firstName: string, lastName: string) {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
}

function onClickHandler(page: number) {
    emit('next-appointment', page)
}

</script>

<template>
    <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-6">Rendez-vous du jour</h2>
        <div v-if="appointments?.data?.length === 0" class="text-gray-500 text-center py-8">
            Aucun rendez-vous aujourd'hui
        </div>

        <div v-else class="space-y-6">
            <div
                v-for="appointment in appointments.data"
                :key="appointment.id"
                class="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-500 transition-colors duration-200"
            >
                <div class="flex items-start space-x-4">
                    <img
                        :src="getDefaultAvatar(appointment.patient.first_name, appointment.patient.last_name)"
                        :alt="`Photo de ${appointment.patient.first_name}`"
                        class="w-16 h-16 rounded-full object-cover"
                    />
                    <div class="flex-1">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="font-medium text-lg">
                                    {{ appointment.patient.first_name }} {{ appointment.patient.last_name }}
                                </h3>
                                <p class="text-gray-500">{{ appointment.patient.phone }}</p>
                            </div>
                            <span
                                class="px-2 py-1 text-xs rounded-full"
                                :class="{
                                          'bg-green-100 text-green-800': appointment.status === 'confirmed',
                                          'bg-yellow-100 text-yellow-800': appointment.status === 'pending',
                                          'bg-red-100 text-red-800': appointment.status === 'cancelled'
                                        }"
                            >
                    {{ appointment.status }}
                  </span>
                        </div>

                        <div class="mt-2 space-y-2">
                            <p class="flex items-center text-gray-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ formatDate(appointment.date) }}
                            </p>
                            <p class="flex items-center text-gray-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Type: {{ appointment.type }}
                            </p>
                            <p v-if="appointment.reason" class="flex items-center text-gray-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Motif: {{ appointment.reason }}
                            </p>
                        </div>

                        <div class="mt-4">
                            <button
                                @click="emit('open-consultation-notes', appointment)"
                                class="inline-flex items-center px-3 py-2 border border-primary-300 text-sm leading-4 font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Ajouter des notes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-4 flex items-center justify-center p-2">
            <vue-awesome-paginate
                v-if="appointments.maxPage > 1"
                :total-items="appointments.total"
                :items-per-page="appointments.maxPage"
                :max-pages-shown="5"
                v-model="currentPage"
                @click="onClickHandler"

                backButtonClass="h-12 w-12 bg-[#39b52d] hover:bg-[#299020] text-white rounded-lg"
                nextButtonClass="h-12 w-12 bg-[#39b52d] hover:bg-[#299020] text-white rounded-lg"
                activePageClass="h-12 w-12 bg-[#216e1d] hover:bg-[#299020] text-white rounded-lg"
                numberButtonsClass="h-12 w-12 mx-2 hover:bg-[#299020] text-gray-900 px-3 py-2 rounded-lg"
                firstButtonClass="h-12 w-12 mx-2 hover:bg-[#299020] px-3 py-2 rounded-lg"
                lastButtonClass="h-12 w-12 mx-2 hover:bg-[#299020] px-3 py-2 rounded-lg"
            />
        </div>
    </div>
</template>

<style scoped>

</style>
