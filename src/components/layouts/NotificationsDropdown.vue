<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";

const notifications = [
    {
        id: 1,
        title: 'Problème de stock',
        message: 'Le paracétamol est en rupture de stock',
        time: '2 heures',
        unread: true
    },
    {
        id: 2,
        title: 'Problème de stock',
        message: 'Le paracétamol est en rupture de stock',
        time: '2 heures',
        unread: true
    },
    {
        id: 3,
        title: 'Problème de stock',
        message: 'Le paracétamol est en rupture de stock',
        time: '2 heures',
        unread: false
    }
];

const isOpen = ref(false);
const unreadCount = computed(() => notifications.filter((n) => n.unread).length);
const dropdownRef = ref<HTMLElement | null>(null);

const setIsOpen = (value: boolean) => {
    isOpen.value = value;
};

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        setIsOpen(false);
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

</script>

<template>
    <div class="relative" ref="dropdownRef">
        <button @click="setIsOpen(!isOpen)" class="p-2 rounded-lg hover:bg-[#e6e7e0] relative">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span v-if="unreadCount > 0"class="absolute top-0 right-0 w-2 h-2 bg-[#39b52d] rounded-full"></span>
        </button>
        <div v-if="isOpen" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <div class="px-4 py-2 border-b border-gray-200">
                <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
            </div>
            <div class="max-h-96 overflow-y-auto">
                <div v-for="notification in notifications"
                     :key="notification.id"
                     :class="['px-4 py-3 hover:bg-[#d7f6d1]', notification.unread ? 'bg-[#edfbea]' : '']"
                >
                    <div class="flex justify-between items-start">
                        <h4 class="text-sm font-medium text-gray-900">{{ notification.title }}</h4>
                        <span class="text-xs text-gray-500">{{ notification.time }}</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                </div>
            </div>
            <div class="px-4 py-2 border-t border-gray-200">
                <button class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    Voir toutes les notifications
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
