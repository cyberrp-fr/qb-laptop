<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, reactive } from 'vue'

// Window Components
import TerminalWindow from '@/components/windows/TerminalWindow.vue'
import ExplorerWindow from '../windows/ExplorerWindow.vue'
import SettingsWindow from '../windows/SettingsWindow.vue'
import FirefoxWindow from '../windows/FirefoxWindow.vue'

// Utils
import { useSettingsStore } from '@/stores/settings'
import { useStateStore } from '@/stores/state'

const settingsStore = useSettingsStore()
const stateStore = useStateStore()
// const windows: any = ref({})
const windows: any = reactive({})
const focusedWindowId = ref()

const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getComponentOfType(type: string) {
  if (type == 'terminal') {
    return TerminalWindow
  } else if (type == 'explorer') {
    return ExplorerWindow
  } else if (type == 'settings') {
    return SettingsWindow
  } else if (type == 'firefox') {
    return FirefoxWindow
  }

  return null
}

function openWindow(program: string) {
  let window = {
    type: program,
    component: () => getComponentOfType(program),
    id: 'window-' + uid(),
    render: true
  }

  windows[window.id] = window

  emitter.emit('toolbar/openwindow', {id: window.id, type: window.type})

  let app = getCurrentInstance()
  app?.proxy?.$forceUpdate()
}

function closeWindow(id: string) {
  delete windows[id]

  emitter.emit('toolbar/closewindow', id)

  let app = getCurrentInstance()
  app?.proxy?.$forceUpdate()
}

function refreshDesktop() {
  app?.proxy?.$forceUpdate()
}

function initBus() {
  emitter.on('desktop/openwindow', openWindow)
  emitter.on('desktop/closeWindow', closeWindow)
  emitter.on('desktop/refresh', refreshDesktop)
}

onMounted(() => {
    initBus()
})

</script>

<template>
  <component :is="window.component()" v-bind:key="id" :id="window.id" :focus="true" v-for="(window, id) in windows" />
</template>

<style lang="scss">

.open-windows {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.window-focused {
  z-index: 2 !important;
}

</style>