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
            body: JSON.stringify(filters),
            headers: {'Content-Type': 'application/json'}
        }
        const response: any = await fetch('https://qb-laptop/GetDarknetPosts', opts)
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

        const response: any = await fetch('https://qb-laptop/CreateDarknetPost', opts)
        console.log('create post response: ', response)
    }

    async function RegisterUser(user: any) {
        const opts = {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {'Content-Type': 'application/json'}
        }
        const response: any = await fetch('https://qb-laptop/RegisterDarknetUser', opts)
        const content = await response.json()
        if (content.success) {
            darknet.value.user = content.user
            darknet.value.auth = true

            return true
        }

        return content
    }

    async function authenticateUser(username: string, password: string) {
        const opts = {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {'Content-Type': 'application/json'}
        }
        const response: any = await fetch('https://qb-laptop/AuthenticateUser', opts)
        const content = await response.json()
        if (content.success) {
            darknet.value.user = content.user
            darknet.value.auth = true

            return true
        }

        return content
    }

    function logout() {
        darknet.value.user = null
        darknet.value.auth = false
    }

    return {
        darknet,
        GetPosts,
        CreatePost,
        RegisterUser,
        authenticateUser,
        logout
    }
});