import { ref } from "vue"
import { defineStore } from "pinia"
import App from "@/main"
import type LinuxFileSystem from "@/utils/linux/fs"

export const useUsbStore = defineStore("usb", () => {
    const usbs = ref([])
    const rootPath = "/media/usb"
    const fs: LinuxFileSystem = App.config.globalProperties.$lfs

    function mount(usbs: any[]) {
        usbs = usbs

        fs.cd(rootPath)
        for (let i = 0; i < usbs.length; i++) {
            const usbItem = usbs[i]
            const name = "port_" + (i+1)

            const dirPath = rootPath + "/" + name
            if (!fs.isDir(dirPath)) {
                fs.mkdir(dirPath, null)
            }

            for (let j = 0; j < usbItem.info.data.contents.length; j++) {
                const { filename, path, size, data } = usbItem.info.data.contents[j];
                fs.writeFile(path, data)
            }
        }
    }

    function unmount() {
    }

    return {
        usbs,
        mount,
        unmount
    }
})
