
export default class APT {
    static APT_UPDATE: Array<string> = [
        'Get:1 http://archive-4.kali.org/kali kali-rolling InRelease [30.6 kB]',
        'Get:2 http://archive-4.kali.org/kali kali-rolling/non-free amd64 Packages [222 kB]',
        'Get:3 http://archive-4.kali.org/kali kali-rolling/main amd64 Packages [19.5 MB]',
        'Get:4 http://archive-4.kali.org/kali kali-rolling/contrib amd64 Packages [116 kB]',
        'Fetched 19.8 MB in 2s (8031 kB/s)',
        'Reading package lists... Done',
        'Building dependency tree... Done',
        'Reading state information... Done',
        "2 packages can be upgraded. Run 'apt list --upgradable' to see them."
    ]

    private _outputcallback: any

    public setOutputCallback(cb: any) {
        this._outputcallback = cb
    }

    public handleCommand(command: string, cmd: string) {
        let split = command.split(' ')
        let bin = split[1].trim()

        if (cmd !== 'sudo') {
            this.noSudo()
            return
        }
    }

    public noSudo() {
        this._outputcallback(`Reading package lists... Done
E: Could not open lock file /var/lib/apt/lists/lock - open (13: Permission denied)
E: Unable to lock directory /var/lib/apt/lists/`)
    }
}