<script setup lang="ts">


import {useWeeklyCalendar} from "../../composables/useWeeklyCalendar.ts";
import { CalendarIcon, ClockIcon, PlusIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import {formatDateToDateFns} from "../../utils/formateDate.ts";
import {defineEmits, defineProps, type PropType} from "vue";
import type {Availability} from "../../types";


// Props
const props = defineProps({
    weekAvailability: {
        type: Array as PropType<Availability[]>,
        required: true,
    },
    weekAppointment: {
        type: Array as PropType<Availability[]>,
        required: true,
    },
});

// Emits
const emit = defineEmits(["availabilityWasUpdated"]);

console.log(typeof props.weekAvailability);
const {
    days, showAddAvailability, selectedDay, appointmentHours,
    newAvailability, toggleAddAvailability, handleDayClick, save
} = useWeeklyCalendar(props.weekAvailability, props.weekAppointment, emit);

</script>

<template>
    <div class="bg-white p-6 rounded-xl shadow-sm">
        <h2 class="text-lg font-semibold text-[#3c3f35] mb-6">Gérer mes disponibilités</h2>
        <div class="grid grid-cols-6 gap-2 mb-6">
            <div
                v-for="day in days"
                :key="day.short"
                class="text-center"
            >
                <div class="text-sm font-medium text-[#767d66] mb-2">{{ day.short }}</div>
                <button
                    @click="handleDayClick(day.full, day.date)"
                    class="w-full aspect-square rounded-lg bg-[#edfbea] text-[#216e1d] hover:bg-[#d7f6d1] transition-colors flex flex-col items-center justify-center group relative"
                >
                    <CalendarIcon class="w-5 h-5 mb-1" />
                    <span class="text-xs font-medium">{{ formatDateToDateFns(day.date) }}</span>
                    <PlusIcon class="w-4 h-4 absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
        </div>
        <div class="space-y-4">
            <div class="flex items-center justify-between p-3 rounded-lg bg-[#f3f4f1]">
                <div class="flex items-center gap-3">
                    <ClockIcon class="w-5 h-5 text-[#767d66]" />
                    <span class="text-[#3c3f35]">Lundi - Vendredi</span>
                </div>
                <div class="text-sm text-[#929982]">09:00 - 17:00</div>
            </div>
            <div class="flex items-center justify-between p-3 rounded-lg bg-[#f3f4f1]">
                <div class="flex items-center gap-3">
                    <ClockIcon class="w-5 h-5 text-[#767d66]" />
                    <span class="text-[#3c3f35]">Samedi</span>
                </div>
                <div class="text-sm text-[#929982]">09:00 - 12:00</div>
            </div>
        </div>

        <!-- Add Availability Modal -->
        <div v-if="showAddAvailability" class="fixed inset-0 bg-black/70 bg-opacity-25 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-xl w-full max-w-md">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-[#3c3f35]">Ajouter une disponibilité</h3>
                    <button
                        @click="showAddAvailability = false"
                        class="p-2 hover:bg-[#f3f4f1] rounded-lg transition-colors"
                    >
                        <XMarkIcon class="w-5 h-5 text-[#767d66]" />
                    </button>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-[#3c3f35] mb-1">Jour</label>
                        <input
                            type="text"
                            :value="selectedDay"
                            readOnly
                            class="w-full p-2 rounded-lg border border-[#ced1c5] bg-[#f3f4f1]"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-[#474c3f]">Créneaux</label>
                        <div class="grid grid-cols-4 gap-2">
                            <div
                                v-for="hour in ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00']"
                                :key="hour"
                                :class="{
                                    'bg-[#299020] text-white': newAvailability.slots.includes(hour),
                                    'bg-[#e6e7e0]': !newAvailability.slots.includes(hour)
                                }"
                                class="relative group px-2 py-1 text-sm rounded text-center"
                            >
                                <button
                                    class="w-full cursor-pointer transition-colors"
                                    @click="toggleAddAvailability(hour)"
                                >
                                    {{ hour }}
                                </button>
                                <div
                                    v-if="appointmentHours.length && appointmentHours.includes(hour)"
                                    class="bg-[#d7f6d1]/60 absolute right-0 top-0 border border-white w-full h-full flex items-center justify-center gap-1">
                                    <XMarkIcon class="w-8 h-8 text-red-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        @click="save()"
                        class="w-full py-2 bg-[#39b52d] hover:bg-[#299020] text-white rounded-lg transition-colors"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
