<script lang="ts" setup>

import {defineEmits} from "vue";
import NotificationsDropdown from "./NotificationsDropdown.vue";
import UserDropdown from "./UserDropdown.vue";
import {Bars3Icon} from "@heroicons/vue/24/outline";

const emit = defineEmits(["update:modelValue"]);

</script>

<template>
    <div class="mx-auto px-10 mt-5">
        <div class="flex h-16 items-center justify-between">
            <!-- Mobile Sidebar Toggle -->
            <div class="lg:hidden w-10">
                <button
                    @click="emit('update:modelValue', true)"
                    class="p-2 bg-[#edfbea] hover:bg-[#d7f6d1] cursor-pointer rounded-lg transition-colors"
                >
                    <Bars3Icon class="w-6 h-6 text-[#299020] lg:hidden" />
                </button>
            </div>
            <div class="flex-1 max-w-lg mx-8">
                <div class="relative">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#929982] w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd"
                              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                              fill-rule="evenodd"/>
                    </svg>

                    <input
                        class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-[#ced1c5] focus:outline-none focus:border-[#5ad04b]"
                        placeholder="Rechercher un patient..."
                        type="text"
                    />
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <NotificationsDropdown/>
                <UserDropdown/>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
