<script lang="ts" setup>

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

const formatDate = (date: string) => {
    const timestamp: number = Date.parse(date);
    return format(new Date(timestamp), 'PPP à HH:mm', {locale: fr})
}

const onClickHandler = (page: number) => {
    emit('next-appointment', page)
}

// function getDefaultAvatar(firstName: string, lastName: string) {
//     return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
// }


</script>

<template>
    <div class="bg-white p-6 rounded-xl shadow-sm">
        dsfdfdsf
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-[#3c3f35]">Aujourd'hui</h2>
            <span class="text-[#39b52d] font-medium">6 rendez-vous</span>
        </div>
        <div class="space-y-6">
            <div v-for="appointment in appointments?.data"
                 v-if="appointments?.data?.length"
                 :key="'appointment_' + appointment.id"
                 class="flex items-center gap-4 p-3 rounded-lg hover:bg-[#f3f4f1] transition-colors"
            >
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-[#edfbea] flex items-center justify-center">
                    <ClockIcon class="w-6 h-6 text-[#299020]"/>
                </div>
                <div>
                    <p class="font-medium text-[#3c3f35]">{{ appointment.patient.first_name }}
                        {{ appointment.patient.last_name }}</p>
                    <p class="text-sm text-[#929982]">{{ appointment.patient.phone }}</p>
                    <p class="text-sm text-[#929982]">{{ formatDate(appointment.date) }} - {{ appointment.type }}</p>
                </div>
            </div>
        </div>

        <div class="mt-4 flex items-center justify-center p-2">
            <vue-awesome-paginate
                v-if="appointments && appointments.maxPage > 1"
                v-model="currentPage"
                :items-per-page="appointments.maxPage"
                :max-pages-shown="5"
                :total-items="appointments.total"
                activePageClass="h-9 w-9 bg-[#f3f4f1] rounded-lg"

                backButtonClass="h-9 w-9 bg-[#edfbea] hover:bg-[#f3f4f1] text-gray-900 rounded-lg"
                firstButtonClass="h-9 w-9 mx-2 hover:bg-[#f3f4f1] px-3 py-2 rounded-lg"
                lastButtonClass="h-9 w-9 mx-2 hover:bg-[#f3f4f1] px-3 py-2 rounded-lg"
                nextButtonClass="h-9 w-9 bg-[#edfbea] hover:bg-[#f3f4f1] rounded-lg"
                numberButtonsClass="h-9 w-9 mx-2 hover:bg-[#f3f4f1] px-3 py-2 rounded-lg"
                @click="onClickHandler"
            />
        </div>
    </div>
</template>

<style scoped>

</style>
