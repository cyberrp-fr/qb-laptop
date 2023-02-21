<script setup lang="ts">
// VUE
import { onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'

// Views
import Toolbar from '@/components/fixed/Toolbar.vue'
import DesktopWindows from '@/components/fixed/DesktopWindows.vue'
import ProgramIcon from './ProgramIcon.vue'

// Utils
import { useSettingsStore } from '@/stores/settings'
import { useStateStore } from '@/stores/state'
import { handleEvent } from '@/utils/BackendEventHandler'

const app = getCurrentInstance()
const fs = app?.appContext.config.globalProperties.$fs
const settingsStore = useSettingsStore()
const stateStore = useStateStore()

onMounted(() => {
  window.addEventListener("message", handleEvent)
  document.addEventListener("keydown", function(e) {
    if (e.keyCode === 27) {
      turnoffLaptop()
        .then(res => null)
    }
  })
})
onBeforeUnmount(() => {
  window.removeEventListener("message", handleEvent)
  // window.removeEventListener("keyup", )
})

async function turnoffLaptop() {
  if (stateStore.state.open) {
    // fetch("https://qb-laptop/TurnOffLaptop", {method: "POST"})
    //   .then(res => {
    //     stateStore.state.open = false
    //   })

    await settingsStore.save()
    await fetch('https://qb-laptop/TurnOffLaptop', { method: 'POST' })
    stateStore.state.open = false
  }
}

</script>

<template>
    <div id="laptop-desktop" :class="{'open': stateStore.state.open}" v-bind:style="stateStore.state.open ? {'background': `url(${settingsStore.settings.wallpaperUrl}) center no-repeat` } : {}">
      <Toolbar />
      <DesktopWindows />

      <div id="programs">
        <component :is="ProgramIcon" v-bind:key="program['id']" :id="program['id']" :name="program['name']" :program="program['id']" :focus="true" v-for="program in settingsStore.getInstalledPrograms()" />
      </div>
    </div>
</template>

<style scoped lang="scss">
#laptop-desktop {
  display: none;
  position: absolute;
  width: 85%;
  height: 85%;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  overflow: hidden;

  #programs {
    margin-top: 30px;
    padding: 10px 10px;
    display: flex;
    flex-direction: column;
  }
}

#laptop-desktop.open {
  display: block;
  background-size: cover !important;
}
</style>