import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useDarknetStore = defineStore('darknet', () => {
    const darknet = ref({
        auth: false,
        user: null as any,
        posts: []
    });

    function SetPosts(posts: any) {
        darknet.value.posts = posts
    }

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
        if (darknet.value.user != null) {
            post.user_id = darknet.value.user['id']
        }
        const opts = {
            method: 'POST',
            body: JSON.stringify(post),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const response: any = await fetch('https://qb-laptop/CreateDarknetPost', opts)
        const content = await response.json()
        if (content.success === true) {
            return true
        }
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

    async function editProfile(profilePictureUrl: string) {
        const payload = {
            username: darknet.value.user['username'],
            profilePictureUrl
        }
        const opts = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type': 'application/json'}
        }
        await fetch('https://qb-laptop/DarknetEditProfile', opts)
    }

    function logout() {
        darknet.value.user = null
        darknet.value.auth = false
    }

    function getUserByCitizenid(citizenid: string) {
        if (darknet.value.user != null && darknet.value.user.citizenid === citizenid) {
            return darknet.value.user
        }

        return null
    }

    function getPostById(id: any) {
        for (let i = 0; i < darknet.value.posts.length; i++) {
            const post: any = darknet.value.posts[i]
            if (id == post['id']) {
                let authorUser = getUserByCitizenid(post['citizenid'])
                if (authorUser != null) {
                    post['profile_picture_url'] = authorUser['profile_picture_url']
                    post['user'] = authorUser
                }

                return post
            }
        }

        return null
    }

    function setRepliesForPost(postId: any, replies: any) {
        for (let i = 0; i < darknet.value.posts.length; i++) {
            const post: any = darknet.value.posts[i]
            if (post['id'] == postId) {
                post['replies'] = replies
            }
        }
    }

    async function postComment(data: any) {
        const opts = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }
        const response: any = await fetch('https://qb-laptop/DarknetPostComment', opts)
    }

    function SetUser(user: any) {
        darknet.value.user = user
    }

    return {
        darknet,
        SetPosts,
        GetPosts,
        CreatePost,
        RegisterUser,
        authenticateUser,
        editProfile,
        logout,
        getPostById,
        setRepliesForPost,
        postComment,
        SetUser
    }
});