<script setup lang="ts">
const props = defineProps(['data'])
const { url } = props.data
</script>

<template>
    <iframe v-if="url != null" :src="url" sandbox="allow-scripts" frameborder="0"></iframe>
</template>

<style scoped>
iframe {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>