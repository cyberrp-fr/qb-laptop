import { ref } from "vue"
import { defineStore } from "pinia"
import App from "@/main"
import type LinuxFileSystem from "@/utils/linux/fs"

export const useUsbStore = defineStore("usb", () => {
    const usbs = ref()
    const rootPath = "/media/usb"
    const fs: LinuxFileSystem = App.config.globalProperties.$lfs

    function mount(usbData: any[]) {
        usbs.value = usbData

        fs.cd(rootPath)
        for (let i = 0; i < usbs.value.length; i++) {
            const usbItem = usbs.value[i]
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

    function referencePaths(result: any) {
        const rootPathRegex = /\/media\/usb\/port_[1-9]/g

        result.path = result.path.replace(rootPathRegex, '')
        if (result.path === '') {
            result.path = '/'
        }

        for (let i = 0; i < result.contents.length; i++) {
            const item = result.contents[i]
            item.path = item.path.replace(rootPathRegex, '')

            if (item.contents != null) {
                item.contents = referencePaths(item.contents)
            }

            result.contents[i] = item
        }

        return result
    }

    async function unmount() {

        for (let i = 0; i < usbs.value.length; i++) {
            const usb = usbs.value[i]

            const path = fs.joinPath(rootPath, "port_" + (i+1))
            let result = fs.rlist(path)
            // result = referencePaths(result)
            
            console.log('rlist: ', result, usb)
        }
    }

    return {
        usbs,
        mount,
        unmount
    }
})
