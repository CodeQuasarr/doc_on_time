<script setup lang="ts">

import {XMarkIcon} from "@heroicons/vue/24/outline";
import type {Availability} from "../../types";
import type {PropType} from "vue";


const props = defineProps({
    availabilities: {
        type: [Object, null] as PropType<Availability[] | null>, // On permet à 'availabilities' d'être soit un objet de type PaginatedAvailability, soit null
        required: false
    },
    appointmentHours: {
        type: Array as PropType<string[]>, // Ou spécifie le type correct pour le tableau si ce n'est pas un tableau de chaînes
        default: () => [],
        required: false
    }
});

const handleDeleteSlot = (time: string, day: 'today' | 'tomorrow') => {
    if (props.availabilities && props.availabilities[0]) {
        if (day === 'today') {
            props.availabilities[0].slots = props.availabilities[0].slots.filter(slot => slot !== time);
        } else {
            props.availabilities[1].slots = props.availabilities[1].slots.filter(slot => slot !== time);
        }
    }

};


</script>

<template>
    <div class="bg-white p-6 rounded-xl shadow-sm">
        <pre>
            {{ props.availabilities }}
        </pre>
        <h2 class="text+9-lg font-semibold text-[#3c3f35] mb-6">Disponibilités actuelles</h2>
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
                                @click="handleDeleteSlot(slot, 'tomorrow')"
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
                                @click="handleDeleteSlot(slot, 'today')"
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
