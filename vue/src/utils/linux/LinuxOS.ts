import FileSystem from '@/utils/linux/Filesystem'

class Linux extends FileSystem {
    public static readonly REGEX = {
        'ls': /^(\w+)\s*(-\w+)*\s*(\/?\w+(\/\w+)*\/?(\w+(\.\w+)?)?)?$/gi,
        'cd': /^(\w+)\s*(\/?\w+(\/\w+)*\/?)?$/gi
    }

    private _history: Array<string>

    constructor () {
        super()
        this._history = []
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
            let pattern = new RegExp(Linux.REGEX['cd'])
            let matches: any = pattern.exec(command.trim())
            if (matches != null) {
                this.cd(matches[2])
                return output
            }
        }

        return output += `command not found: ${cmd}`
    }
}

const linuxInstance = new Linux()

export default linuxInstance