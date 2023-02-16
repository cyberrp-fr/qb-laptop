<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useDarknetStore } from '@/stores/darknet'

const categories = ref({
    'hacking': 'Hacking',
    'drugs': 'Drogues',
    'guns': 'Armes'
})
const selectedCategory = ref('')

// stores
const darknetStore = useDarknetStore()

onMounted(() => {
    darknetStore.GetPosts()
})

</script>

<template>
<div class="website">
    <div class="navbar">
        <div class="container">
            <div class="brand-container">
                <div class="brand-logo">
                    <img src="static/img/shadownet.png">
                </div>
                <div class="brand">Shadow<span class="highlight">NET</span></div>
            </div>
        </div>
    </div>

    <div class="maincontent">
        <div class="filters">
            <div class="category-filter-wrapper">
                <select v-model="selectedCategory" class="category-filter">
                    <option value="">Catégorie de posts</option>
                    <option v-for="(category, key, index) in categories" :value="key">{{ category }}</option>
                </select>
            </div>
        </div>

        <div class="posts"></div>
    </div>
</div>
</template>

<style scoped lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
}

.container {
    width: 90%;
    margin: auto;
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
    }

    .maincontent {
        position: relative;
        top: 100px;
        width: 87%;
        margin: auto;
        font-family: 'Ubuntu Mono', sans-serif;


        .filters  {

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
        }
    }
}
</style>