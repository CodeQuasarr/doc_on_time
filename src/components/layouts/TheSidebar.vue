<script lang="ts" setup>
import {defineEmits, computed} from "vue";
import {useRoute} from "vue-router";
import {XMarkIcon, PencilIcon, UserIcon, CalendarIcon, UsersIcon, UserGroupIcon, HomeIcon} from '@heroicons/vue/24/outline'

const props = defineProps<{
    isOpen: Boolean;
}>();
const emit = defineEmits(['update:isOpen']);
const menuItems = [
    { to: '/', icon: HomeIcon, text: 'Dashboard' },
    // { to: '/products', icon: ArchiveBoxIcon, text: 'stocks' },
]

const routes = [
    { to: '/dashboard', icon: CalendarIcon, text: 'Rendez-vous' },
    // { to: '/patients', icon: UsersIcon, text: 'Patients' },
    // { to: '/doctors', icon: UserGroupIcon, text: 'Médecins' },
]

const sidebarClasses = computed(() => `
  fixed top-0 left-0 h-full w-64 bg-[#474c3f] text-[#e6e7e0] shadow-lg transform transition-transform duration-300 ease-in-out z-40
  ${props.isOpen ? 'translate-x-0' : '-translate-x-full'}
  lg:translate-x-0
`);

const route = useRoute()
</script>

<template>
    <div class="z-50">
        <!-- Overlay -->
        <div
            v-if="isOpen"
            class="fixed inset-0 bg-black/50 z-30 lg:hidden"
            @click="emit('update:isOpen', false)"
        />
        <!-- Sidebar -->
        <div :class="sidebarClasses">
            <div class="p-6">

                <div class="flex items-center gap-3 mb-8">
                    <img src="../../assets/logo/logo.jpg" alt="Logo" class="h-12 rounded-xl" />
                    <h1 class="text-xl font-bold">MediCenter</h1>
                    <button
                        @click="emit('update:isOpen', false)"
                        class="p-2 bg-[#5c614f] rounded-lg transition-colors"
                    >
                        <XMarkIcon class="w-6 h-6 text-[#5ad04b] lg:hidden" />
                    </button>

                </div>

                <nav class="space-y-4">
                    <RouterLink
                        v-for="item in routes"
                        :key="item.to"
                        :to="item.to"
                        class="flex items-center gap-3 p-3 rounded-lg"
                        :class="[
                              route.path === item.to
                                ? 'bg-[#5c614f]'
                                : 'hover:bg-[#5c614f] transition-colors'
                        ]"
                        @click="emit('update:isOpen', false)"
                    >
                        <component :is="item.icon" class="w-5 h-5" />
                        <span>{{ item.text }}</span>
                    </RouterLink>
                </nav>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
