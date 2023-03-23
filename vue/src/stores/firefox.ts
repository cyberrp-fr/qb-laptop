import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFirefoxStore = defineStore('firefox', () => {
    const downloadHistory = ref([
        {name: 'data.csv', size: 188374, path: '/home/0xIbra/Downloads/data.csv'}
    ])

    return {
        downloadHistory
    }
})