// composables/useInactivity.ts
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

/**
 * A composable function to manage user inactivity within an application.
 * It provides a mechanism to warn users of inactivity and eventually
 * disconnect them after a specified timeout duration.
 *
 * @param {number} [timeout=600000] The total inactivity duration (in milliseconds) after which the user will be logged out.
 * @param {number} [warningDuration=30000] The duration (in milliseconds) prior to the timeout in which a warning will be shown.
 * @return {Object} An object containing the reactive state `showWarning`, which indicates whether the warning message should be displayed.
 */
export function useInactivity(timeout: number = 1 * 60 * 1000, warningDuration: number = 30 * 1000) {
    const router = useRouter();
    const timeoutRef = ref<ReturnType<typeof setTimeout> | null>(null);
    const warningRef = ref<ReturnType<typeof setTimeout> | null>(null);
    const showWarning = ref(false); // État pour afficher ou non le message d'avertissement

    /**
     * Resets and reinitializes the user session timer by clearing existing timeouts
     * and setting new timeouts. The method schedules a warning to be displayed to the
     * user before the session ends.
     *
     * This function ensures user session expiration is properly managed by resetting
     * any existing timers and scheduling warnings for session expiration.
     *
     * - Clears any previously set timeout associated with user session expiration.
     * - Clears any previously set timeout associated with session warning display.
     * - Schedules a new timeout to trigger a warning before the session expiration.
     */
    const resetTimer = () => {
        // Nettoie les chronomètres si existants
        if (timeoutRef.value) clearTimeout(timeoutRef.value);
        if (warningRef.value) clearTimeout(warningRef.value);

        // Délai avant de déconnecter complètement l'utilisateur
        timeoutRef.value = setTimeout(() => {
            triggerWarning();
        }, timeout - warningDuration);
    };

    /**
     * triggerWarning is a function that activates a warning mechanism and initiates a countdown timer
     * to handle user inactivity. Once triggered, the function sets the showWarning flag to true and
     * starts a timeout that executes the handleInactivity function after a specified duration.
     *
     * Functionality:
     * - Sets a warning flag to indicate an inactive state.
     * - Starts a timeout with a predefined warning duration to handle the inactivity.
     *
     * Dependencies:
     * - Requires showWarning to be a reactive variable for controlling warning visibility.
     * - Depends on warningRef to store the reference to the active timeout.
     * - Requires handleInactivity to define the action to be taken upon timeout completion.
     * - Depends on warningDuration to specify the countdown duration in milliseconds.
     */
    const triggerWarning = () => {
        showWarning.value = true;

        // Commence un compte à rebours final avant déconnexion
        warningRef.value = setTimeout(() => {
            handleInactivity();
        }, warningDuration);
    };

    /**
     * A function to handle user inactivity. This function is triggered when the user
     * remains inactive for a specified duration. It performs the following actions:
     *
     * - Logs a message indicating that the user has been disconnected due to inactivity.
     * - Disables the warning message by setting `showWarning.value` to false.
     * - Clears all data stored in localStorage.
     * - Redirects the user to the "Home" route using the router.
     */
    const handleInactivity = () => {
        console.log("Utilisateur déconnecté pour inactivité !");
        showWarning.value = false;
        localStorage.clear();
        router.push({ name: "home" });
    };

    /**
     * @function addEventListeners
     * @description Adds event listeners to the document for specific user interactions to trigger the resetTimer function.
     * These interactions include mouse movement, keyboard activity, mouse clicks, and scroll events.
     */
    const addEventListeners = () => {
        document.addEventListener("mousemove", resetTimer);
        document.addEventListener("keydown", resetTimer);
        document.addEventListener("click", resetTimer);
        document.addEventListener("scroll", resetTimer);
    };

    /**
     * Removes previously added event listeners for user activity.
     *
     * The following event listeners are removed:
     * - "mousemove" event, triggering the resetTimer function.
     * - "keydown" event, triggering the resetTimer function.
     * - "click" event, triggering the resetTimer function.
     * - "scroll" event, triggering the resetTimer function.
     *
     * This function ensures that the specified event listeners,
     * which would have been used to detect user activity, are detached
     * from the document object.
     */
    const removeEventListeners = () => {
        document.removeEventListener("mousemove", resetTimer);
        document.removeEventListener("keydown", resetTimer);
        document.removeEventListener("click", resetTimer);
        document.removeEventListener("scroll", resetTimer);
    };


    onMounted(() => {
        resetTimer();
        addEventListeners();
    });

    onUnmounted(() => {
        if (timeoutRef.value) clearTimeout(timeoutRef.value);
        if (warningRef.value) clearTimeout(warningRef.value);
        removeEventListeners();
    });

    return {
        showWarning,
    };
}
