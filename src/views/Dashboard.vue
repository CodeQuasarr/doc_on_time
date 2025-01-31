<script setup lang="ts">

import {useAuthStore} from "../stores/auth.ts";

const authStore = useAuthStore()

import DoctorDashboardComponent from "../components/dashboard/DoctorDashboardComponent.vue";
import PatientDashboardComponent from "../components/dashboard/PatientDashboardComponent.vue";
import AuthTemplate from "../layouts/AuthTemplate.vue";
</script>

<template>
    <AuthTemplate>
        <PatientDashboardComponent
            v-if="authStore.user?.roles.includes('ROLE_PATIENT')"
        />
        <DoctorDashboardComponent
            v-if="authStore.user && authStore.user.roles.includes('ROLE_DOCTOR')"
        />
    </AuthTemplate>
</template>

<style scoped>

</style>

