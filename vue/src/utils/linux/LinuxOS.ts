import { getCurrentInstance } from 'vue'
import type LinuxFileSystem from './fs'

class Linux {
    public static readonly REGEX = {
        'ls': /^(\w+)\s*(-\w+)*\s*(\/?(\w+(\/\w+)*\/?)|\/|(\w+(\.\w+)?)?)?$/gi
    }

    private _fs: LinuxFileSystem
    private _history: Array<string>

    constructor () {
        this._history = []
        const app = getCurrentInstance()
        this._fs = app?.appContext.config.globalProperties.$fs
    }

    setFs(fs: any) {
        this._fs = fs
    }

    execute(output: any, command: string) {
        return this.handleCommand(output, command);
    }

    private _updateHistory(command: string) {

        if (!this._history.includes(command)) {
            this._history.push(command)
        }
        if (this._history.length > 20) {
            this._history.shift()
        }
    }

    getLastCommand() {
        return this._history[this._history.length - 1]
    }

    async handleCommand(output: string, command: string) {
        let split = command.split(' ')
        let cmd = split[0].trim()

        if (cmd == null || cmd == '') {
            return output += ' '
        }
        this._updateHistory(command)

        if (cmd === 'ls') {
            let pattern = new RegExp(Linux.REGEX['ls'])
            let matches: any = pattern.exec(command.trim())
            if (matches != null) {
                let result = this.list(matches[3])
                return output += result
            }
        } else if (cmd === 'cd') {
            let split = command.trim().split(' ')
            let path = split[1]

            let result = this.cd(path)
            if (result != null) {
                output += result
            }

            return output
        } else if (cmd === 'whereami') {
            return output += this._fs.getCurrentDirectory()
        }

        return output += `command not found: ${cmd}`
    }


    // =================
    // == FS Commands ==
    // =================


    public whereami() {
        return this._fs.getCurrentDirectory()
    }

    public list(path: string) {
        path = this._fs.emptyPath(path)

        if (path != null && !this._fs.isDir(path)) {
            return 'directory does not exist: ' + path
        }

        let dirs = this._fs.list(path)
        let result = ''
        if (dirs.length > 0) {
            result = dirs.join('<br>')
        }

        return result
    }

    public cd(path: string) {
        if (path == null) {
            path = '/'
        }
        if (!this._fs.isDir(path)) {
            return 'directory does not exist: ' + this._fs.joinPath(this._fs.getCurrentDirectory(), path)
        }

        try {
            this._fs.cd(path)
        } catch (e: any) {
            return e.toString()
        }
    }
}

const linuxInstance = new Linux()

export default linuxInstance