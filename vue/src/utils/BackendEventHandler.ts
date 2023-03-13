import { useStateStore } from "@/stores/state"
import { useSettingsStore } from "@/stores/settings"
import { useDarknetStore } from "@/stores/darknet"
import { useAesMessageStore } from "@/stores/aes-message"

// this function handles event messages regarding all the base actions (ex: change desktop wallpaper)
function handleBaseActions(event: any) {
    const stateStore = useStateStore()
    const settingsStore = useSettingsStore()

    switch(event.data.action) {
        case "settings/set":
            settingsStore.setSettings(event.data.settings)
            break
        case "turnon":
            stateStore.state.open = true
            stateStore.state.user = event.data.user
            break
        case "turnoff":
            stateStore.state.open = false
            break
    }
}

// this function handles event messages relating to the darknet website
function handleDarknetActions(event: any) {
    const darknetStore = useDarknetStore()

    switch(event.data.action) {
        case "darknet/post/replies/set":
            darknetStore.setRepliesForPost(event.data.postId, event.data.replies)
            break
        case "darknet/posts/set":
            darknetStore.SetPosts(event.data.posts)
            break
    }
}

// handles event messages related to AES Messaging program
function handleAesMessagingActions(event: any) {
    const aesStore = useAesMessageStore()

    switch (event.data.action) {
        case "aes-messaging/receive":
            aesStore.receiveMessage(event.data.discussionId, event.data.discussionMessage)
            break
    }
}

// All messages sent from back-end, go through this function.
// It distributes the received event message to approriate handler
export function handleEvent(event: any) {
    if (event == null || event.data == null || event.data.action == null) {
        return
    }

    switch(event.data.action) {
        case "settings/set":
        case "turnon":
        case "turnoff":
            handleBaseActions(event)
            break

        case "darknet/post/replies/set":
        case "darknet/posts/set":
            handleDarknetActions(event)
            break

        case "aes-messaging/receive":
            handleAesMessagingActions(event)
            break

        default:
            throw new Error(`Unsupported action: ${event.data.action}`)
    }
}