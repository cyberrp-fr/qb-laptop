<script setup lang="ts">
import { ref } from 'vue'
import WebMapping from './webmap'

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
    }
}
</style>