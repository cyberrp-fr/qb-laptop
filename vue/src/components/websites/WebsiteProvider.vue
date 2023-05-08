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

async function webNavigation() {
    if (navigationUrl.value == null) {
        return null
    }

    currentWebsite.value = null

    await new Promise(resolve => setTimeout(resolve, 200))

    // check if valid url or google search
    const urlRegex = /^(https?:\/\/|tor:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?$/i
    if (urlRegex.test(navigationUrl.value) === false) {

        const googleWebsite: any = WebMapping[0]
        googleWebsite.props = {
            search: navigationUrl.value
        }

        currentWebsite.value = googleWebsite
        return googleWebsite.component
    }

    let website = findWebsite(navigationUrl.value)
    if (website != null) {
        emitter.emit('firefox/url/set', website.url)
        currentWebsite.value = website
        return website.component
    }

    currentWebsite.value = {
        name: 'Could not find website',
        url: navigationUrl.value,
        props: {
            url: navigationUrl.value
        },
        component: NotFound
    }
    emitter.emit('firefox/url/set', currentWebsite.value.url)

    return NotFound
}

function navigate(url: string) {
    if (url == "") {
        return
    }

    navigationUrl.value = url
    webNavigation()
}

onMounted(() => {
    emitter.on('firefox/navigate', navigate)
})

</script>

<template>
    <component v-if="currentWebsite != null" :is="currentWebsite.component" :data="currentWebsite.props" />
</template>