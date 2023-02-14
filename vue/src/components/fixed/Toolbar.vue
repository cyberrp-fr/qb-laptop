<script setup lang="ts">
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'

const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

const windowsTabs: any = reactive({})
const focusWindowId = ref()

function handleWindowEvent(event: any): void {
    console.log("toolbar/windowEv: ", event)
}

function windowClick(e: any) {
    let clickedProgram = e.target.getAttribute("data-action")
    if (clickedProgram == null) {
        return
    }

    emitter.emit("desktop/openwindow", clickedProgram)
}

function setWindowFocus(windowId: string) {
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
    emitter.on('toolbar/windowClick', handleWindowEvent)
    emitter.on('window/focus', setWindowFocus)
    emitter.on('toolbar/openwindow', newWindowTab)
    emitter.on('toolbar/closewindow', closeWindowTab)
}

function windowTabClick(windowId: any) {
    emitter.emit('window/focus', windowId)
}

onMounted(() => {
    initEvents()
});

</script>

<template>
    <div id="toolbar">
        <div class="toolbar-item" @click="windowClick" :data-action="'linuxmenu'">
            <div class="linuxmenu item explorer">
                <img src="@/assets/img/kali-vector.png">
            </div>
        </div>
        <div class="dividor"></div>
        <div class="toolbar-item" @click="windowClick" :data-action="'explorer'">
            <div class="item">
                <img src="@/assets/img/kali-folder-vector.png" :data-action="'explorer'">
            </div>
        </div>
        <div class="toolbar-item" @click="windowClick" :data-action="'terminal'">
            <div class="item">
                <img src="@/assets/img/kali-terminal-vector.png" :data-action="'terminal'" />
            </div>
        </div>
        <div class="dividor"></div>

        <div id="openWindows">
            <div @click="windowTabClick(windowTab['id'])" v-bind:key="windowTab['id']" v-for="windowTab in windowsTabs" class="toolbar-window-tab" :class="{'active': windowTab['id'] == focusWindowId}" >{{windowTab['type']}}</div>
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

</style>