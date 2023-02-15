import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useWebsitesStore = defineStore('websites', () => {
    const websites = ref({
        
    });

    return {
        websites
    }
});