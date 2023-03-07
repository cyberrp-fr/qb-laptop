<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue'
import NotFound from './NotFound.vue'
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

    currentWebsite.value = {
        name: 'Could not find website',
        url: navigationUrl,
        props: {
            url: navigationUrl
        }
    }
    emitter.emit('firefox/url/set', currentWebsite.value.url)

    return NotFound
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