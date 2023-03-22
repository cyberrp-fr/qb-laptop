import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import App from "@/main"
import type LinuxFileSystem from "@/utils/linux/fs"


export const useStateStore = defineStore('state', () => {
    const state = ref({
        turnedOn: false,
        open: false,
        user: null as any
    });

    const fs: LinuxFileSystem = App.config.globalProperties.$lfs

    function setState(newState: any) {
        state.value = newState;
    }

    function setUser(user: string) {
        state.value.user = user
        fs.initUser(user)
    }

    return {
        state,
        setState,
        setUser
    }
});