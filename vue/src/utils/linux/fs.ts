import type FS from 'browserfs/dist/node/core/FS'

function joinPath(...paths: any) {
    let result = '';
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      if (path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      if (path.startsWith('/')) {
        path = path.slice(1);
      }
      result += path;
      if (i < paths.length - 1) {
        result += '/';
      }
    }
    return result;
  }
  

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

    getClient() {
        return this._fs
    }

    getCurrentDirectory() {
        return this._cwd
    }

    isDir(path: string) {
        if (!path.startsWith('/')) {
            path = joinPath(this._cwd, path)
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
        }

        if (!dir.startsWith(dir)) {
            dir = joinPath(this._cwd, dir)
        }

        if (this.isDir(dir)) {
            this._cwd = dir
        } else {
            throw new Error('directory does not exist: ' + dir)
        }
    }


}