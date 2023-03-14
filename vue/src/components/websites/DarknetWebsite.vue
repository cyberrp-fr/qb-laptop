<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useDarknetStore } from '@/stores/darknet'

// stores
const darknetStore = useDarknetStore()

// navigation page
const navigation = ref("homepage")

// homepage variables
const categories = ref({
    'hacking': 'Hacking',
    'drugs': 'Drogues',
    'guns': 'Armes'
})
const selectedCategory = ref('')
const search = ref('')


// create page variables
const formTitle = ref('')
const formCategory = ref('')
const formDescription = ref('')


// LOGIN page variables
const loginUsername = ref('')
const loginPassword = ref('')
const loginFormError = ref('')

// REGISTER page variables
const registerUsername = ref('')
const registerPassword = ref('')
const registerPassword2 = ref('')
const registerFormError = ref('')


// PROFILE page variables
const profilePictureUrl = ref('https://i.imgur.com/1M5IK1E.jpg')
if (darknetStore.darknet.user != null && darknetStore.darknet.user['profile_picture_url'] != null) {
    profilePictureUrl.value = darknetStore.darknet.user['profile_picture_url']
}

// show post page variables
const displayPost = ref()
const postReplyContent = ref('')

// ===============
// == Functions ==
// ===============

function validateForm() {
    let violations: Array<any> = []
	formTitle.value = formTitle.value.trim()
	if (formTitle.value.length < 5) {
		violations.push({field: 'title', error: 'Le titre doit avoir 5 caracteres minimum.'})
	}

	formDescription.value = formDescription.value.trim()
	if (formDescription.value.length < 10) {
		violations.push({field: 'description', error: 'la description doit faire au moins 10 caracteres.'})
	}

	return violations
}

async function createPostForm() {
	let violations: Array<any> = validateForm()
	if (violations.length > 0) {
		//
		return
	}

	const post = {
		title: formTitle.value,
		category: formCategory.value,
		description: formDescription.value
	}
	let result = await darknetStore.CreatePost(post)
    if (result === true) {
        // await darknetStore.GetPosts()
        gotopage('homepage')
        formTitle.value = ''
        formDescription.value = ''
        formCategory.value = ''
    }
}

async function loginForm() {
    // @todo: form validation
    let result = await darknetStore.authenticateUser(loginUsername.value, loginPassword.value)
    if (result === true) {
        gotopage('homepage')
    } else {
        loginFormError.value = result.message
    }
}

async function registerForm() {
    // validation
    let violations = []
    if (registerUsername.value.length < 3) {
        violations.push({field: 'userHandle', error: 'l\'alias doit avoir 3 caracteres minimum.'})
    }
    if (registerPassword.value !== registerPassword2.value) {
        violations.push({field: 'password', error: 'Le 2eme mot de passe n\'est pas identique au 1er.'})
    }

    if (violations.length > 0) {
        // todo show error
        return
    }

    const user = {
        username: registerUsername.value,
        password: registerPassword.value
    }

    let result: any = await darknetStore.RegisterUser(user)
    if (result === true) {
        gotopage('homepage')
    } else if (result.success === false) {
        registerFormError.value = result.message
    }
}

async function editProfileForm() {
    await darknetStore.editProfile(profilePictureUrl.value)
}

async function fetchPosts() {
    let categoryTemp = null
    let searchTemp = null

    if (selectedCategory.value != '') {
        categoryTemp = selectedCategory.value
    }
    if (search.value != '') {
        searchTemp = search.value
    }

    await darknetStore.GetPosts({ category: categoryTemp, search: searchTemp })
}

function gotopage(page: string) {
    navigation.value = page

    if (page == 'create' && !darknetStore.darknet.auth) {
        navigation.value = 'login'
    }
}

function showPost(id: any) {
    displayPost.value = darknetStore.getPostById(id)
    gotopage('showpost')
}

async function postComment() {
    if (darknetStore.darknet.user == null) {
        return
    }

    let payload = {
        post_id: displayPost.value.id,
        user_id: darknetStore.darknet.user['id'],
        username: darknetStore.darknet.user['username'],
        comment: postReplyContent.value
    }

    await darknetStore.postComment(payload)
    postReplyContent.value = ''
}

onMounted(() => {
    darknetStore.GetPosts()
})

</script>

<template>
<div class="website">
    <div class="navbar">
        <div class="container flex justify-content-space-between">
            <div class="brand-container" @click="gotopage('homepage')">
                <div class="brand-logo">
                    <img src="https://i.imgur.com/ycfxccx.png">
                </div>
                <div class="brand">Shadow<span class="highlight">NET</span></div>
            </div>

            <div v-if="darknetStore != null" class="nav-menu">
                <div v-if="!darknetStore.darknet.auth" class="nav-item"><button @click="gotopage('login')">Connexion</button></div>
                <div v-if="!darknetStore.darknet.auth" class="nav-item"><button @click="gotopage('register')">Inscription</button></div>
                <div v-if="darknetStore.darknet.auth" class="nav-item"><button @click="gotopage('profile')">Profil</button></div>
                <div v-if="darknetStore.darknet.auth" class="nav-item"><button @click="darknetStore.logout">Déconnexion</button></div>
            </div>
        </div>
    </div>

    <div v-if="navigation == 'homepage'" class="maincontent">
        <div class="filters">
            <div class="flex">
                <div class="category-filter-wrapper">
                    <select @change="fetchPosts" v-model="selectedCategory" class="category-filter">
                        <option value="">Catégorie de posts</option>
                        <option v-for="(category, key, index) in categories" :value="key">{{ category }}</option>
                    </select>
                </div>
                <div class="search-filter-wrapper">
                    <input v-on:keydown.enter="fetchPosts" v-model="search" type="text" class="search-filter" placeholder="Recherche...">
                </div>
                <div class="submit-btn-wrapper">
                    <button @click="fetchPosts" class="submit">Rechercher</button>
                </div>
            </div>

            <div class="create-post-wrapper">
                <button @click="gotopage('create')" class="create-post">Créer Post</button>
            </div>
        </div>

        <div class="posts">
            <div v-for="post in darknetStore.darknet.posts" @click="showPost(post['id'])" class="post-wrapper">
                <div class="post">
                    <div class="post-title">{{ post['title'] }}</div>
                    <div class="post-metadata">
                        <span class="user-handle">{{ post['userHandle'] }}</span>
                        <span class="category">{{ categories[post['category']] }}</span>
                    </div>
                    <div class="post-descrition-part">
                        {{ post['description'] }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="navigation == 'create'" class="createform">
        <div class="form-content">
            <div class="breadcrumb-wrapper"></div>

            <div class="form-wrapper">
                <div class="title-wrapper">
                    <input v-model="formTitle" type="text" placeholder="Titre...">
                </div>

                <div class="metadata-wrapper">
                    <div class="category">
                        <select v-model="formCategory" class="category-filter">
                            <option value="">Catégorie</option>
                            <option v-for="(category, key, index) in categories" :value="key">{{ category }}</option>
                        </select>
                    </div>
                </div>

                <div class="description-wrapper">
                    <textarea v-model="formDescription" rows="10" class="description" placeholder="Contenu de votre post..."></textarea>
                </div>

                <div class="submit-form-wrapper">
                    <button @click="createPostForm">Valider</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="navigation == 'login'" class="loginpage">
        <div class="container">
            <div class="loginform form">
                <div class="header">Connexion</div>
                <div class="form-field usernamefield">
                    <input v-model="loginUsername" type="text" placeholder="Alias">
                </div>
                <div class="form-field passwordfield">
                    <input v-model="loginPassword" type="password" placeholder="Mot de passe...">
                </div>
                <div class="form-submit">
                    <button @click="loginForm">Connexion</button>
                </div>
                <div v-if="loginFormError != ''" class="form-errors">{{ loginFormError }}</div>
            </div>
        </div>
    </div>

    <div v-if="navigation == 'register'" class="registerpage">
        <div class="container">
            <div class="loginform form">
                <div class="header">Inscription</div>
                <div class="form-field usernamefield">
                    <input v-model="registerUsername" type="text" placeholder="Alias">
                </div>
                <div class="form-field passwordfield">
                    <input v-model="registerPassword" type="password" placeholder="Mot de passe">
                </div>
                <div class="form-field passwordfield">
                    <input v-model="registerPassword2" type="password" placeholder="Confirmation mot de passe">
                </div>
                <div class="form-submit">
                    <button @click="registerForm">Inscription</button>
                </div>
                <div v-if="registerFormError != ''" class="form-errors">{{ registerFormError }}</div>
            </div>
        </div>
    </div>

    <div v-if="navigation == 'showpost'" class="showpostpage">
        <div class="container">
            <div class="post-display-wrapper">
                <div class="post-display">
                    <div class="post-author-zone">
                        <div class="author-img-zone">
                            <img :src="displayPost['user']['profile_picture_url']" alt="anonymous-user-placeholder">
                        </div>
                        <div class="author-name-zone">{{ displayPost['userHandle'] }}</div>
                    </div>
                    <div class="post-content-zone">
                        <div class="post-content-date-zone"></div>
                        <div class="post-content-description-zone">
                            {{ displayPost['description'] }}
                        </div>
                    </div>
                </div>
            </div>

            <div v-for="reply in displayPost.replies" class="post-comment">
                <div class="comment-author">
                    <div class="comment-author-img" :class="{'owner': reply.user_id == displayPost.user_id}">
                        <img :src="reply['user']['profile_picture_url']" alt="anonymous-user-placeholder">
                    </div>
                    <div class="comment-author-name" :class="{'owner': reply.user_id == displayPost.user_id}">{{ reply['username'] }}</div>
                </div>
                <div class="comment-content">
                    <div class="comment-content-description">{{ reply['comment'] }}</div>
                </div>
            </div>

            <div v-if="darknetStore.darknet.auth" class="post-comment post-new-comment">
                <div class="comment-author">
                    <div class="comment-author-img">
                        <img :src="darknetStore.darknet.user['profile_picture_url'] || 'https://i.imgur.com/1M5IK1E.jpg'" alt="anonymous-user-placeholder">
                    </div>
                    <div v-if="darknetStore.darknet.user" class="comment-author-name">{{ darknetStore.darknet.user['username'] }}</div>
                </div>
                <div class="comment-content">
                    <textarea v-model="postReplyContent" v-on:keyup.enter="postComment" cols="30" rows="8" placeholder="Votre commentaire..."></textarea>
                    <div class="w-100 text-right">
                        <button @click="postComment" class="post-comment-btn">Commenter</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="navigation == 'profile'" class="profilepage">
        <div class="container">
            <div class="profile-form">
                <div class="picture-display">
                    <img :src="profilePictureUrl" >
                </div>
                <div class="picture-url-form-group">
                    <label for="profilepicture">Photo profil:</label>
                    <input v-model="profilePictureUrl" type="text" id="profilepicture" placeholder="URL de la photo">
                </div>
            </div>
            <div class="profile-form-submit">
                <button @click="editProfileForm">Sauvegarder</button>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
}

.flex {
    display: flex;
}

.justify-content-space-between {
    justify-content: space-between !important;
}

.container {
    width: 83%;
    margin: auto;
}

.form-errors {
    margin-top: 20px;
    color: #ff4141;
    font-family: Arial, Helvetica, sans-serif;
}

.website {
    position: relative;
    width: 100%;
    min-height: 820px;
    height: 100%;
    background-color: rgb(11, 14, 32);
    padding-bottom: 200px;

    .navbar {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background-color: rgb(7, 10, 22);
        display: flex;

        .brand-container {
            display: flex;
            padding: 10px 20px;
            cursor: pointer;

            .brand-logo {
                margin-right: 20px;

                img {
                    width: 40px;
                    transform: scaleX(-1);
                }
            }
            .brand {
                font-family: 'Ubuntu Mono', sans-serif;
                font-size: 26px;
                color: #233164;
                line-height: 1.4;

                .highlight {
                    color: #03d5ca !important;
                    margin-left: 3px;
                    font-family: Arial;
                    font-size: 20px;
                    font-weight: bold;
                }
            }
        }

        .nav-menu {
            display: flex;
            align-items: center;

            .nav-item {

                button {
                    background-color: transparent;
                    border: none;
                    outline: 0;
                    color: #656580;
                    font-weight: bold;
                    cursor: pointer;

                    &:hover {
                        color: #444457;
                    }
                }
            }
        }
    }

    // Homepage
    .maincontent {
        position: relative;
        top: 100px;
        width: 80%;
        margin: auto;
        // font-family: 'Ubuntu Mono', sans-serif;
        font-family: Arial, Helvetica, sans-serif;


        .filters  {
            display: flex;
            justify-content: space-between;

            .category-filter {
                background: transparent;
                color: #d9d9d9;
                border: 1px solid #182347;
                border-radius: 4px;
                padding: 5px 10px;
                font-size: 15px;

                option {
                    background: #182347;
                    color: #fff;
                    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
                }
            }

            .search-filter {
                background: transparent;
                color: #d9d9d9;
                border: 1px solid #182347;
                border-radius: 4px;
                padding: 6px 10px;
                font-size: 15px;
                margin-left: 10px;
                outline: 0;
            }

            .submit-btn-wrapper {
                margin-left: 0px;

                button {
                    background: #182347;
                    color: #d9d9d9;
                    border: none;
                    border-radius: 4px;
                    padding: 7px 10px;
                    font-size: 15px;
                    margin-left: 10px;
                    outline: 0;
                    cursor: pointer;
                    font-weight: bold;

                    &:hover {
                        background: #273972;
                    }
                }
            }

            .create-post-wrapper {

                button {
                    background: #182347;
                    color: #d9d9d9;
                    border: none;
                    border-radius: 4px;
                    padding: 7px 10px;
                    font-size: 15px;
                    margin-left: 10px;
                    outline: 0;
                    cursor: pointer;
                    font-weight: bolder;

                    &:hover {
                        background: #273972;
                    }
                }
            }
        }

        .posts {
            margin-top: 30px;

            .post-wrapper {
                margin-bottom: 10px;

                .post {
                    color: #d9d9d9;
                    // border: 1px solid #182347;
                    background-color: rgb(18, 22, 49);
                    padding: 15px 25px;
                    border-radius: 7px;
                    cursor: pointer;
                    -webkit-box-shadow: -2px 2px 13px -4px #000000; 
                    box-shadow: -2px 2px 13px -4px #000000;
                    font-family: Arial, Helvetica, sans-serif;

                    .post-title {
                        font-size: 20px;
                        margin-bottom: 5px;
                        font-weight: bold;
                    }

                    .post-metadata {
                        margin-top: 10px;
                        margin-bottom: 10px;

                        span {
                            margin-right: 10px;
                            background-color: #182347;
                            padding: 2px 5px;
                            border-radius: 3px;
                            font-size: 13px;
                        }
                    }

                    .post-description-part {
                        margin-top: 20px;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                        color: #868bb4;
                        font-size: 13px;
                    }
                }
            }
        }
    }

    // Create page
    .createform {
        position: relative;
        top: 100px;
        width: 80%;
        margin: auto;
        font-family: Arial, Helvetica, sans-serif;

        .title-wrapper {
            width: 100%;

            input {
                background-color: transparent;
                border: none;
                outline: 0;
                background-color: #161b3b;
                padding: 8px 15px;
                color: #d9d9d9;
                width: 100%;
                font-size: 16px;
                font-weight: bold;
                border-radius: 5px;
            }
        }

        .metadata-wrapper {
            display: flex;
            margin-top: 10px;

            .category {
                margin-right: 10px;

                select {
                    background-color: #161b3b;
                    border: none;
                    outline: 0;
                    color: #d9d9d9;
                    font-size: 16px;
                    padding: 8px 15px;
                    border-radius: 4px;
                }
            }

            .user-handle {

                input {
                    background-color: #161b3b;
                    border: none;
                    outline: 0;
                    padding: 10px 15px;
                    border-radius: 4px;
                    color: #d9d9d9;
                }
            }
        }

        .description-wrapper {
            width: 100%;
            margin-top: 20px;

            textarea {
                width: 100%;
                white-space: pre;
                background-color: #161b3b;
                border: none;
                outline: 0;
                padding: 10px 20px;
                color: #d9d9d9;
                font-size: 14px;
                border-radius: 3px;
            }
        }

        .submit-form-wrapper {
            margin-top: 20px;

            button {
                background-color: #161b3b;
                border: none;
                outline: 0;
                color: #d9d9d9;
                padding: 10px 35px;
                border-radius: 5px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;

                &:hover {
                    background-color: #202755;
                }
            }
        }
    }

    // login page - register page
    .form {
        position: relative;
        width: 100%;
        top: 150px;
        margin: auto;
        text-align: center;

        .header {
            margin-bottom: 20px;
            font-size: 20px;
            color: #4c5676;
        }

        .form-field {
            margin-bottom: 10px;

            input {
                width: 20rem;
                background-color: #182347;
                border: none;
                outline: 0;
                padding: 10px 15px;
                border-radius: 3px;
                color: #d9d9d9;
            }
        }

        .form-submit {
            margin-top: 20px;

            button {
                background-color: #182347;
                border: none;
                color: #d9d9d9;
                padding: 10px 20px;
                border-radius: 3px;
                cursor: pointer;

                &:hover {
                    background-color: #233164;
                }
            }
        }
    }

    .showpostpage {
        position: relative;
        top: 100px;
        // width: 80%;
        margin: auto;
        font-family: Arial, Helvetica, sans-serif;

        .post-display {
            display: flex;
            min-height: 200px;
            margin-bottom: 50px;

            .post-author-zone {
                position: relative;
                background-color: #1d2b59;
                padding: 20px 40px;
                border-top-left-radius: 7px;
                border-bottom-left-radius: 7px;

                .author-img-zone {

                    img {
                        width: 100px;
                        border-radius: 50%;
                        border: 3px solid #03d5ca;
                    }
                }

                .author-name-zone {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 18px;
                    color: #03d5ca;
                    font-weight: bold;
                }
            }

            .post-content-zone {
                width: 100%;
                position: relative;
                padding: 20px 50px;
                background-color: #161b3b;
                color: #d9d9d9;
                border-top-right-radius: 7px;
                border-bottom-right-radius: 7px;

                .post-content-description-zone {
                    white-space: pre;
                }
            }
        }

        .post-comment {
            display: flex;
            margin-top: 15px;

            &.post-new-comment {
                margin-top: 40px;
            }

            .comment-author {
                position: relative;
                background-color: #1d2b59;
                padding: 20px 55px;
                border-top-left-radius: 7px;
                border-bottom-left-radius: 7px;

                .comment-author-img {
                    img {
                        width: 70px;
                        border-radius: 50%;
                        border: 2px solid rebeccapurple;
                    }

                    &.owner {

                        img {
                            border: 2px solid #03d5ca !important;
                        }
                    }
                }

                .comment-author-name {
                    text-align: center;
                    color: rebeccapurple;
                    margin-top: 10px;
                    font-weight: bold;

                    &.owner {
                        color: #03d5ca !important;
                    }
                }

            }

            .comment-content {
                width: 100%;
                position: relative;
                padding: 20px 50px;
                background-color: #161b3b;
                color: #d9d9d9;
                border-top-right-radius: 7px;
                border-bottom-right-radius: 7px;

                .comment-content-description {
                    white-space: pre;
                }

                textarea {
                    background-color: #182347;
                    border: none;
                    outline: 0;
                    width: 100%;
                    padding: 20px 20px;
                    color: #d9d9d9;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    white-space: pre;
                    margin-bottom: 10px;
                    border-radius: 5px;
                }

                .post-comment-btn {
                    position: relative;
                    text-align: right;
                    background: #182347;
                    color: #d9d9d9;
                    border: none;
                    border-radius: 4px;
                    padding: 7px 10px;
                    font-size: 15px;
                    margin-left: 10px;
                    outline: 0;
                    cursor: pointer;
                    font-weight: bold;

                    &:hover {
                        background: #273972;
                    }
                }
            }
        }
    }

    .profilepage {
        position: relative;
        top: 150px;
        font-family: Arial, Helvetica, sans-serif;

        .container {
            
            
            .profile-form {
                display: flex;
                justify-content: center;

                .picture-display {
                    margin-right: 50px;

                    img {
                        width: 150px;
                        height: 150px;
                        border-radius: 50%;
                        border: 1px solid #444457
                    }
                }

                .picture-url-form-group {
                    display: flex;
                    align-items: center;
                    min-width: 400px;

                    label {
                        font-weight: bold;
                        color: #d9d9d9;
                        margin-right: 10px;
                    }

                    input {
                        width: 100%;
                        background-color: #161b3b;
                        border: none;
                        outline: 0;
                        padding: 10px;
                        color: #d9d9d9;
                        border-radius: 5px;
                    }
                }
            }

            .profile-form-submit {
                display: block;
                width: 100%;
                text-align: center;
                margin-top: 10px;

                button {
                    background: #182347;
                    color: #d9d9d9;
                    border: none;
                    border-radius: 4px;
                    padding: 7px 10px;
                    font-size: 15px;
                    margin-left: 10px;
                    outline: 0;
                    cursor: pointer;
                    font-weight: bold;

                    &:hover {
                        background: #273972;
                    }
                }
            }
        }
    }
}
</style>