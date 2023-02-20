import LinuxFileSystem from './fs'
import APT from './apt'

class Linux {
    public static readonly REGEX = {
        'ls': /^(\w+)\s*(-\w+)*\s*(\/?(\w+(\/\w+)*\/?)|\/|(\w+(\.\w+)?)?)?$/gi,
        'mkdir': /^(mkdir)\s+(-p\s+)?([\.\/a-z1-9]+)/gi
    }

    private _fs: LinuxFileSystem
    private _apt: APT
    private _history: Array<string>
    private _outputcallback: any

    constructor () {
        this._history = []
        this._fs = new LinuxFileSystem()
        this._apt = new APT()        
        this._outputcallback = null
    }

    setFs(fs: any) {
        this._fs.setFs(fs)
    }

    setOutputCallback(cb: any) {
        this._outputcallback = cb
        this._apt.setOutputCallback(cb)
    }

    execute(command: string) {
        return this.handleCommand(command);
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

    async handleCommand(command: string) {
        let split = command.split(' ')
        split = split.map(str => str.trim())
        command = split.join(' ')
        let cmd = split[0]

        if (cmd == null || cmd == '') {
            this._outputcallback(' ')
            return
        }
        this._updateHistory(command)

        console.log('command: ', command)

        if (cmd === 'ls') {
            let pattern = new RegExp(Linux.REGEX['ls'])
            let matches: any = pattern.exec(command.trim())
            if (matches != null) {
                let result = this.list(matches[3])
                this._outputcallback(result)
                return
            }
        } else if (cmd === 'cd') {
            let split = command.trim().split(' ')
            let path = split[1]

            let result = this.cd(path)
            if (result != null) {
                this._outputcallback(result)
            }

            return
        } else if (cmd === 'whereami') {
            this._outputcallback(this._fs.getCurrentDirectory())
            return
        } else if (cmd === 'mkdir') {
            let pattern = new RegExp(Linux.REGEX['mkdir'])
            let matches: any = pattern.exec(command.trim())
            if (matches != null) {
                let path = matches[3]
                let mode = matches[2]
                let result = this.mkdir(path, mode)
                if (result != null) {
                    this._outputcallback(result)
                }

                return
            }
        } else if (cmd === 'rm') {
            let split = command.trim().split(' ')
            let path

            if (split.length == 2) {
                path = split[1]
            } else {
                path = split[2]
            }

            if (path == null || path == '') {
                this._outputcallback('rm: missing operand')
                return
            }

            let result = this.rm(path)
            if (result != null) {
                this._outputcallback(result)
            }

            return
        } else if (cmd === 'cat') {
            let split = command.trim().split(' ')
            let path = split[1]
            if (path == null) {
                this._outputcallback('command incorrect, path argument required.')
                return
            }

            let result = this.read(path)
            this._outputcallback(result)
            return
        } else if (split.includes('apt')) {
            this._apt.handleCommand(command, cmd)
            return
        }

        this._outputcallback(`command not found: ${cmd}`)
        return
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

    mkdir(path: string, mode: any) {
        path = path.trim()
        if (path == '/' || path == '') {
            return
        }

        if (this._fs.isDir(path)) {
            return "mkdir: cannot create directory ‘"+ path +"’: File exists"
        }

        this._fs.mkdir(path, mode)
    }

    rm(path: string) {
        path = path.trim()
        if (path == '/' || path == '') {
            return 
        }

        try {
            this._fs.rm(path)
            return
        } catch (e: any) {
            return e.toString()
        }
    }

    cat(path: string) {
        if (this.exists(path) && !this._fs.isDir(path)) {
            return this.read(path)
        }

        return 'file not found: ' + path
    }

    writeFile(path: string, data: string) {
        this._fs.writeFile(path, data)
    }

    exists(path: string) {
        return this._fs.exists(path)
    }

    read(path: string) {
        return this._fs.read(path)
    }

    explorer () {
        let result = []
        let cwd = this._fs.getCurrentDirectory()
        let cwdList = this._fs.list(cwd)

        for (let i = 0; i < cwdList.length; i++) {
            const file = cwdList[i];
            let item = {
                filename: file,
                path: cwd,
                fullPath: this._fs.joinPath(cwd, file),
                type: 'dir'
            }

            if (!this.exists(item.fullPath)) {
                continue
            }

            if (!this._fs.isDir(item.fullPath)) {
                item.type = 'file'
            }

            result.push(item)
        }

        return result
    }
}

// const linuxInstance = new Linux()
// export default linuxInstance

export default Linux
