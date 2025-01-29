<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {useAuthStore} from "../../stores/auth.ts";
import {authService} from "../../services/auth.service.ts";

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
    try {
        loading.value = true
        error.value = ''

        const { user, token } = await authService.login({
            username: email.value,
            password: password.value
        })

        authStore.setToken(token)
        authStore.setUser(user)

        router.push('/dashboard')
    } catch (e) {
        error.value = 'Email ou mot de passe incorrect'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-[#f3f4f1] py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-[#353730]">
                    Connexion
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="email" class="sr-only">Email</label>
                        <input
                            id="email"
                            v-model="email"
                            type="email"
                            required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#afb4a2] placeholder-[#767d66] text-[#353730] rounded-t-md focus:outline-none focus:ring-[#39b52d] focus:border-[#39b52d] focus:z-10 sm:text-sm"
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Mot de passe</label>
                        <input
                            id="password"
                            v-model="password"
                            type="password"
                            required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#afb4a2] placeholder-[#767d66] text-[#353730] rounded-b-md focus:outline-none focus:ring-[#39b52d] focus:border-[#39b52d] focus:z-10 sm:text-sm"
                            placeholder="Mot de passe"
                        />
                    </div>
                </div>

                <div v-if="error" class="text-red-500 text-sm text-center">
                    {{ error }}
                </div>

                <div>
                    <button
                        type="submit"
                        :disabled="loading"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#299020] hover:bg-[#216e1d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#39b52d] disabled:opacity-50"
                    >
                        <span v-if="loading">Chargement...</span>
                        <span v-else>Se connecter</span>
                    </button>
                </div>
            </form>

            <div class="text-center">
                <router-link
                    to="/register"
                    class="font-medium text-[#299020] hover:text-[#39b52d]"
                >
                    Créer un compte
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
