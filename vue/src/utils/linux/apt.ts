import Utils from "../utils"
import { useSettingsStore } from "@/stores/settings"

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

    static APT_INSTALL = [
        'Get:1 http://archive-4.kali.org/kali kali-rolling/main amd64 libncursesw6 amd64 6.4-2 [134 kB]',
        'Get:2 http://archive-4.kali.org/kali kali-rolling/main amd64 {{program}} amd64 [689 kB]',
        'Get:3 http://http.kali.org/kali kali-rolling/main amd64 libgpm2 amd64 1.20.7-10+b1 [14.2 kB]',
        'Fetched 837 kB in 1s (1304 kB/s)',
        'Selecting previously unselected package libncursesw6:amd64.',
        '(Reading database ... 6125 files and directories currently installed.)',
        'Preparing to unpack .../libncursesw6_6.4-2_amd64.deb ...',
        'Unpacking libncursesw6:amd64 (6.4-2) ...',
        'Selecting previously unselected package {{program}}.',
        'Preparing to unpack .../archives/{{program}}_amd64.deb ...',
        'Unpacking {{program}} ...',
        'Selecting previously unselected package libgpm2:amd64.',
        'Preparing to unpack .../libgpm2_1.20.7-10+b1_amd64.deb ...',
        'Unpacking libgpm2:amd64 (1.20.7-10+b1) ...',
        'Setting up libgpm2:amd64 (1.20.7-10+b1) ...',
        'Setting up libncursesw6:amd64 (6.4-2) ...',
        'Setting up {{program}} ...',
        'update-alternatives: using /bin/{{program}} to provide /usr/bin/editor (editor) in auto mode',
        'update-alternatives: using /bin/{{program}} to provide /usr/bin/pico (pico) in auto mode',
        'Processing triggers for libc-bin (2.36-8) ...'
    ]

    private _outputcallback: any

    private _settingsStore: any

    constructor() {
        this._settingsStore = useSettingsStore()
    }

    public setOutputCallback(cb: any) {
        this._outputcallback = cb
    }

    public handleCommand(command: string, cmd: string) {
        let split = command.split(' ')
        let bin = split[1]
        let action = split[2]

        if (cmd !== 'sudo') {
            this.noSudo()
            return
        }

        // todo
        if (action === 'update') {
            (async () => {
                for (let i = 0; i < APT.APT_UPDATE.length; i++) {
                    const log = APT.APT_UPDATE[i]
                    this._outputcallback(log)
                    await new Promise(resolve => setTimeout(resolve, Utils.random(50, 100)))
                }
            })()
        } else if (action === 'install') {
            let program = split[3]
            if (program == null || program == '') {
                this._outputcallback('apt install requires a 3rd parameter\nexample: apt install firefox')
                return
            }

            if (!this._settingsStore.isInstallable(program)) {
                this._outputcallback(`Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
E: Unable to locate package ${program}`)

                return
            }

            if (this._settingsStore.alreadyInstalled(program)) {
                this._outputcallback(`Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
${program} is already the newest version.
0 upgraded, 0 newly installed, 0 to remove and 2 not upgraded.`)

                return
            }

            (async () => {
                for (let i = 0; i < APT.APT_INSTALL.length; i++) {
                    let log = APT.APT_INSTALL[i];
                    log = log.replace(/{{program}}/gi, program)

                    this._outputcallback(log)
                    await new Promise(resolve => setTimeout(resolve, Utils.random(10, 50)))
                }

                this._settingsStore.installProgram(program)
            })()
        }
    }

    public noSudo() {
        this._outputcallback(`Reading package lists... Done
E: Could not open lock file /var/lib/apt/lists/lock - open (13: Permission denied)
E: Unable to lock directory /var/lib/apt/lists/`)
    }
}