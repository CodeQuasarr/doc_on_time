<script setup lang="ts">

import {useAuthStore} from "../stores/auth.ts";

const authStore = useAuthStore()

import DoctorDashboardComponent from "../components/dashboard/DoctorDashboardComponent.vue";
import PatientDashboardComponent from "../components/dashboard/PatientDashboardComponent.vue";
</script>

<template>
    <div class="bg-[#f3f4f1]">
        <PatientDashboardComponent
            v-if="authStore.user?.roles.includes('ROLE_PATIENT')"
        />
        <DoctorDashboardComponent
            v-if="authStore.user && authStore.user.roles.includes('ROLE_DOCTOR')"
        />
    </div>
</template>

<style scoped>

</style>

