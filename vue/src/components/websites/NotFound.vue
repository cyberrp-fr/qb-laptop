<script setup lang="ts">
import { onMounted, getCurrentInstance, ref } from 'vue'

const url = ref()
const props = defineProps(['data'])
url.value = props.data.url


const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

onMounted(() => {
    emitter.on('firefox/url/set', (newUrl: string) => {
        url.value = newUrl
    })
})
</script>

<template>
    <div class="container">
        <div class="center">
            <h2>Hum, nous ne parvenons pas à trouver ce site.</h2>
            <div class="sub">Verifiez l'URL pour une erreur: <span class="strong">{{ url }}</span></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.strong {
    font-weight: bold !important;
}
.container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background-color: #1b0f2a;
    font-family: Arial, Helvetica, sans-serif;

    .center {
        padding-top: 10rem;
        color: #d9d9d9;

        h2 {
            font-weight: bolder;
            font-size: 24px;
            padding: 0px !important;
            margin: 0 !important;
            margin-bottom: 15px !important;
        }
    }
}
</style>