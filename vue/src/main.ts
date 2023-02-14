import { createApp } from 'vue'
import { createPinia } from 'pinia'
import mitt from 'mitt'

import { configure, install, BFSRequire } from 'browserfs'
import LinuxFileSystem from '@/utils/linux/fs'

import App from './App.vue'

import './assets/main.css'

install(window)
configure({
    fs: 'LocalStorage',
    options: null
}, (e: any) => {
    if (e) {
        throw e
    }
})

const fs = BFSRequire('fs')
const lfs = new LinuxFileSystem(fs)
lfs.init()

const emitter = mitt()
const app = createApp(App)

app.use(createPinia())

app.config.globalProperties.$emitter = emitter
app.config.globalProperties.$fs = lfs

app.mount('#app')
