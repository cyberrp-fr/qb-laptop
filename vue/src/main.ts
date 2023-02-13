import { createApp } from 'vue'
import { createPinia } from 'pinia'
import mitt from 'mitt';

import App from './App.vue'

import './assets/main.css'

const emitter = mitt()
const app = createApp(App)

app.use(createPinia())

app.config.globalProperties.$emitter = emitter
app.mount('#app')
