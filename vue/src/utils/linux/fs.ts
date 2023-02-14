import type FS from 'browserfs/dist/node/core/FS'

export default class LinuxFileSystem {
    private _fs: FS

    private _cwd = '/'

    constructor(fs: FS) {
        this._fs = fs
    }

    init() {
        let dirs = [
            '/bin',
            '/boot',
            '/dev',
            '/lib',
            '/lib32',
            '/lib64',
            '/proc',
            '/sbin',
            '/run',
            '/usr',
            '/sys',
            '/etc',
            '/opt',
            '/home',
            '/root',
            '/var',
            '/var/log',
            '/tmp',
        ]

        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            if (!this._fs.existsSync(dir)) {
                let res = this._fs.mkdirSync(dir)
            }
        }
    }

    public joinPath(...parts: any) {
        const [first, last, slash] = [0, parts.length - 1, "/"];

        const matchLeadingSlash = new RegExp("^" + slash);
        const matchTrailingSlash = new RegExp(slash + "$");
    
        parts = parts.map(function(part: any, index: any) {
    
            if (index === first && part === "file://") return part;
    
            if (index > first) part = part.replace(matchLeadingSlash, "");
    
            if (index < last) part = part.replace(matchTrailingSlash, "");
    
            return part;
        });
    
        return parts.join(slash);
    }

    getClient() {
        return this._fs
    }

    getCurrentDirectory() {
        return this._cwd
    }

    isDir(path: string) {
        if (!path.startsWith('/')) {
            path = this.joinPath(this._cwd, path)
        }

        return (this._fs.existsSync(path) && this._fs.lstatSync(path).isDirectory() === true)
    }

    emptyPath(path: string) {
        if (path == null) {
            path = this._cwd
        }

        return path
    }

    list(path: string) {
        return this._fs.readdirSync(path)
    }

    cd(dir: string) {
        if (dir === '..' && this._cwd !== '/') {
            let parts = this._cwd.split('/')
            parts.pop()
            this._cwd = parts.join('/')
            if (this._cwd === '') {
                this._cwd = '/'
            }

            return
        } else if (dir === '..' && this._cwd === '/') {
            return
        }

        if (!dir.startsWith('/')) {
            dir = this.joinPath(this._cwd, dir)
        }

        if (this.isDir(dir)) {
            this._cwd = dir
            if (!this._cwd.startsWith('/')) {
                this._cwd = '/' + this._cwd
            }
        } else {
            throw new Error('directory does not exist: ' + this.joinPath(this._cwd, dir))
        }
    }

    mkdir(path: string, mode: any) {
        if (!path.startsWith('/') && !path.startsWith('./')) {
            path = '/' + path
        } else if (path.startsWith('./')) {
            path = this._cwd + path.substring(1)
        }

        this._fs.mkdirSync(path)
    }

    rm(path: string) {
        if (!path.startsWith('/') && !path.startsWith('./')) {
            path = this.joinPath(this._cwd, path)
        } else if (path.startsWith('./')) {
            path = this._cwd + path.substring(1)
        }

        if (this.isDir(path)) {
            this._fs.rmdirSync(path)
        } else if (this._fs.existsSync(path)) {
            this._fs.unlinkSync(path)
        } else {
            throw new Error('no file or directory found: ' + path)
        }
    }
}