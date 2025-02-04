import { computed, ref  } from "vue";
import type {Availability} from "../types";
import {formatDateToDateFns, yyy_mm_dd_Format} from "../utils/formateDate.ts";
import {doctorService} from "../services/doctor.service.ts";
import {useToast} from "vue-toastification";

export function useWeeklyCalendar(weekAvailability: Availability[], weekAppointment: Availability[], emit: Function) {



    // Reactive State
    const reactiveWeekAvailability = ref(weekAvailability);
    const error = ref<string>("");
    const currentAvailabilityId = ref<number>(0);
    const showAddAvailability = ref(false);
    const selectedDay = ref("");
    const newAvailability = ref<Availability>({ date: new Date().toString(), slots: [] });
    const appointmentHours = ref<string[]>([]);

    // Computed Properties
    const days = computed(() => {
        const today = new Date();
        const diff = today.getDay() === 0 ? -6 : 1 - today.getDay(); // If Sunday, move back 6 days
        const monday = new Date(today.setDate(today.getDate() + diff));
        const dayNames = [
            { short: "Lun", full: "Lundi" },
            { short: "Mar", full: "Mardi" },
            { short: "Mer", full: "Mercredi" },
            { short: "Jeu", full: "Jeudi" },
            { short: "Ven", full: "Vendredi" },
            { short: "Sam", full: "Samedi" },
        ];

        return dayNames.map((day, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            return { ...day, date };
        });
    });

    // variables
    const toast = useToast();

    // Action Functions
    const handleDayClick = (day: string, date: Date) => {
        const formattedDate = yyy_mm_dd_Format(date);
        getSlotsByDate(formattedDate);
        selectedDay.value = `${day} ${formatDateToDateFns(date)}`;
        showAddAvailability.value = true;
    };

    const getSlotsByDate = (date: string) => {
        const foundAvailability = reactiveWeekAvailability.value.find(item => item.date === date);
        const foundAppointment = weekAppointment.find(item => item.date === date);

        currentAvailabilityId.value = foundAvailability?.id ?? 0;
        newAvailability.value.date = date;
        newAvailability.value.slots = foundAvailability?.slots || [];
        appointmentHours.value = foundAppointment?.slots || [];
    };

    const toggleAddAvailability = (hour: string) => {
        const slots = newAvailability.value.slots;
        const index = reactiveWeekAvailability.value.findIndex(item => item.date === newAvailability.value.date);

        if (slots.includes(hour)) {
            slots.splice(slots.indexOf(hour), 1);
            if (index !== -1) {
                reactiveWeekAvailability.value[index].slots = reactiveWeekAvailability.value[index].slots.filter(slot => slot !== hour);
            }
        } else {
            slots.push(hour);
        }
    };

    const save = async () => {
        try {
            if (!newAvailability.value.slots.length) {
                error.value = "Veuillez sélectionner au moins un créneau";
                return;
            }
            if (!newAvailability.value.date) {
                error.value = "Veuillez sélectionner une date";
                return;
            }

            if (currentAvailabilityId.value) {
                await doctorService.updateAvailabilities(newAvailability.value, currentAvailabilityId.value);
            } else {
                await doctorService.createAvailabilities(newAvailability.value);
            }

            showAddAvailability.value = false;
            emit("availabilityWasUpdated", newAvailability.value);
            toast.success("Disponibilités chargées avec succès");
        } catch {
            toast.error("Erreur lors de l'ajout des disponibilités");
        }
    };

    return {
        days,
        error,
        handleDayClick,
        showAddAvailability,
        selectedDay,
        newAvailability,
        appointmentHours,
        toggleAddAvailability,
        save,
    };
}
