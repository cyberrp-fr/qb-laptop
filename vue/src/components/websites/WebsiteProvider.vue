<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue'
import WebMapping from './webmap'

const props = defineProps(['website'])
const navigationUrl = ref(props.website)
const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter


const currentWebsite = ref()

function findWebsite(websiteUrl: string) {
    for (let i = 0; i < WebMapping.length; i++) {
        const website = WebMapping[i]
        if (website.matches.includes(websiteUrl)) {
            return website
        }
    }

    return null
}

function webNavigation() {
    if (navigationUrl == null) {
        return null
    }

    let website = findWebsite(navigationUrl.value)
    if (website != null) {
        emitter.emit('firefox/url/set', website.url)
        currentWebsite.value = website
        return website.component
    }

    return null
}

function navigate(url: string) {
    navigationUrl.value = url
    webNavigation()
}

onMounted(() => {
    emitter.on('firefox/navigate', navigate)
})

</script>

<template>
    <component v-if="currentWebsite != null" :is="webNavigation()" :data="currentWebsite.props" />
</template>