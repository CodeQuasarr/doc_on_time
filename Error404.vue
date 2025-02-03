<script setup lang="ts">

import doctorSVG from "./src/assets/banner/doctor.svg";
</script>

<template>
    <div class="flex flex-col justify-center items-center px-6 mx-auto h-screen xl:px-0 dark:bg-gray-900">
        <div class="block md:max-w-lg">

            <img class="w-full h-full" :src="doctorSVG" alt="">
        </div>
        <div class="text-center xl:max-w-4xl">
            <h1 class="mb-3 text-2xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">La page n'existe pas</h1>
            <p class="mb-5 text-base font-normal text-gray-500 md:text-lg dark:text-gray-400">Oups ! Il semble que vous ayez suivi un mauvais chemin. Si vous pensez qu'il s'agit d'un problème, veuillez nous le signaler.</p>
            <a href="/" class="text-white bg-[#299020] text-white focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-3 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                <svg class="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                Retour à l'accueil
            </a>
        </div>
    </div>
</template>

<style scoped>

</style>
