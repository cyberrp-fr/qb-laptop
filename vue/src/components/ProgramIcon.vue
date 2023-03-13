<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue';

const props = defineProps(['id', 'program', 'name', 'focus'])

const icons: any = {
    'firefox': 'https://i.imgur.com/CwYZABb.png',
    'terminal': 'https://i.imgur.com/zyNd2Cc.png',
    'explorer': 'https://i.imgur.com/T8dFIIZ.png',
    'aes-msg': 'https://i.imgur.com/govaedU.png'
}

const imgPath = icons[props.program]

const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter;

function openProgram() {
    emitter.emit('desktop/openwindow', props.program)
}

</script>

<template>
    <div class="desktop-program-icon" @dblclick="openProgram">
        <div class="logo-container">
            <img :src="imgPath">
        </div>
        <div class="program-name">{{props.name}}</div>
    </div>
</template>

<style lang="scss">
.desktop-program-icon {
    font-family: 'Ubuntu Mono', sans-serif;
    color: rgb(241, 241, 241);
    padding: 10px 10px;
    max-width: 60px;
    cursor: pointer;
    border-radius: 5px;
    user-select: none;

    .logo-container {
        margin-bottom: 5px;
        text-align: center;
        user-select: none;

        img {
            user-select: none;
            width: 40px;
        }
    }

    .program-name {
        user-select: none;
        font-size: 15px;
        text-align: center;
        width: 100%;
    }

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    &:active {
        background-color: rgb(108, 172, 255);
    }
}
</style>