import { getCurrentInstance } from 'vue'
import type FS from 'browserfs/dist/node/core/FS'

export default class LinuxFileSystem {
    private _fs: FS

    private _user: string = ''
    private _cwd = '/'

    constructor() {
        const app = getCurrentInstance()
        this._fs = app?.appContext.config.globalProperties.$fs
    }

    public setFs(fs: FS) {
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
            '/media',
            '/media/usb'
        ]

        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            if (!this._fs.existsSync(dir)) {
                let res = this._fs.mkdirSync(dir)
            }
        }
    }

    initUser(user: string) {
        this._user = user

        let homePath = this.joinPath('/home', user)
        let dirs = ['Downloads', 'Documents']

        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i]
            const path = this.joinPath(homePath, dir)

            if (!this.isDir(path)) {
                this.mkdir(path, null)
            }
        }

        this._cwd = homePath
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
        if (!path.startsWith('/')) {
            path = this.joinPath(this._cwd, path)
        }

        this._fs.mkdirSync(path)
    }

    rm(path: string) {
        if (!path.startsWith('/') && !path.startsWith('./')) {
            path = this.joinPath(this._cwd, path)
        } else if (path.startsWith('./')) {
            path = this.joinPath(this._cwd, path.substring(1))
        }

        if (this.isDir(path)) {
            this._fs.rmdirSync(path)
        } else if (this._fs.existsSync(path)) {
            this._fs.unlinkSync(path)
        } else {
            throw new Error('no file or directory found: ' + path)
        }
    }

    writeFile(path: string, data: string) {
        if (!path.startsWith('/')) {
            path = this.joinPath(this._cwd, path)
        }
        if (path.startsWith('./')) {
            path = this.joinPath(this._cwd, path.substring(1))
        }

        this._fs.writeFileSync(path, data)
    }

    exists(path: string) {
        if (!path.startsWith('/')) {
            path = this.joinPath(this._cwd, path)
        }
        if (path.startsWith('./')) {
            path = this.joinPath(this._cwd, path.substring(1))
        }

        return this._fs.existsSync(path)
    }

    read(path: string) {
        if (!path.startsWith('/')) {
            path = this.joinPath(this._cwd, path)
        }
        if (path.startsWith('./')) {
            path = this.joinPath(this._cwd, path.substring(1))
        }

        let res = this._fs.readFileSync(path).toString()

        return res
    }

    mv(source: string, destination: string) {
        if (!source.startsWith('/')) {
            source = this.joinPath(this._cwd, source)
        }
        if (!destination.startsWith('/')) {
            destination = this.joinPath(this._cwd, destination)
        }

        return this._fs.renameSync(source, destination)
    }

    cp(source: string, destination: string) {
        const data = this._fs.readFileSync(source)
        this._fs.writeFileSync(destination, data)
    }

    cpr(source: string, destination: string) {
        if (!source.startsWith('/')) {
            source = this.joinPath(this._cwd, source)
        }
        if (!destination.startsWith('/')) {
            destination = this.joinPath(this._cwd, destination)
        }

        const isDir = this.exists(source) && this.isDir(source)
        if (isDir) {
            this._fs.mkdirSync(destination)
            this._fs.readdirSync(source).forEach((itemName) => this.cpr(this.joinPath(source, itemName), this.joinPath(destination, itemName)))
        } else {
            this.cp(source, destination)
        }
    }

    rmr(directory: string) {
        if (this._fs.existsSync(directory)) {
            this._fs.readdirSync(directory).forEach(file => {
                const curPath = this.joinPath(directory, file)
                if (this._fs.lstatSync(curPath).isDirectory()) {
                    this.rmr(curPath)
                } else {
                    this._fs.unlinkSync(curPath)
                }
            })

            this._fs.rmdirSync(directory)
        }
    }

    rlist(directory: string) {
        // if (!directory.startsWith('/')) {
        //     directory = this.joinPath(this._cwd, directory)
        // }

        const result: any = {
            path: directory,
            type: 'dir',
            contents: [],
            size: 0
        }

        const files = this._fs.readdirSync(directory)
        for (let i = 0; i < files.length; i++) {
            let filepath = files[i]
            const item: any = {
                filename: filepath,
                path: this.joinPath(directory, filepath),
                type: 'file'
            }
            filepath = item.path

            if (this.isDir(filepath)) {
                let nestedResult = this.rlist(filepath)
                item.type = 'dir'
                item.contents = nestedResult.contents
                result.size += nestedResult.size
            } else {
                item.data = this._fs.readFileSync(filepath).toString('utf8')
                item.size = this._fs.statSync(filepath).size
                result.size += item.size
            }

            result.contents.push(item)
        }

        return result
    }

    public getDownloadsPath(user: string) {
        return `/home/${user}/Downloads`
    }
}