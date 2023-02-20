import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useDarknetStore = defineStore('darknet', () => {
    const darknet = ref({
        auth: false,
        user: null,
        posts: []
    });

    async function GetPosts(filters = {}) {
        const opts = {
            method: 'POST',
            body: JSON.stringify(filters)
        }
        const response: any = await fetch('http://localhost:3000/GetDarknetPosts', opts)
        if (response.ok) {
            darknet.value.posts = await response.json()
        }
    }

    async function CreatePost(post: any) {
        const opts = {
            method: 'POST',
            body: JSON.stringify(post),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const response: any = await fetch('http://localhost:3000/CreateDarknetPost', opts)
        console.log('create post response: ', response)
    }

    async function RegisterUser(user: any) {
        const opts = {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {'Content-Type': 'application/json'}
        }
        const response: any = await fetch('http://localhost:3000/RegisterDarknetUser', opts)
        console.log('create user: ', response)
    }

    async function authenticateUser(username: string, password: string) {
        const opts = {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {'Content-Type': 'application/json'}
        }
        const response: any = await fetch('http://localhost:3000/AuthenticateUser', opts)
        console.log('auth response: ', response)
    }

    return {
        darknet,
        GetPosts,
        CreatePost,
        RegisterUser,
        authenticateUser
    }
});