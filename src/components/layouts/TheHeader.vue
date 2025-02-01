<script setup lang="ts">

import { defineEmits } from "vue";
import NotificationsDropdown from "./NotificationsDropdown.vue";
import UserDropdown from "./UserDropdown.vue";

const emit = defineEmits(["update:modelValue"]);

</script>

<template>
    <div class="mx-auto px-10 mt-5">
        <div class="flex h-16 items-center justify-between">
            <!-- Mobile Sidebar Toggle -->
            <div class="lg:hidden w-10">
                <button
                    class=" p-2 bg-indigo-600 text-white rounded-lg"
                    @click="emit('update:modelValue', true)"
                >
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
            <div class="flex-1 max-w-lg mx-8">
                <div class="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#929982] w-6 h-6">
                        <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                    </svg>

                    <input
                        type="text"
                        placeholder="Rechercher un patient..."
                        class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-[#ced1c5] focus:outline-none focus:border-[#5ad04b]"
                    />
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <NotificationsDropdown />
                <UserDropdown />
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
