<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {useAuthStore} from "../../stores/auth.ts";

const isOpen = ref<boolean>(false);
const userDropdownRef = ref<HTMLElement | null>(null);

const setIsOpen = (value: boolean) => {
    isOpen.value = value;
};
const authStore = useAuthStore()

const handleClickOutside = (event: MouseEvent) => {
    if (userDropdownRef.value && !userDropdownRef.value.contains(event.target as Node)) {
        setIsOpen(false);
    }
};

const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div ref="userDropdownRef" class="relative">
        <button class="flex items-center space-x-2 hover:bg-[#e6e7e0] rounded-lg p-2"
                @click="setIsOpen(!isOpen)"
        >
            <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"
                alt="User avatar"
                class="w-10 h-10 rounded-full object-cover"
            />
            <div>
                <p class="font-medium text-[#3c3f35]">{{ authStore.user?.first_name + ' ' + authStore.user?.last_name }}</p>
                <p class="text-sm text-[#929982]">Médecin généraliste</p>
            </div>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="m19.5 8.25-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>

        <div v-if="isOpen"
             class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <div class="py-1 border-t border-gray-200">
                <button @click="logout" class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                    Se Déconnecter
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
