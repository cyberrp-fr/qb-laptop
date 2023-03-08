<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import WebMapping from './webmap'

const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

const navigation = ref('search')

// form fields
const searchQuery = ref('')
const queryResults = ref()

function prepareQuery(query: string) {
    let parts = query.split(' ')
    parts = parts.map(part => part.trim())

    return parts
}

function executeSearch() {
    navigation.value = 'results'

    let results: any[] = []

    for (let i = 0; i < WebMapping.length; i++) {
        let website = WebMapping[i]
        if (website.description == null) {
            continue
        }

        let queryWords = prepareQuery(searchQuery.value)
        for (let i = 0; i < queryWords.length; i++) {
            let word = queryWords[i]

            if (website.name.includes(word)) {
                results.push(website)
                break
            }

            if (website.description.includes(word)) {
                results.push(website)
                break
            }
        }
    }

    queryResults.value = results
}

function navigate(page: string) {
    navigation.value = page
}

function navigateWebsite(url: string) {
    emitter.emit('firefox/navigate', url)
}

</script>

<template>
    <div class="website">
        <div v-if="navigation == 'search'" class="search-page">
            <div class="search-form">
                <div class="google-brand">
                    <div class="brand">Google</div>
                </div>
                <div class="search-field-group">
                    <input v-model="searchQuery" v-on:keydown.enter="executeSearch" type="text" placeholder="Recherche...">
                </div>
                <div class="search-button-group">
                    <button @click="executeSearch" class="search">Google Search</button>
                </div>
            </div>
        </div>

        <div v-if="navigation == 'results'" class="results-page">
            <div class="header">
                <div @click="navigate('search')" class="google-brand">
                    <div @click="navigate('search')" class="brand">Google</div>
                </div>
                <div class="search-field-group">
                    <input v-model="searchQuery" v-on:keydown.enter="executeSearch" type="text" placeholder="Recherche...">
                </div>
            </div>

            <div class="results-content">
                <div v-for="result in queryResults" @click="navigateWebsite(result.url)" class="result">
                    <div class="title">{{ result.name }}</div>
                    <div class="url">{{ result.url }}</div>
                    <div class="description">{{ result.description }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.website {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #121212;

    .search-page {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        top: 30%;
        text-align: center;

        .search-form {
            width: 30%;
        }

        .google-brand {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 64px;
            font-weight: bolder;
            color: #d9d9d9;
            margin-bottom: 20px;
        }

        .search-field-group {
            input {
                border: none;
                outline: 0;
                background-color: #1e1e1e;
                padding: 10px 15px;
                width: 100%;
                border-radius: 20px;
                margin-bottom: 15px;
                color: #d9d9d9;
            }
        }

        .search-button-group {
            button {
                background-color: #1e1e1e;
                color: #d9d9d9;
                border: none;
                outline: 0;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;

                &:hover {
                    background-color: #272727;
                }
            }
        }
    }


    .results-page {
        position: absolute;
        width: 100%;
        height: 100%;

        .header {
            width: 100%;
            display: flex;
            padding: 15px 25px;
            border-bottom: 1px solid #1e1d1d;
            margin-bottom: 40px;

            .google-brand {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 38px;
                font-weight: bolder;
                color: #d9d9d9;
                margin-bottom: 20px;
                margin-right: 30px;
                cursor: pointer;
            }

            .search-field-group {
                width: 30%;
                input {
                    margin-top: 3px;
                    border: none;
                    outline: 0;
                    background-color: #1e1e1e;
                    padding: 10px 15px;
                    width: 100%;
                    border-radius: 20px;
                    margin-bottom: 15px;
                    color: #d9d9d9;
                }
            }
        }

        .results-content {
            padding: 5px 30px;
            font-family: Arial, Helvetica, sans-serif;

            .result {
                margin-bottom: 15px;
                cursor: pointer;

                .title {
                    font-weight: bold;
                    font-size: 18px;
                    color: #8ab4f8;
                }

                .url {
                    font-size: 14px;
                    margin-top: 3px;
                    margin-bottom: 10px;
                    color: rgb(181, 174, 164);
                }

                .description {
                    color: rgb(181, 174, 164);
                    font-size: 13px;
                }
            }
        }
    }
}
</style>