<script setup lang="ts">
import { getCurrentInstance,  onMounted } from 'vue';

const app = getCurrentInstance();
const emitter = app?.appContext.config.globalProperties.$emitter;

function handleWindowEvent(event: any): void {
    console.log("toolbar/windowEv: ", event);
}

function init(): void {

}

function windowClick(e: any) {
    let clickedProgram = e.target.getAttribute("data-action");
    if (clickedProgram == null) {
        return;
    }

    emitter.emit("desktop/openwindow", clickedProgram);
}

onMounted(() => {
    emitter.on("toolbar/windowClick", handleWindowEvent)

    init();
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

        </div>
    </div>
</template>

<style scoped>
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
</style>