<script setup lang="ts">
import { getCurrentInstance, ref, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';

const props = defineProps(['id', 'focus'])
const windowFocus = ref(props.focus)

const settingsStore = useSettingsStore()

const currentSidebarTab = ref('background')
const wallpaperUrl = ref('')

// window position coords
const containerElem = ref()
const containerPos = ref({
    x: 0,
    y: 0,
    movementX: 0,
    movementY: 0
})

const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

function focusWindow(id: string) {
    if (id === props.id) {
        windowFocus.value = true
    } else {
        windowFocus.value = false
    }
}

function windowClicked() {
    emitter.emit('window/focus', props.id)
}

function initBus() {
    emitter.on('window/focus', focusWindow)
}

onMounted(() => {
    initBus()
})

// change wallpaper
function changeWallpaper(url: string) {
    settingsStore.settings.wallpaperUrl = url
}

function downloadWallpaper() {
    try {
        new URL(wallpaperUrl.value)

        settingsStore.settings.wallpaperUrl = wallpaperUrl.value
    } catch (e: any) {}
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

// close window
function selfDestruct() {
    emitter.emit('desktop/closeWindow', props.id)
}
</script>

<template>
    <div ref="containerElem" @click="windowClicked" class="window explorer-window resizable" :class="{'window-focused': windowFocus}">
        <div class="window-header" @mousedown="onWindowMove">
            <div class="logo">
                <img src="@/assets/img/gear.png" class="window-logo">
                <div class="title">Paramètres</div>
            </div>

            <div class="header-action-buttons">
                <div class="window-action window-action-minimize"></div>
                <div class="window-action window-action-close" @click="selfDestruct"></div>
            </div>
        </div>

        <div class="content">
            <div class="content-container">
                <div class="sidebar">
                    <div class="sidebar-item">
                        <img src="@/assets/img/monitor.png" class="logo">
                        <div class="label">Fond d'écran</div>
                    </div>
                </div>
                <div class="main-content">
                    <div v-if="currentSidebarTab == 'background'" class="background-settings">

                        <div class="preview-zone">
                            <img draggable="false" :src="settingsStore.settings.wallpaperUrl" alt="" class="preview-img">
                        </div>
                        
                        <br />
                        <div class="w-100">
                            <div class="h-dividor"></div>
                        </div>

                        <div class="background-images">
                            <div v-for="img in settingsStore.settings.wallpaperSelection" @click="changeWallpaper(img)" class="img-item">
                                <img :src="img" draggable="false">
                            </div>
                        </div>

                        <div class="custom-background">
                            <input v-model="wallpaperUrl" type="text" placeholder="URL...">
                            <button @click="downloadWallpaper">Télécharger</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.window {
    position: absolute;
    width: 900px;
    height: 450px;
    border-radius: 5px;
    box-shadow: 0px 0px 20px 1px rgba(0,0,0,0.5);
    left: 20%;
    top: 20%;
    background-color: rgba(36, 42, 56, 1);
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

        .content-container {
            position: relative;
            display: flex;
            height: 100%;

            .sidebar {
                // background-color: #1b1e22;
                border-right: 1px solid #1b1e22;
                color: #d9d9d9;
                width: 20%;
                position: absolute;
                left: 0;
                height: 100%;
                font-size: 16px;
                padding-top: 10px;

                .sidebar-item {
                    padding: 10px 20px;
                    cursor: pointer;
                    display: flex;
                    font-size: 15px;
                    align-items: center;

                    &:hover {
                        background-color: #1b1e22;
                    }

                    .logo {
                        width: 20px;
                        margin-right: 10px;
                    }

                    .label {
                    }
                }
            }

            .main-content {
                position: absolute;
                width: 80%;
                top: 0;
                right: 0;

                .background-settings {
                    position: relative;
                    margin: auto;
                    display: block;

                    .preview-zone {
                        width: 100%;
                        margin: auto;
                        display: block;
                        text-align: center;
                        margin-top: 20px;

                        img {
                            width: 40%;
                        }
                    }

                    .background-images {
                        overflow: hidden;
                        display: block;
                        text-align: center;

                        .img-item {
                            display: inline-block;
                            cursor: pointer;

                            img {
                                width: 160px;
                            }
                        }
                    }

                    .custom-background {
                        margin-top: 30px;
                        text-align: center;
                        font-family: 'Ubuntu Mono', sans-serif;
                        margin-bottom: 30px;

                        input {
                            border: none;
                            background: #141820;
                            height: 25px;
                            border-top-left-radius: 4px;
                            border-bottom-left-radius: 4px;
                            width: 50%;
                            color: #d9d9d9;

                            &::placeholder {
                                padding-left: 5px;
                                color: #56537a;
                            }
                        }

                        button {
                            background-color: rgb(20, 24, 32);
                            border: none;
                            color: #d9d9d9;
                            height: 27px;
                            border-top-right-radius: 4px;
                            border-bottom-right-radius: 4px;
                            border-left: 1px solid #0d0f14;

                            cursor: pointer;

                            &:hover {
                                background-color: rgba(20, 24, 32, 0.3);
                            }
                        }
                    }
                }
            }
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