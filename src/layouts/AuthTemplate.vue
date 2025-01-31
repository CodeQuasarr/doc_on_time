<script setup lang="ts">
import { ref } from "vue";
import TheSidebar from "../components/layouts/TheSidebar.vue";
import TheHeader from "../components/layouts/TheHeader.vue";

const isSidebarOpen = ref(false)
</script>

<template>
    <div class="min-h-screen flex">
        <!-- Sidebar -->
        <TheSidebar
            :isOpen="isSidebarOpen"
            @update:isOpen="isSidebarOpen = $event"
        />

        <!-- Main Content -->
        <div class="flex-1 lg:ml-64  bg-[#f3f4f1]">
            <TheHeader @update:modelValue="isSidebarOpen = $event" />
            <main class="p-8">
                <slot />
            </main>
        </div>
    </div>
</template>

<style scoped>

</style>
