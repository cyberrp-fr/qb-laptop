<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue'
import LinuxOS from '@/utils/linux/LinuxOS'
import LinuxFileSystem from '@/utils/linux/fs'
import { useSettingsStore } from '@/stores/settings'

const Linux = new LinuxOS()
const fs = new LinuxFileSystem()

// window id and window focus
const props = defineProps(['id', 'focus', 'data'])
const windowFocus = ref(props.focus)

console.log('explorer props focus: ', props.focus)
console.log('explorer focus: ', windowFocus.value)

const settingsStore = useSettingsStore()

// window position coords
const containerElem = ref()
const containerPos = ref({
    x: 0,
    y: 0,
    movementX: 0,
    movementY: 0
})

// options menu (right click)
const optionsMenuElem = ref()
const optionsMenuPos = ref({
    x: 0,
    y: 0
})
const optionsMenuActive = ref(false)

const focusedObject = ref()

const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

const currentDirectory = ref('')
const currentDirectoryContent = ref()

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
    Linux.setFs(app?.appContext.config.globalProperties.$fs)
    fs.setFs(app?.appContext.config.globalProperties.$fs)

    currentDirectory.value = Linux.whereami()
    currentDirectoryContent.value = Linux.explorer()
    initBus()

    // initial path
    console.log("props data: ", props.data)
    if (props.data != null && props.data.path != null) {
        goto(props.data.path)
    }
})

// explorer
const explorerHistory = ref([Linux.whereami()])
const explorerHistoryIndex = ref(explorerHistory.value.length - 1)

function goto(path: string) {
    Linux.cd(path)
    currentDirectory.value = Linux.whereami()
    currentDirectoryContent.value = Linux.explorer()

    if (!explorerHistory.value.includes(path)) {
        explorerHistory.value.push(path)
        explorerHistoryIndex.value = explorerHistory.value.length - 1
    }
}

function prev() {
    let prevIndex = explorerHistoryIndex.value - 1
    if (prevIndex >= 0 && explorerHistory.value[prevIndex] != null) {
        let path = explorerHistory.value[prevIndex]
        goto(path)
        explorerHistoryIndex.value = prevIndex
    }
}

function next() {
    let nextIndex = explorerHistoryIndex.value + 1
    if (nextIndex > 0 && explorerHistory.value[nextIndex] != null) {
        let path = explorerHistory.value[nextIndex]
        goto(path)
        explorerHistoryIndex.value = nextIndex
    }
}

function onExplorerItemClick(e: any) {
    let target = e.target
    if (target != null) {
        let type = target.getAttribute('data-type')
        let path = target.getAttribute('data-dir-path')

        if (type !== 'dir') {
            return
        }

        goto(path)
    }
}

function refreshExplorer() {
    goto(currentDirectory.value)
}


// ----------------------
// -- copy, cut, paste --
// ----------------------

function copy() {
    if (focusedObject.value != null) {
        settingsStore.setClipboard({
            action: 'cp',
            type: focusedObject.value.type,
            path: focusedObject.value.path
        })

        console.log('copy: ', settingsStore.getClipboard())
    }

    optionsMenuActive.value = false
}

function cut() {
    if (focusedObject.value != null) {
        settingsStore.setClipboard({
            action: 'mv',
            type: focusedObject.value.type,
            path: focusedObject.value.path
        })
    }

    optionsMenuActive.value = false
}

function paste() {
    if (settingsStore.getClipboard() != null) {
        const { action, type, path } = settingsStore.getClipboard()
        if (action === 'mv' && path == currentDirectory.value) {
            settingsStore.setClipboard(null)
            return
        }

        const split = path.split('/')
        const basename = split[split.length -1]
        const destination = fs.joinPath(currentDirectory.value, basename)

        if (action == 'mv') {
            fs.mv(path, destination)
            refreshExplorer()
            settingsStore.setClipboard(null)

            return
        }

        if (action == 'cp') {
            fs.cpr(path, destination)
            refreshExplorer()

            return
        }
    }
}

function deleteObject() {
    if (focusedObject.value != null) {
        if (fs.isDir(focusedObject.value.path)) {
            fs.rmr(focusedObject.value.path)
        } else {
            fs.rm(focusedObject.value.path)
        }

        focusedObject.value = null

        refreshExplorer()
    }
}

function rightClick(e: any) {
    if (e.button === 2) {
        const path = e.target.getAttribute("data-dir-path")
        const type = e.target.getAttribute("data-type")
        if (type != null) {
            focusedObject.value = {
                type,
                path
            }
        } else {
            focusedObject.value = null
        }

        optionsMenuActive.value = true
        optionsMenuElem.value.style.top = e.layerY + 'px'
        optionsMenuElem.value.style.left = e.layerX + 'px'
    } else {
        optionsMenuActive.value = false
    }
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

function getKey(e: any) {
    console.log(e)
}
</script>

<template>
    <div ref="containerElem" @click="windowClicked" class="window explorer-window resizable" :class="{'window-focused': windowFocus}">
        <div class="window-header" @mousedown="onWindowMove">
            <div class="logo">
                <img src="https://i.imgur.com/T8dFIIZ.png" class="window-logo">
                <div class="title">Explorer</div>
            </div>

            <div class="header-action-buttons">
                <div class="window-action window-action-minimize"></div>
                <div class="window-action window-action-close" @click="selfDestruct"></div>
            </div>
        </div>

        <div class="content">
            <div class="explorer-toolbar">
                <div @click="prev" class="prev">{{ '<' }}</div>
                <div @click="next" class="next">></div>
                <div class="path">
                    <input v-on:keyup.enter="goto(currentDirectory)" v-model="currentDirectory" type="text" placeholder="/home/user/">
                </div>
            </div>
            <div @mousedown="rightClick" class="explorer-content">
                <div ref="optionsMenuElem" class="options-float-menu" :class="{'active': optionsMenuActive}">
                    <div class="option" @mousedown="refreshExplorer">Actualiser</div>
                    <div v-if="focusedObject != null" @mousedown="copy" class="option">Copier</div>
                    <div v-if="focusedObject != null" @mousedown="cut" class="option">Couper</div>
                    <div v-if="settingsStore.getClipboard() != null" @mousedown="paste" class="option">Coller</div>
                    <div v-if="focusedObject != null" @mousedown="deleteObject" class="option">Supprimer</div>
                    <div class="option">Nouveau dossier</div>
                </div>
                <!-- <div class="sidebar">
                    <div class="list-dir-item">Documents</div>
                    <div class="list-dir-item">Desktop</div>
                    <div class="list-dir-item">Downloads</div>
                </div> -->
                <div class="directory-content">
                    <div v-for="item in currentDirectoryContent" class="item" @click="onExplorerItemClick" @mousedown="rightClick" :data-type="item.type" :data-dir-path="item.fullPath">
                        <img v-if="item.type == 'dir'" :data-type="item.type" :data-dir-path="item.fullPath" src="https://i.imgur.com/T8dFIIZ.png">
                        <img v-if="item.type == 'file'" :data-type="item.type" :data-dir-path="item.fullPath" src="https://i.imgur.com/bDpDN9T.png">
                        <div :data-type="item.type" :data-dir-path="item.fullPath" class="label">{{ item.filename }}</div>
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

        .explorer-toolbar {
            display: flex;
            width: 100%;
            padding: 0px 10px;
            margin-bottom: 10px;

            .prev, .next {
                width: 40px;
                height: 25px;
                background-color: #474d58;
                font-size: 22px;
                color: #d9d9d9;
                text-align: center;
                cursor: pointer;

                &:hover {
                    background-color: #23262b;
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

            .path {
                margin-left: 20px;
                font-family: 'Ubuntu Mono', sans-serif;

                input {
                    background-color: #1b1e22;
                    border: none;
                    outline: 0;
                    height: 25px;
                    margin: 0 !important;

                    width: 15rem;
                    border-radius: 3px;
                    color: #d9d9d9;
                    padding: 0 5px;
                }
            }
        }

        .explorer-content {
            position: relative;
            display: flex;
            height: 100%;

            .options-float-menu {
                position: absolute;
                display: none;
                width: 150px;
                // top: 50px;
                // left: 200px;
                color: #d9d9d9;
                background-color: #1b1e22;
                border-radius: 4px;

                &.active {
                    display: block !important;
                }

                .option {
                    padding: 5px 10px;
                    cursor: pointer;

                    &:hover {
                        background-color: #4b5ab9 !important;
                    }
                }
            }

            .sidebar {
                // background-color: #1b1e22;
                border-right: 1px solid #1b1e22;
                color: #d9d9d9;
                width: 15%;
                position: absolute;
                left: 0;
                height: 100%;
                font-size: 16px;

                .list-dir-item {
                    padding: 10px 20px;
                    cursor: pointer;

                    &:hover {
                        background-color: #1b1e22;
                    }
                }
            }

            .directory-content {
                padding: 10px 20px;
                display: block;
                color: #d9d9d9;

                .item {
                    display: inline-block !important;
                    margin: 0 10px;
                    margin-bottom: 10px;
                    padding: 5px 10px;
                    display: block;
                    text-align: center;
                    border-radius: 5px;
                    cursor: pointer;

                    &:active {
                        background-color: rgb(71, 132, 247);
                    }

                    img {
                        width: 50px;
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