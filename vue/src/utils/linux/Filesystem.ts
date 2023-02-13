class FileSystem {

    private _cwd = '/'

    private _files: any = {
        'bin': false,
        'boot': false,
        'dev': false,
        'lib': false,
        'lib32': false,
        'lib64': false,
        'proc': false,
        'sbin': false,
        'sys': false,
        'usr': false,
        'run': false,

        'etc': {},
        'home': {},
        'var': {},
        'tmp': {},
        'opt': {},
    }

    handleCommand(command: string) {
        let split = command.split(' ')
        let cmd = split[0].trim()

        // ls
        if (cmd === 'ls') {
            let opts: any = {
                cmd,
                mode: null,
                path: null,
            }

            let arg = split[1]
            if (typeof arg === 'string') {
                arg = arg.trim()
                if (arg.startsWith('-')) {
                    opts.mode = arg
                }
            }

            arg = split[2]
            if (typeof arg === 'string') {
                arg = arg.trim()
                opts.path = arg
            }

            let res: any = this.ls(opts)
            console.log("type: ", res, typeof res)
            if (Array.isArray(res)) {
                return res.join('<br>')
            } else {
                return ''
            }
        }
    } 

    ls(opts: any) {
        console.log('opts: ', opts)
        if (opts.path != '' && opts.path != '.' && opts.path != '..') {
            if (opts.path != null && opts.path in this._files) {
                return Object.values(this._files[opts.path])
            } else {
                return `dir not found: ${opts.path}`
            }
        }

        return Object.keys(this._files)
    }
}

export default FileSystem
