<script lang="ts" setup>

import {computed, onMounted, ref, watch} from "vue";
import type {Appointment, Availability, PaginatedAppointment, PaginatedAvailability} from "../../types";
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import {format, isSameDay} from "date-fns";
import {fr} from "date-fns/locale";
import {doctorService} from "../../services/doctor.service.ts";
import AppointmentOfDayComponent from "./AppointmentOfDayComponent.vue";
import {VueAwesomePaginate} from "vue-awesome-paginate";
import {ClockIcon, PencilIcon, XMarkIcon, CalendarIcon, UsersIcon, PlusIcon} from '@heroicons/vue/24/outline'

const appointments = ref<PaginatedAppointment|null>(null)
const selectedAppointment = ref<Appointment | null>(null)
const consultationNotes = ref('')
const availabilities = ref<PaginatedAvailability|null>(null)
const newAvailability = ref<Availability>({
    date: new Date().toString(),
    slots: []
})
const currentAvailabilityId = ref(0)
// const loading = ref(true)
const error = ref('')
const currentAvailabilityPage = ref<number>(1)
const appointmentHours = ref<string[]>([])

// Nouveau computed pour obtenir les créneaux existants pour la date sélectionnée
const existingSlotsForSelectedDate = () => {
    const existingAvailability = availabilities?.value?.data.find(a =>
        isSameDay(new Date(a.date), new Date(newAvailability?.value?.date))
    )
    // ajouter a newAvailability les créneaux existants pour la date sélectionnée
    if (existingAvailability && existingAvailability.id) {
        currentAvailabilityId.value = existingAvailability.id
        newAvailability.value.slots = existingAvailability.slots
    } else {
        newAvailability.value.slots = []
        currentAvailabilityId.value = 0
    }
}

// ecrir un watcher pour appeler existingSlotsForSelectedDate à chaque fois que la date change
watch(() => newAvailability.value.date, existingSlotsForSelectedDate)

onMounted(async () => {
    await Promise.all([
        loadAppointments(),
        loadAvailabilities()
    ])
})

async function loadAppointments(page: number = 1) {
    try {
        console.log('loadAppointments', page)
        appointments.value = await doctorService.getDoctorAppointments(page)
        if (appointments.value?.data) {
            appointmentHours.value = await doctorService.getTodayDoctorAppointmentsHourly()
        }
    } catch (e) {
        error.value = 'Erreur lors du chargement des rendez-vous'
    }
}

async function loadAvailabilities(page: number = currentAvailabilityPage.value) {
    try {
        availabilities.value = await doctorService.getDoctorAvailabilities(new Date(), page)
    } catch (e) {
        error.value = 'Erreur lors du chargement des disponibilités'
    }
}


async function saveConsultationNotes() {
    // if (!selectedAppointment.value) return
    //
    // try {
    //     await consultationService.addConsultationNotes(
    //         selectedAppointment.value.id,
    //         consultationNotes.value
    //     )
    //     selectedAppointment.value = null
    //     consultationNotes.value = ''
    // } catch (e) {
    //     error.value = 'Erreur lors de l\'enregistrement des notes'
    // }
}

async function addAvailability() {
    try {
        if (!newAvailability.value.slots.length) {
            error.value = 'Veuillez sélectionner au moins un créneau'
            return
        }
        if (!newAvailability.value.date) {
            error.value = 'Veuillez sélectionner une date'
            return
        }

        await doctorService.updateAvailabilities(newAvailability.value, currentAvailabilityId.value ?? null)
        availabilities?.value?.data?.push({...newAvailability.value})
        newAvailability.value = {
            date: new Date().toString(),
            slots: []
        }
    } catch (e) {
        error.value = 'Erreur lors de l\'ajout des disponibilités'
    }
}

function formatDate(date: string) {
    const timestamp: number = Date.parse(date);
    return format(new Date(timestamp), 'PPP', {locale: fr})
}

const onClickHandler = async (page: number) => {
    await loadAvailabilities(page)
};


interface TimeSlot {
    time: string;
    day: string;
}

interface DayInfo {
    short: string;
    full: string;
    date: Date;
}

const showAddAvailability = ref(false);
const showEditAvailability = ref(false);
const selectedDay = ref('');
const startTime = ref('09:00');
const endTime = ref('17:00');
const selectedTimeSlot = ref<TimeSlot | null>(null);

const todaySlots = ref<string[]>(['14:30', '15:00', '16:30']);
const tomorrowSlots = ref<string[]>(['09:30', '10:00', '11:30']);

// Calculer les dates de la semaine
const days = computed(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Si on est dimanche, on recule de 6 jours

    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);

    const weekDays: DayInfo[] = [];
    const dayNames = [
        { short: 'Lun', full: 'Lundi' },
        { short: 'Mar', full: 'Mardi' },
        { short: 'Mer', full: 'Mercredi' },
        { short: 'Jeu', full: 'Jeudi' },
        { short: 'Ven', full: 'Vendredi' },
        { short: 'Sam', full: 'Samedi' },
    ];

    for (let i = 0; i < dayNames.length; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDays.push({
            ...dayNames[i],
            date: date
        });
    }

    return weekDays;
});

// Les heures de rendez-vous pour les rendez-vous existants
function getAppointmentHours(data: Appointment[]): string[] {
    return data.map(appointment => appointment.hour);
}

// Formatage de la date
const formatDatex = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'numeric'
    });
};

const weeklyDateAndHourAppointments = ref([]);

const loadWeeklyAppointmentsHoursAndDates = async () => {
    weeklyDateAndHourAppointments.value = await doctorService.getWeeklyDateAndHourAppointments()
    console.log('weeklyDateAndHourAppointments', weeklyDateAndHourAppointments.value)
};

// Gérer le clic sur un jour
const handleDayClick = (day: string, date: Date) => {
    console.log('handleDayClick', day);
    selectedDay.value = `${day} ${formatDate(date)}`;
    showAddAvailability.value = true;
    loadWeeklyAppointmentsHoursAndDates();
};

// Gérer l'édition d'un créneau horaire
const handleEditSlot = (time: string, day: 'today' | 'tomorrow') => {
    selectedTimeSlot.value = { time, day };
    startTime.value = time;
    showEditAvailability.value = true;
};

// Supprimer un créneau horaire
const handleDeleteSlot = (time: string, day: 'today' | 'tomorrow') => {
    if (day === 'today') {
        todaySlots.value = todaySlots.value.filter(slot => slot !== time);
    } else {
        tomorrowSlots.value = tomorrowSlots.value.filter(slot => slot !== time);
    }
};

// Mettre à jour un créneau horaire
const handleUpdateSlot = () => {
    if (!selectedTimeSlot.value) return;

    if (selectedTimeSlot.value.day === 'today') {
        todaySlots.value = todaySlots.value.map(slot =>
            slot === selectedTimeSlot.value.time ? startTime.value : slot
        );
    } else {
        tomorrowSlots.value = tomorrowSlots.value.map(slot =>
            slot === selectedTimeSlot.value.time ? startTime.value : slot
        );
    }

    showEditAvailability.value = false;
    selectedTimeSlot.value = null;
};

</script>

<template>
    <div class="">

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- gauche -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Rendez-vous du jour-->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-lg font-semibold text-[#3c3f35]">Aujourd'hui</h2>
                        <span class="text-[#39b52d] font-medium">6 rendez-vous</span>
                    </div>
                    <AppointmentOfDayComponent
                        v-if="appointments"
                        :appointments="appointments"
                        @next-appointment="loadAppointments($event)"
                        @open-consultation-notes="selectedAppointment = $event"
                    />
                </div>
                <!-- Gestion des disponibilités -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <h2 class="text-lg font-semibold text-[#3c3f35] mb-6">Gérer mes disponibilités</h2>
                    <div class="grid grid-cols-6 gap-2 mb-6">
                        <div
                            v-for="day in days"
                            :key="day.short"
                            class="text-center"
                        >
                            <div class="text-sm font-medium text-[#767d66] mb-2">{{ day.short }}</div>
                            <button
                                @click="handleDayClick(day.full, day.date)"
                                class="w-full aspect-square rounded-lg bg-[#edfbea] text-[#216e1d] hover:bg-[#d7f6d1] transition-colors flex flex-col items-center justify-center group relative"
                            >
                                <CalendarIcon class="w-5 h-5 mb-1" />
                                <span class="text-xs font-medium">{{ formatDatex(day.date) }}</span>
                                <PlusIcon class="w-4 h-4 absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-3 rounded-lg bg-[#f3f4f1]">
                            <div class="flex items-center gap-3">
                                <ClockIcon class="w-5 h-5 text-[#767d66]" />
                                <span class="text-[#3c3f35]">Lundi - Vendredi</span>
                            </div>
                            <div class="text-sm text-[#929982]">09:00 - 17:00</div>
                        </div>
                        <div class="flex items-center justify-between p-3 rounded-lg bg-[#f3f4f1]">
                            <div class="flex items-center gap-3">
                                <ClockIcon class="w-5 h-5 text-[#767d66]" />
                                <span class="text-[#3c3f35]">Samedi</span>
                            </div>
                            <div class="text-sm text-[#929982]">09:00 - 12:00</div>
                        </div>
                    </div>

                    <!-- Add Availability Modal -->
                    <div v-if="showAddAvailability" class="fixed inset-0 bg-black/70 bg-opacity-25 flex items-center justify-center z-50">
                        <div class="bg-white p-6 rounded-xl w-full max-w-md">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-lg font-semibold text-[#3c3f35]">Ajouter une disponibilité</h3>
                                <button
                                    @click="showAddAvailability = false"
                                    class="p-2 hover:bg-[#f3f4f1] rounded-lg transition-colors"
                                >
                                    <XMarkIcon class="w-5 h-5 text-[#767d66]" />
                                </button>
                            </div>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-[#3c3f35] mb-1">Jour</label>
                                    <input
                                        type="text"
                                        :value="selectedDay"
                                        readOnly
                                        class="w-full p-2 rounded-lg border border-[#ced1c5] bg-[#f3f4f1]"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-[#474c3f]">Créneaux</label>
                                    <div class="grid grid-cols-4 gap-2">
                                        <button
                                            v-for="hour in ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']"
                                            :key="hour"
                                            :class="{
                                    'bg-[#299020] text-white': newAvailability.slots.includes(hour),
                                    'bg-[#e6e7e0]': !newAvailability.slots.includes(hour)
                                }"
                                            class="px-2 py-1 text-sm rounded"
                                            @click="newAvailability.slots.includes(hour) ? newAvailability.slots = newAvailability.slots.filter(s => s !== hour) : newAvailability.slots.push(hour)"
                                        >
                                            {{ hour }}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    @click="setShowAddAvailability(false)"
                                    class="w-full py-2 bg-[#39b52d] hover:bg-[#299020] text-white rounded-lg transition-colors"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- droite -->
            <div class="space-y-6">

                <!-- Disponibilités actuelles -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <h2 class="text-lg font-semibold text-[#3c3f35] mb-6">Disponibilités actuelles</h2>
                    <div class="space-y-4">
                        <div class="p-3 rounded-lg bg-[#edfbea]">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-[#216e1d]">Aujourd'hui</span>
                                <span class="text-sm text-[#299020]">8 créneaux</span>
                            </div>

                            <div class="flex flex-wrap gap-4">
                                <div
                                    v-if="availabilities && availabilities.length"
                                    v-for="(slot, index) in availabilities[0].slots"
                                    :key="'availability_' + index"
                                    class="relative group"
                                >
                                    <button class="px-5 py-2 rounded bg-white text-sm text-[#216e1d] hover:bg-[#d7f6d1] transition-colors">
                                        {{ slot }}
                                    </button>
                                    <div
                                        v-if="appointmentHours.length && appointmentHours.includes(slot)"
                                        class="bg-[#d7f6d1]/60 absolute right-0 top-0 border border-white w-full h-full flex items-center justify-center gap-1">
                                        <XMarkIcon class="w-8 h-8 text-red-500" />
                                    </div>
                                    <div v-else class="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button
                                            @click="handleEditSlot(time, 'today')"
                                            class="p-1 rounded bg-[#edfbea] text-[#216e1d] hover:bg-[#d7f6d1]"
                                        >
                                            <PencilIcon class="w-3 h-3" />
                                        </button>
                                        <button
                                            @click="handleDeleteSlot(time, 'today')"
                                            class="p-1 rounded bg-[#f3f4f1] text-[#474c3f] hover:bg-[#e6e7e0]"
                                        >
                                            <XMarkIcon class="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="p-3 rounded-lg bg-[#f3f4f1]">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-[#216e1d]">Prochaines</span>
                                <span class="text-sm text-[#299020]">8 créneaux</span>
                            </div>

                            <div class="flex flex-wrap gap-4">
                                <div
                                    v-if="availabilities && availabilities.length"
                                    v-for="(slot, index) in availabilities[1].slots"
                                    :key="'next_availability_' + index"
                                    class="relative group"
                                >
                                    <button class="px-5 py-2 rounded bg-white text-sm text-[#474c3f] hover:bg-[#e6e7e0] transition-colors">
                                        {{ slot }}
                                    </button>
                                    <div class="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button
                                            @click="handleEditSlot(time, 'today')"
                                            class="p-1 rounded bg-[#edfbea] text-[#216e1d] hover:bg-[#d7f6d1]"
                                        >
                                            <PencilIcon class="w-3 h-3" />
                                        </button>
                                        <button
                                            @click="handleDeleteSlot(time, 'today')"
                                            class="p-1 rounded bg-[#f3f4f1] text-[#474c3f] hover:bg-[#e6e7e0]"
                                        >
                                            <XMarkIcon class="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Action Rapide -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <h2 class="text-lg font-semibold text-[#3c3f35] mb-6">Actions rapides</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <button class="p-4 rounded-lg bg-[#edfbea] text-[#216e1d] hover:bg-[#d7f6d1] transition-colors">
                            <CalendarIcon class="w-6 h-6 mx-auto mb-2" />
                            <span class="text-sm font-medium">Nouveau RDV</span>
                        </button>
                        <button class="p-4 rounded-lg bg-[#f3f4f1] text-[#474c3f] hover:bg-[#e6e7e0] transition-colors">
                            <UsersIcon class="w-6 h-6 mx-auto mb-2" />
                            <span class="text-sm font-medium">Nouveau patient</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>

</style>

