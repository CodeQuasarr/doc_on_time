<script setup lang="ts">

import {XMarkIcon} from "@heroicons/vue/24/outline";
import type {PaginatedAvailability} from "../../types";

defineProps<{
    availabilities: PaginatedAvailability | null,
    appointmentHours: string[]
}>()

const handleDeleteSlot = (time: string, day: 'today' | 'tomorrow') => {
    if (day === 'today') {
        availabilities[0].slots = availabilities[0].slots.filter(slot => slot !== time);
    } else {
        availabilities[1].slots = availabilities[1].slots.filter(slot => slot !== time);
    }
};


</script>

<template>
    <div class="bg-white p-6 rounded-xl shadow-sm">
        <h2 class="text-lg font-semibold text-[#3c3f35] mb-6">Disponibilités actuelles</h2>
        <div class="space-y-4">
            <div class="p-3 rounded-lg bg-[#edfbea]">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-[#216e1d]">Aujourd'hui</span>
                    <span class="text-sm text-[#299020]">{{ availabilities && availabilities[0] ? availabilities[0].slots.length : '0' }} créneaux</span>
                </div>

                <div class="flex flex-wrap gap-4">
                    <div
                        v-if="availabilities && availabilities[0] && availabilities[0].slots.length"
                        v-for="(slot, index) in availabilities[0].slots"
                        :key="'availability_' + index"
                        class="relative group"
                    >
                        <button class="px-5 py-2 rounded bg-white text-sm text-[#216e1d] hover:bg-[#d7f6d1] transition-colors">
                            {{ slot }}
                        </button>
                        <div
                            v-if="appointmentHours.length && appointmentHours.includes(slot)"
                            class="bg-[#d7f6d1]/60 absolute right-0 top-0 border border-white w-full h-full flex items-center justify-center gap-1">
                            <XMarkIcon class="w-8 h-8 text-red-500" />
                        </div>
                        <div v-else class="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                                @click="handleDeleteSlot(time, 'tomorrow')"
                                class="p-1 rounded bg-[#f3f4f1] text-[#474c3f] hover:bg-[#e6e7e0]"
                            >
                                <XMarkIcon class="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                    <div v-else class="">
                        Pas de disponibilités pour Aujourd'hui.
                    </div>
                </div>

            </div>
            <div class="p-3 rounded-lg bg-[#f3f4f1]">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-[#216e1d]">Demain</span>
                    <span class="text-sm text-[#299020]">{{ availabilities && availabilities[1] ? availabilities[1].slots.length : '0' }} créneaux</span>
                </div>

                <div class="flex flex-wrap gap-4">
                    <div
                        v-if="availabilities && availabilities[1] && availabilities[1].slots.length"
                        v-for="(slot, index) in availabilities[1].slots"
                        :key="'next_availability_' + index"
                        class="relative group"
                    >
                        <button class="px-5 py-2 rounded bg-white text-sm text-[#474c3f] hover:bg-[#e6e7e0] transition-colors">
                            {{ slot }}
                        </button>
                        <div class="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                                @click="handleDeleteSlot(time, 'today')"
                                class="p-1 rounded bg-[#f3f4f1] text-[#474c3f] hover:bg-[#e6e7e0]"
                            >
                                <XMarkIcon class="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                    <div v-else class="">
                        Pas de disponibilités pour demain pour le moment.
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
