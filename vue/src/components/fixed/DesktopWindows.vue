<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, reactive } from 'vue'

// Window Components
import TerminalWindow from '@/components/windows/TerminalWindow.vue'

// Utils
import { useSettingsStore } from '@/stores/settings'
import { useStateStore } from '@/stores/state'

const settingsStore = useSettingsStore()
const stateStore = useStateStore()
// const windows: any = ref({})
const windows: any = reactive({})

const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getComponentOfType(type: string) {
  if (type == 'terminal') {
    return TerminalWindow
  }

  return null
}

function openWindow(program: string) {
  let window = {
    type: program,
    component: () => getComponentOfType(program),
    id: 'window-' + uid()
  }

  windows[window.id] = window

  let app = getCurrentInstance()
  app?.proxy?.$forceUpdate()
}

function closeWindow(id: string) {
  delete windows[id]

  let app = getCurrentInstance()
  app?.proxy?.$forceUpdate()

}

function initBus() {
  emitter.on('desktop/openwindow', openWindow)
  emitter.on('desktop/closeWindow', closeWindow)
}

onMounted(() => {
    initBus()
})

</script>

<template>
  <component :is="window.component()" :id="window.id" v-for="(window, id, i) in windows" />
</template>

<style scoped lang="scss">

.open-windows {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

</style>