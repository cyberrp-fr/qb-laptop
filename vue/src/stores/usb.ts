import { ref } from "vue"
import { defineStore } from "pinia"
import App from "@/main"
import type LinuxFileSystem from "@/utils/linux/fs"
import { type } from "os"

export const useUsbStore = defineStore("usb", () => {
    const usbs = ref()
    const rootPath = "/media/usb"
    const fs: LinuxFileSystem = App.config.globalProperties.$lfs

    function createDirs(mountPath: string, dirItem: any) {
        fs.mkdir(fs.joinPath(mountPath, dirItem.path), null)

        for (let i = 0; i < dirItem.contents.length; i++) {
            const item = dirItem.contents[i]
            if (item.type === 'file') {
                fs.writeFile(fs.joinPath(mountPath, item.path), item.data)
            } else if (item.type === 'dir') {
                createDirs(mountPath, item)
            }
        }
    }

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
                const item = usbItem.info.data.contents[j]
                if (item.type === 'file') {
                    fs.writeFile(fs.joinPath(dirPath, item.path), item.data)
                } else if (item.type === 'dir') {
                    createDirs(dirPath, item)
                }
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
            let item = result.contents[i]
            item.path = item.path.replace(rootPathRegex, '')

            if (item.contents != null) {
                item = referencePaths(item)
            }

            result.contents[i] = item
        }

        return result
    }

    async function unmount() {
        if (Array.isArray(usbs.value) && usbs.value.length > 0) {
            let payload: any[] = []

            for (let i = 0; i < usbs.value.length; i++) {
                const usb = usbs.value[i]
                const name = 'port_' + (i+1)
                const mountPoint = fs.joinPath(rootPath, name)

                let result = fs.rlist(mountPoint)
                result = referencePaths(result)

                usb.info.data = result
                payload.push(usb)

                // remove local dir
                fs.rmr(mountPoint)
            }

            const opts = {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {'Content-Type': 'application/json'}
            }
            await fetch('https://qb-laptop/UnmountUSBs', opts)

            usbs.value = []
        }
    }

    return {
        usbs,
        mount,
        unmount
    }
})
