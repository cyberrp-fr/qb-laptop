import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAesMessageStore = defineStore('aes-message', () => {
    const address = ref('hash@0000000000000')
    const discussions: any = ref({})

    function setAddress(addr: string) {
        address.value = addr
    }

    function setDiscussion(discussion: any) {
        discussions.value[discussion.discussionId] = discussion
    }

    function receiveMessage(id: string, message: any) {
        if (discussions.value[id] != null) {
            discussions.value[id].messages.push(message)
        }
    }

    function getDiscussion(hash: string) {
        return discussions.value[hash]
    }

    function getStartedDiscussion(to: string) {
        let values = Object.values(discussions.value)
        for (let i = 0; i < values.length; i++) {
            const discussion: any = values[i]
            if (discussion.from === address.value && discussion.to === to) {
                return discussion
            }
        }

        return null
    }

    async function newDiscussion(to: string, message: string) {
        const opts = {
            method: 'POST',
            body: JSON.stringify({
                to,
                from: address.value,
                messages: [{ from: address.value, to, content: message }]
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
        address,
        discussions,
        setAddress,
        setDiscussion,
        receiveMessage,
        getDiscussion,
        getStartedDiscussion,
        newDiscussion,
        sendMessage
    }
});