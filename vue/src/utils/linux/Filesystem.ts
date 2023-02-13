class FileSystem {

    private _cwd = '/'
    private _cwd_temp = '/'

    private _fs: any = {
        '/': {
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
            'var': {
                'log': {
                    'syslog': {
                        type: 'file',
                        content: '1\n2\n3'
                    }
                }
            },
            'tmp': {},
            'opt': {},
        }
    }

    public create() {}

    public cd(dir: string) {
        let val = this._gotodims(dir)
        if (val == null) {
            return 'dir not found: ' + dir
        }

        this._cwd = this._cwd_temp

        return Object.keys(val)
    }

    public list(path: any) {
        let val = this._gotodims(path)

        if (val == null) {
            return `dir not found: ${path}`
        }

        return Object.keys(val).join('<br>')
    }

    private _gotodims(path: string) {
        let val = this._fs
        if (path != null && path != '') {
            let dims: any = path.split('/')
            for (let i = 0; i < dims.length; i++) {
                let dim: string = dims[i];
                dim = dim.trim()
                if (dim === '') {
                    continue
                }

                if (val != null && val[dim] != null) {
                    val = val[dim]
                    this._cwd_temp += dim + '/'
                } else {
                    val = null
                }
            }
        }

        return val
    }
}

export default FileSystem
