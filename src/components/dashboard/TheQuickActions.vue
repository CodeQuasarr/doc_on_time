<script setup lang="ts">

import {CalendarIcon, UsersIcon} from "@heroicons/vue/24/outline";
</script>

<template>
    <div class="bg-white p-6 rounded-xl shadow-sm">
        <h2 class="text-lg font-semibold text-[#3c3f35] mb-6">Actions rapides</h2>
        <div class="grid grid-cols-2 gap-4">
            <button class="p-4 rounded-lg bg-[#edfbea] text-[#216e1d] hover:bg-[#d7f6d1] transition-colors">
                <CalendarIcon class="w-6 h-6 mx-auto mb-2" />
                <span class="text-sm font-medium">Nouveau RDV</span>
            </button>
            <button class="p-4 rounded-lg bg-[#f3f4f1] text-[#474c3f] hover:bg-[#e6e7e0] transition-colors">
                <UsersIcon class="w-6 h-6 mx-auto mb-2" />
                <span class="text-sm font-medium">Nouveau patient</span>
            </button>
        </div>
    </div>
</template>

<style scoped>

</style>
