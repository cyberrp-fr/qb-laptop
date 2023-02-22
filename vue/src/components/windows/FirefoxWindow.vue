<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';
import WebsiteProvider from '../websites/WebsiteProvider.vue';

const props = defineProps(['id', 'focus'])
const windowFocus = ref(props.focus)
const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

// browser data
const url = ref('')
const navigationHistory = ref([])

function navigate() {
    emitter.emit('firefox/navigate', url.value)
    console.log('emit url: ', url.value)
}

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
<div ref="containerElem" @click="windowClicked" class="window explorer-window resizable" :class="{'window-focused': windowFocus}">
        <div class="window-header" @mousedown="onWindowMove">
            <div class="logo">
            </div>

            <div class="header-action-buttons">
                <div class="window-action window-action-minimize"></div>
                <div class="window-action window-action-close" @click="selfDestruct"></div>
            </div>
        </div>

        <div class="content">
            <div class="content-header">
                <div class="actions">
                    <div class="prev">{{ '<' }}</div>
                    <div class="next">></div>
                </div>
                <div class="urlbar">
                    <input v-model="url" v-on:keydown.enter="navigate" type="text" placeholder="Enter URL...">
                </div>
            </div>
            <div class="web-content">
                <WebsiteProvider />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.window {
    position: absolute;
    width: 100%;
    height: 100%;
    // border-radius: 5px;
    box-shadow: 0px 0px 20px 1px rgba(0,0,0,0.5);
    // left: 20%;
    // top: 20%;
    top: 30px;
    left: 0;
    background-color: #44296b;
    resize: both;
    overflow: hidden;
    font-family: 'Ubuntu Mono', sans-serif;
    font-size: 15px;

    &.resizable {
        resize: both;
    }

    .window-header {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        color: rgba(222, 222, 222, 0.9);

        .logo {
            display: flex;
            padding-left: 7px;

            img {
                width: 15px;
            }

            .title {
                margin-left: 10px;
            }
        }

        .header-action-buttons {
            padding-right: 15px;
            display: flex;
            justify-content: space-between;
            width: 30px;

            .window-action {
                border: none;
                outline: 0;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                position: relative;
                // top: 0;
                // left: 0;

                &:hover {
                    opacity: .6 !important;
                }

                &.window-action-close {
                    background-color: rgb(248, 58, 58);
                }

                &.window-action-minimize {
                    background-color: rgb(230, 200, 33);
                }
            }
        }
    }

    .content {
        position: absolute;
        width: 100%;
        height: calc(100% - 25px);
        left: 0;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: scroll;

        .content-header {
            display: flex;
            width: 95%;
            margin: auto;

            .actions {
                display: flex;
                margin-right: 20px;

                .prev, .next {
                    width: 40px;
                    height: 30px;
                    background-color: #27173d;
                    font-size: 22px;
                    color: #d9d9d9;
                    text-align: center;
                    cursor: pointer;
                    padding: 2px 1px;
                    line-height: 1.3;

                    &:hover {
                        background-color: #372552;
                    }
                }

                .prev {
                    border-top-left-radius: 3px;
                    border-bottom-left-radius: 3px;
                    border-right: 1px solid #1b1e22;
                }
                .next {
                    border-top-right-radius: 3px;
                    border-bottom-right-radius: 3px;
                }
            }

            .urlbar {
                width: 100%;

                input {
                    width: 70%;
                    background-color: #27173d;
                    border: none;
                    height: 28px;
                    border-radius: 4px;
                    color: #d9d9d9;
                    font-family: 'Ubuntu Mono', sans-serif;
                    font-size: 15px;
                    outline: 0;
                    padding: 3px 15px;

                    // &::placeholder {
                    //     padding-left: 10px;
                    // }

                    &:focus {
                        border: none;
                    }
                }
            }
        }

        .web-content {
            margin-top: 10px;
        }

        /* width */
        &::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        /* Track */
        &::-webkit-scrollbar-track {
            background: #1b1e22;
        }
        /* Handle */
        &::-webkit-scrollbar-thumb {
            background: #2f333a;
            border-radius: 10px;
        }
        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
            background: #474d58;
        }
    }
}
</style>
