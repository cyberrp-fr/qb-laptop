import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

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
            { id: 'firefox', name: 'Firefox', program: 'firefox', installed: true }
        ]
    });

    function setSettings(newSettings: any) {
        settings.value = newSettings;
    }

    return {
        settings,
        setSettings
    }
});