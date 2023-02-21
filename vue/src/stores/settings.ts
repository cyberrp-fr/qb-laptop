import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({
        // wallpaperUrl: 'https://wallpapercave.com/wp/wp6801277.jpg',
        wallpaperUrl: 'https://i.imgur.com/HDcIZPC.jpg',
        wallpaperSelection: [
            'https://i.imgur.com/HDcIZPC.jpg',
            'https://i.imgur.com/8yn4TO9.jpg',
            'https://i.imgur.com/vCJcTtY.jpg',
            'https://i.imgur.com/DlVPevy.jpg',
            'https://i.imgur.com/zwbJWzN.jpg',
            'https://i.imgur.com/Mw6VoCx.jpg',
            'https://i.imgur.com/yqRhpS4.png'
        ],

        programs: [
            { id: 'terminal', name: 'Terminal', program: 'terminal', installed: true },
            { id: 'firefox', name: 'Firefox', program: 'firefox', installed: false }
        ]
    })

    function setSettings(newSettings: any) {
        settings.value = newSettings;
    }

    function getInstalledPrograms() {
        return settings.value.programs.filter(item => item.installed === true)
    }

    function isInstallable(program: string) {
        let programs = settings.value.programs.filter(item => item.id === program)
        return programs.length > 0
    }

    function alreadyInstalled(program: string) {
        let programs = settings.value.programs.filter(item => (item.id === program && item.installed === true))
        return programs.length > 0
    }

    function installProgram(program: string) {
        for (let i = 0; i < settings.value.programs.length; i++) {
            const item = settings.value.programs[i]
            if (program === item.id) {
                settings.value.programs[i].installed = true
            }
        }
    }

    async function save() {
        const opts = {
            method: 'POST',
            body: JSON.stringify(settings.value),
            headers: {'Content-Type': 'application/json'}
        }
        const response = await fetch('https://qb-laptop/SaveSettings', opts)
        console.log('save response: ', response)
    }

    return {
        settings,
        setSettings,
        getInstalledPrograms,
        isInstallable,
        alreadyInstalled,
        installProgram,
        save
    }
});