import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useStateStore = defineStore('state', () => {
    const state = ref({
        turnedOn: false,
        open: false,
        user: null
    });

    function setState(newState: any) {
        state.value = newState;
    }

    return {
        state,
        setState
    }
});