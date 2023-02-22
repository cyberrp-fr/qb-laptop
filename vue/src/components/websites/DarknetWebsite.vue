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
const formUserHandle = ref('')
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


// ===============
// == Functions ==
// ===============

function validateForm() {
    let violations: Array<any> = []
	formTitle.value = formTitle.value.trim()
	if (formTitle.value.length < 5) {
		violations.push({field: 'title', error: 'Le titre doit avoir 5 caracteres minimum.'})
	}

	formUserHandle.value = formUserHandle.value.trim()
	if (formUserHandle.value.length < 3) {
		violations.push({field: 'userHandle', error: 'l\'alias doit avoir 3 caracteres minimum.'})
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
		userHandle: formUserHandle.value,
		description: formDescription.value
	}
	await darknetStore.CreatePost(post)
    await darknetStore.GetPosts()
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
            <div class="post-wrapper">
                <div class="post">
                    <div class="post-title">Lorem Ipsum dolor</div>
                    <div class="post-metadata">
                        <span class="user-handle">0xIbra</span>
                        <span class="category">Hacking</span>
                    </div>
                    <div class="post-description-part">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit earum consequatur, illo ipsum voluptate quidem, vero, quaerat temporibus ab magnam ipsam? Error maiores eaque ut aliquam et deleniti consequatur consequuntur?
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit earum consequatur, illo ipsum voluptate quidem, vero, quaerat temporibus ab magnam ipsam? Error maiores eaque ut aliquam et deleniti consequatur consequuntur?
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit earum consequatur, illo ipsum voluptate quidem, vero, quaerat temporibus ab magnam ipsam? Error maiores eaque ut aliquam et deleniti consequatur consequuntur?
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
                    <div class="user-handle">
                        <input v-model="formUserHandle" type="text" placeholder="Alias">
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
    height: 100%;
    min-height: 1900px;
    background-color: rgb(11, 14, 32);
    overflow: scroll;

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
}
</style>