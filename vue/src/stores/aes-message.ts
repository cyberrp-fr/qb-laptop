import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAesMessageStore = defineStore('aes-message', () => {
    const address = ref('hash@0000000000000')
    const discussions: any = ref({
        'hash@98237845243347457': {
            hash: 'hash@98237845243347457',
            messages: [
                {from: 'hash@834587345987345', to: 'hash@0000000000000', content: 'Hello !'},
                {from: 'hash@0000000000000', to: 'hash@834587345987345', content: 'Hi !'},
            ]
        }
    })

    function setAddress(addr: string) {
        address.value = addr
    }

    function setDiscussion(id: string, discussion: any) {
        discussion[id] = discussion
    }

    function receiveMessage(id: string, message: any) {
        if (discussions.value[id] != null) {
            discussions.value[id].messages.push(message)
        }
    }

    function getDiscussion(hash: string) {
        return discussions.value[hash]
    }

    async function newDiscussion(to: string, message: string) {
        const opts = {
            method: 'POST',
            body: JSON.stringify({
                to,
                from: address.value,
                message
            }),
            headers: {'Content-Type': 'application/json'}
        }
        const response = await fetch('https://qb-laptop/AESNewDiscussion', opts)
    }

    async function sendMessage(discussionId: string, message: string) {
        const opts = {
            method: 'POST',
            body: JSON.stringify({
                discussionId,
                from: address.value,
                message
            }),
            headers: {'Content-Type': 'application/json'}
        }
        const response = await fetch('https://qb-laptop/AESSendMessage', opts)
    }

    return {
        discussions,
        address,
        setAddress,
        setDiscussion,
        receiveMessage,
        getDiscussion,
        newDiscussion,
        sendMessage
    }
});