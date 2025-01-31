<script lang="ts" setup>

import {useInactivity} from "./composables/useInactivity.ts";

const { showWarning: resetTimer } = useInactivity(10 * 60 * 1000, 30 * 1000);

/**
 * A function that resets a timer manually by performing the following actions:
 * - Disables and hides the warning message by setting its associated value to false.
 * - Invokes the resetTimer function to reset the timer logic.
 */
const resetTimerManually = () => {
    showWarning.value = false;
    resetTimer();
};
</script>

<template>
    <RouterView />
    <!-- Modale  d'avertissement -->
    <div
        v-if="showWarning"
        class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50"
    >
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <p class="text-lg font-bold">Inactivité détectée !</p>
            <p class="mt-2">Vous serez déconnecté dans 30 secondes pour inactivité.</p>
            <button
                class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                @click="resetTimerManually"
            >
                Rester connecté
            </button>
        </div>
    </div>
</template>

<style scoped>
</style>
