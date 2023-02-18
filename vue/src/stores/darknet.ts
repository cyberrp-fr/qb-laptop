import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useDarknetStore = defineStore('darknet', () => {
    const darknet = ref({
        posts: []
    });

    async function GetPosts(filters = {}) {
        const opts = {
            method: 'POST',
            body: JSON.stringify(filters)
        }
        const response: any = await fetch('https://qb-laptop/GetDarknetPosts', opts)
        console.log('darknet post response: ', response)
    }

    async function CreatePost(post: any) {
        const opts = {
            method: 'POST',
            body: JSON.stringify(post)
        }

        const response: any = await fetch('https://qb-laptop/CreateDarknetPost', opts)
        console.log('create post response: ', response)
    }

    return {
        darknet,
        GetPosts,
        CreatePost
    }
});