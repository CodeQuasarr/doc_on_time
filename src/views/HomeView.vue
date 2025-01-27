<script setup lang="ts">
import doctorSVG from '../assets/banner/doctor.svg'
import { useRouter } from 'vue-router'

const router = useRouter()

function handleGetStarted() {
    // Redirect to the login page
    router.push('/dashboard')
}
</script>

<template>
    <div class="bg-[#f3f4f1]">
        <!-- Hero Section -->
        <div class="container mx-auto lg:grid xl:grid-cols-3">
            <div class="xl:col-span-2 xl:w-3/4 xl:mx-auto">
                <div class="relative z-10 pb-8 bg-[#f3f4f1] sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div class="sm:text-center lg:text-left">
                            <h1 class="text-4xl tracking-tight font-extrabold text-[#353730] sm:text-5xl md:text-6xl">
                                <span class="block">Prenez rendez-vous</span>
                                <span class="block text-[#299020]">en quelques clics</span>
                            </h1>
                            <p class="mt-3 text-base text-[#767d66] sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                MediBook simplifie la prise de rendez-vous médicaux. Trouvez rapidement un professionnel de santé et gérez vos rendez-vous en ligne.
                            </p>
                            <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div class="rounded-md shadow">
                                    <button
                                        @click="handleGetStarted"
                                        class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#299020] hover:bg-[#216e1d] md:py-4 md:text-lg md:px-10"
                                    >
                                        Commencer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div class="col-span-1 mt-18 hidden xl:block">
                <img class="ms-auto" :src="doctorSVG" alt="">
            </div>
        </div>

        <!-- Features Section -->
        <div class="py-12 bg-[#e6e7e0]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="lg:text-center">
                    <h2 class="text-base text-[#299020] font-semibold tracking-wide uppercase">Fonctionnalités</h2>
                    <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-[#353730] sm:text-4xl">
                        Une meilleure façon de gérer vos rendez-vous
                    </p>
                </div>

                <div class="mt-10">
                    <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                        <!-- Feature 1 -->
                        <div class="relative">
                            <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#39b52d] text-white">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div class="ml-16">
                                <h3 class="text-lg leading-6 font-medium text-[#353730]">Prise de rendez-vous simplifiée</h3>
                                <p class="mt-2 text-base text-[#767d66]">
                                    Réservez vos rendez-vous en quelques clics et gérez votre agenda médical facilement.
                                </p>
                            </div>
                        </div>

                        <!-- Feature 2 -->
                        <div class="relative">
                            <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#39b52d] text-white">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <div class="ml-16">
                                <h3 class="text-lg leading-6 font-medium text-[#353730]">Rappels et notifications</h3>
                                <p class="mt-2 text-base text-[#767d66]">
                                    Recevez des rappels pour vos rendez-vous et restez informé des modifications.
                                </p>
                            </div>
                        </div>

                        <!-- Feature 3 -->
                        <div class="relative">
                            <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#39b52d] text-white">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div class="ml-16">
                                <h3 class="text-lg leading-6 font-medium text-[#353730]">Historique médical</h3>
                                <p class="mt-2 text-base text-[#767d66]">
                                    Accédez à votre historique de consultations et gérez vos documents médicaux.
                                </p>
                            </div>
                        </div>

                        <!-- Feature 4 -->
                        <div class="relative">
                            <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#39b52d] text-white">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <div class="ml-16">
                                <h3 class="text-lg leading-6 font-medium text-[#353730]">Gestion flexible</h3>
                                <p class="mt-2 text-base text-[#767d66]">
                                    Modifiez ou annulez vos rendez-vous facilement selon vos besoins.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- CTA Section -->
        <div class="bg-[#216e1d]">
            <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-extrabold text-[#e6e7e0] sm:text-4xl">
                    <span class="block">Prêt à commencer ?</span>
                    <span class="block">Créez votre compte dès maintenant</span>
                </h2>
                <p class="mt-4 text-lg leading-6 text-[#b2eda9]">
                    Rejoignez les milliers d'utilisateurs qui font confiance à MediBook pour la gestion de leurs rendez-vous médicaux.
                </p>
                <button
                    @click="handleGetStarted"
                    class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#299020] bg-[#f3f4f1] hover:bg-[#edfbea] sm:w-auto"
                >
                    Commencer gratuitement
                </button>
            </div>
        </div>
    </div>
</template>
