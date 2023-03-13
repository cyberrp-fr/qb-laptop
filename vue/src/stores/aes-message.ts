import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAesMessageStore = defineStore('aes-message', () => {
    const address = ref('hash@34858345734578')
    const discussions: any = ref({
        'hash@98237845243347457': [
            {from: 'hash@834587345987345', to: 'hash@34858345734578', content: 'Hello !'},
            {from: 'hash@34858345734578', to: 'hash@834587345987345', content: 'Hi !'},
        ]
    })

    function receiveMessage(id: string, message: any) {
        if (discussions.value[id] != null) {
            discussions.value[id].push(message)
        } else {
            discussions.value[id] = [message]
        }
    }

    function getDiscussion(hash: string) {
        return discussions.value[hash]
    }

    return {
        discussions,
        address,
        receiveMessage,
        getDiscussion
    }
});