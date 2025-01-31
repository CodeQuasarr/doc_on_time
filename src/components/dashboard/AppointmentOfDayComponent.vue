<script setup lang="ts">

import type {PaginatedAppointment} from "../../types";
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {VueAwesomePaginate} from "vue-awesome-paginate";
import {ref} from "vue";
import {ClockIcon} from '@heroicons/vue/24/outline'

defineProps<{
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
    <div>
        <div class="space-y-6">
            <div v-if="appointments?.data?.length"
                 v-for="appointment in appointments?.data"
                 :key="'appointment_' + appointment.id"
                 class="flex items-center gap-4 p-3 rounded-lg hover:bg-[#f3f4f1] transition-colors"
            >
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-[#edfbea] flex items-center justify-center">
                    <ClockIcon class="w-6 h-6 text-[#299020]" />
                </div>
                <div>
                    <p class="font-medium text-[#3c3f35]">{{ appointment.patient.first_name }} {{ appointment.patient.last_name }}</p>
                    <p class="text-sm text-[#929982]">{{ appointment.patient.phone }}</p>
                    <p class="text-sm text-[#929982]">{{ formatDate(appointment.date) }} - {{ appointment.type }}</p>
<!--                    <div class="mt-4">-->
<!--                        <button-->
<!--                            @click="emit('open-consultation-notes', appointment)"-->
<!--                            class="inline-flex items-center px-3 py-2 border border-primary-300 text-sm leading-4 font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"-->
<!--                        >-->
<!--                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />-->
<!--                            </svg>-->
<!--                            Ajouter des notes-->
<!--                        </button>-->
<!--                    </div>-->
                </div>
            </div>
        </div>

        <div class="mt-4 flex items-center justify-center p-2">
            <vue-awesome-paginate
                v-if="appointments && appointments.maxPage > 1"
                :total-items="appointments.total"
                :items-per-page="appointments.maxPage"
                :max-pages-shown="5"
                v-model="currentPage"
                @click="onClickHandler"

                backButtonClass="h-9 w-9 bg-[#edfbea] hover:bg-[#f3f4f1] text-gray-900 rounded-lg"
                nextButtonClass="h-9 w-9 bg-[#edfbea] hover:bg-[#f3f4f1] rounded-lg"
                activePageClass="h-9 w-9 bg-[#f3f4f1] rounded-lg"
                numberButtonsClass="h-9 w-9 mx-2 hover:bg-[#f3f4f1] px-3 py-2 rounded-lg"
                firstButtonClass="h-9 w-9 mx-2 hover:bg-[#f3f4f1] px-3 py-2 rounded-lg"
                lastButtonClass="h-9 w-9 mx-2 hover:bg-[#f3f4f1] px-3 py-2 rounded-lg"
            />
        </div>
    </div>
</template>

<style scoped>

</style>
