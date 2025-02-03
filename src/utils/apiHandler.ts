import type { Ref } from 'vue';

/**
 * Utility function to handle API calls and error management.
 *
 * @param operation Function that performs the API call.
 * @param error Error Ref where the error message is stored.
 * @param errorMessage Error message to be set in case of failure.
 */
export const handleApiCall = async (
    operation: () => Promise<void>,
    error: Ref<string>,
    errorMessage: string
): Promise<void> => {
    try {
        await operation();
    } catch (e) {
        error.value = errorMessage;
    }
};
