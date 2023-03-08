import { useSettingsStore } from "@/stores/settings"
import type LinuxFileSystem from './fs'

export default class Python {
    private _outputCallback: any

    private _settingsStore: any

    private _fs: LinuxFileSystem

    constructor(fs: LinuxFileSystem) {
        this._fs = fs
        this._settingsStore = useSettingsStore()
    }

    public setOutputCallback(cb: any) {
        this._outputCallback = cb
    }

    public handleCommand(command: string, cmd: string) {
        if (!this._settingsStore.alreadyInstalled('python')) {
            this._outputCallback('Python is not installed on your system.\nRun `sudo apt install python` if you want to install it.')
            return
        }

        let split = command.split(' ')
        let bin = split[0]
        let file = split[1]

        if (file == null || file == '') {
            this._outputCallback('Error: no execute file provided.')
            return
        }

        if (!this._fs.exists(file)) {
            this._outputCallback(`file "${file}" not found.`)
            return
        }

        let pycode = this._fs.read(file)
        console.log("Pycode: ", pycode)

        console.log("SKULPT: ", SK)
    }
}