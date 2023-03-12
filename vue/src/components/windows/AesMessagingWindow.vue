<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'

const props = defineProps(['id', 'focus'])
const windowFocus = ref(props.focus)
const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

// window position coords
const containerElem = ref()
const containerPos = ref({
    x: 0,
    y: 0,
    movementX: 0,
    movementY: 0
})

function windowClicked() {
    emitter.emit('window/focus', props.id)
}

// -----------------
// -- move window --
// -----------------
function elemDrag(e: any) {
    e.preventDefault()

    containerPos.value.movementX = (containerPos.value.x - e.clientX)
    containerPos.value.movementY = (containerPos.value.y - e.clientY)
    containerPos.value.x = e.clientX
    containerPos.value.y = e.clientY

    // set elem new position
    containerElem.value.style.top = (containerElem.value.offsetTop - containerPos.value.movementY) + 'px'
    containerElem.value.style.left = (containerElem.value.offsetLeft - containerPos.value.movementX) + 'px'
}
function closeElemDrag() {
    document.onmouseup = null
    document.onmousemove = null
}
function onWindowMove(e: any) {
    containerPos.value.x = e.clientX
    containerPos.value.y = e.clientY

    document.onmousemove = elemDrag
    document.onmouseup = closeElemDrag
}

// EVENT BUS
function focusWindow(id: string) {
    if (id === props.id) {
        windowFocus.value = true
    } else {
        windowFocus.value = false
    }
}

function initBus() {
    emitter.on('window/focus', focusWindow)
}

onMounted(() => {
    initBus()
})

// close window
function selfDestruct() {
    emitter.emit('desktop/closeWindow', props.id)
}
</script>

<template>
    <div ref="containerElem" @click="windowClicked" class="window aes-messaging-window resizable" :class="{'window-focused': windowFocus}">
        <div class="window-header" @mousedown="onWindowMove">
            <div class="logo">
                <img src="https://i.imgur.com/govaedU.png" class="window-logo">
                <div class="title">AES Messaging</div>
            </div>

            <div class="header-action-buttons">
                <div class="window-action window-action-minimize"></div>
                <div class="window-action window-action-close" @click="selfDestruct"></div>
            </div>
        </div>

        <div class="content">
            
        </div>
    </div>
</template>

<style scoped>

</style>