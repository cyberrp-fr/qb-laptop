import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useDarknetStore = defineStore('darknet', () => {
    const darknet = ref({
        posts: []
    });

    async function GetPosts(filters = {}) {
        const response: any = await fetch('https://qb-laptop/GetDarknetPosts', filters)
        console.log('darknet post response: ', response)
    }

    return {
        darknet
    }
});