import { useStateStore } from "@/stores/state"
import { useSettingsStore } from "@/stores/settings"

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

        default:
            throw new Error(`Unsupported action: ${event.data.action}`)
    }
}