import { useSettingsStore } from "@/stores/settings"
import type LinuxFileSystem from './fs'

export default class NodeJS {
    private _outputCallback: any

    private _settingsStore: any

    private _fs: LinuxFileSystem

    constructor(fs: LinuxFileSystem) {
        this._fs = fs
        this._settingsStore = useSettingsStore()

        this._init()
    }

    public setOutputCallback(cb: any) {
        this._outputCallback = cb
    }

    public handleCommand(command: string, cmd: string) {
        if (!this._settingsStore.alreadyInstalled('nodejs')) {
            this._outputCallback('NodeJS is not installed on your system.\nRun `sudo apt install nodejs` if you want to install it.')
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

        let jscode = this._fs.read(file)
        this._execjs(jscode)
    }

    private _output(text: string) {
        console.log('oout: ', this._outputCallback)
        this._outputCallback(text)
    }

    private _init() {
        
    }

    private async _execjs(code: string) {
        code = `
        const consoleLog = console.log;
        console.log = (...args) => {
            self.postMessage({ type: 'log', message: args.join(' ') });
            consoleLog.apply(console, args);
        };



        ` + code

        console.log("exec: ", code)

        const blob = new Blob([code], { type: "application/javascript" })
        const worker = new Worker(URL.createObjectURL(blob))

        worker.onmessage = (e) => {
            console.log('edata: ', e.data)
            this._outputCallback(e.data.message)
        }
    }
}