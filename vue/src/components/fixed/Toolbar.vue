<script setup lang="ts">
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

const settingsStore = useSettingsStore()

const windowsTabs: any = reactive({})
const focusWindowId = ref()
const linuxMenuOpen = ref(false)

function toggleLinuxMenu() {
    linuxMenuOpen.value = !linuxMenuOpen.value
}

function windowClick(e: any) {
    linuxMenuOpen.value = false

    let clickedProgram = e.target.getAttribute("data-action")
    if (clickedProgram == null) {
        return
    }

    emitter.emit("desktop/openwindow", { program: clickedProgram })
}

function setWindowFocus(windowId: string) {
    linuxMenuOpen.value = false
    focusWindowId.value = windowId
}

function newWindowTab(window: any) {
    windowsTabs[window.id] = window
    focusWindowId.value = window.id
}

function closeWindowTab(windowId: any) {
    delete windowsTabs[windowId]
}

function initEvents(): void {
    // emitter.on('toolbar/windowClick', handleWindowEvent)
    emitter.on('window/focus', setWindowFocus)
    emitter.on('toolbar/openwindow', newWindowTab)
    emitter.on('toolbar/closewindow', closeWindowTab)
}

function windowTabClick(windowId: any) {
    linuxMenuOpen.value = false

    emitter.emit('window/focus', windowId)
}

onMounted(() => {
    initEvents()
});

</script>

<template>
    <div id="toolbar">
        <div class="toolbar-item" @click="toggleLinuxMenu" :data-action="'linuxmenu'">
            <div class="linuxmenu item explorer">
                <img src="https://i.imgur.com/hHTNHTV.png">
            </div>
        </div>
        <div class="dividor"></div>
        <div class="toolbar-item" @click="windowClick" :data-action="'explorer'">
            <div class="item">
                <img src="https://i.imgur.com/T8dFIIZ.png" :data-action="'explorer'">
            </div>
        </div>
        <div class="toolbar-item" @click="windowClick" :data-action="'terminal'">
            <div class="item">
                <img src="https://i.imgur.com/3hn6fsJ.png" :data-action="'terminal'" />
            </div>
        </div>
        <div class="dividor"></div>

        <div id="openWindows">
            <div @click="windowTabClick(windowTab['id'])" v-bind:key="windowTab['id']" v-for="windowTab in windowsTabs" class="toolbar-window-tab" :class="{'active': windowTab['id'] == focusWindowId}" >{{windowTab['type']}}</div>
        </div>

        <!-- <div id="time">20:25</div> -->
    </div>

    <div class="linuxmenu" :class="{'active': linuxMenuOpen}" id="linuxmenu">
        <div class="linuxmenu-item" @click="windowClick" :data-action="'terminal'">
            <img src="https://i.imgur.com/3hn6fsJ.png" class="item-logo">
            <span class="item-label">Terminal</span>
        </div>

        <div class="linuxmenu-item" @click="windowClick" :data-action="'explorer'">
            <img src="https://i.imgur.com/T8dFIIZ.png" class="item-logo">
            <span class="item-label">Explorer</span>
        </div>

        <div v-if="settingsStore.alreadyInstalled('firefox')" class="linuxmenu-item" @click="windowClick" :data-action="'firefox'">
            <img src="https://i.imgur.com/CwYZABb.png" class="item-logo">
            <span class="item-label">Firefox</span>
        </div>

        <div v-if="settingsStore.alreadyInstalled('aes-msg')" class="linuxmenu-item" @click="windowClick" :data-action="'aes-msg'">
            <img src="https://i.imgur.com/govaedU.png" class="item-logo">
            <span class="item-label">AES Messaging</span>
        </div>

        <div class="linuxmenu-item" @click="windowClick" :data-action="'settings'">
            <img src="https://i.imgur.com/66vqfGw.png" class="item-logo">
            <span class="item-label">Paramètres</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
#toolbar {
    display: flex;
    width: 100%;
    height: 30px;
    background-color: rgba(25, 25, 25, 0.7);
    position: absolute;
    top: 0;
    align-items: center;
    font-family: 'Ubuntu Mono', sans-serif;
    z-index: 3;
}

.dividor {
    position: relative;
    width: 0px;
    height: 60%;
    border: 1px solid rgba(25, 25, 25, 0.7);
    margin: 0 3px;
}

#toolbar .toolbar-item {
    position: relative;
    top: 0;
    bottom: 0;
    height: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
}

#toolbar .toolbar-item:hover {
    background-color: rgba(25, 25, 25, 0.8);
}

#toolbar .item {
    width: 20px;
    height: 20px;
    /* padding: 5px 0px; */
    margin-left: 2px;
    margin-right: 3px;
    border-radius: 2px;
    cursor: pointer;
}

.item.explorer {
    background-color: rgb(9, 152, 228);
    /* width: 25px;
    height: 25px; */
}

.item img {
    width: 100%;
}

#openWindows {
    display: flex;
    max-width: 495px;
    overflow: hidden;

    .toolbar-window-tab {
        margin-left: 5px;
        color: rgb(228, 228, 228);
        // border: 1px solid rgba(20, 20, 20, 0.5);
        padding: 2px 5px;
        border-radius: 4px;
        background-color: rgba(204, 202, 202, 0.1);
        font-size: 14px;
        cursor: pointer;

        &:hover, &.active {
            background-color: rgba(204, 202, 202, 0.3);
        }
    }
}

#time {
    color: rgb(209, 209, 209);
    position: absolute;
    top: 7px;
    left: 0;
    right: 0;
    text-align: center;
}

#linuxmenu {
    display: none;
    background-color: rgba(25, 25, 25, 0.7);
    min-height: 300px;
    width: 300px;
    position: absolute;
    top: 30px;
    border-bottom-right-radius: 5px;
    font-family: 'Ubuntu Mono', sans-serif;
    transition: ease-in .3s;
    z-index: 50 !important;

    &.active {
        display: block !important;
    }

    .linuxmenu-item {
        display: flex;
        color: rgb(209, 209, 209);
        cursor: pointer;
        padding: 10px 15px;

        &:hover {
            background-color: rgba(25, 25, 25, 0.4);
        }

        .item-logo {
            width: 25px;
            pointer-events: none;
        }

        .item-label {
            line-height: 1.5;
            margin-left: 10px;
            pointer-events: none;

        }
    }
}

</style>