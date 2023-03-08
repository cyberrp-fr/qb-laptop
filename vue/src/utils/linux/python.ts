import { useSettingsStore } from "@/stores/settings"
import type LinuxFileSystem from './fs'

export default class Python {
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
        this._runPy(pycode)
    }

    private _output(text: string) {
        console.log('oout: ', this._outputCallback)
        this._outputCallback(text)
    }

    private _init() {
        function builtInRead(x: string) {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'"
            return Sk.builtinFiles["files"][x]
        }

        Sk.configure({
            output: (txt: string) => this._outputCallback(txt, false, false),
            read: builtInRead
        })
    }

    private async _runPy(code: string) {
        try {
            await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code))
        } catch (e) {
            this._outputCallback(`Error: ${e}`)
        }
    }
}