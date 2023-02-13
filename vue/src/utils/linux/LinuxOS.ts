import FileSystem from '@/utils/linux/Filesystem'

class Linux {
    public static readonly COMMANDS = {
        'cd': true,
        'ls': true,
    }

    private _fs: FileSystem

    constructor() {
        this._fs = new FileSystem()
    }

    execute(output: any, command: string) {
        return this.handleCommand(output, command);
    }

    async handleCommand(output: string, command: string) {
        let split = command.split(' ')
        let cmd = split[0].trim()

        if (cmd == null || cmd == '') {
            return output += ' '
        }

        if (['ls', 'cd', 'nano'].includes(cmd)) {
            let result = this._fs.handleCommand(command)
            return output += result
        }

        if (['clear', 'cls'].includes(cmd)) {
            return ''
        }

        return output += `command not found: ${cmd}`
    }
}

const linuxInstance = new Linux()

export default linuxInstance