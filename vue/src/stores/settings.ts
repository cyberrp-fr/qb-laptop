import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({
        // wallpaperUrl: 'https://wallpapercave.com/wp/wp6801277.jpg',
        wallpaperUrl: '/static/img/kali-bright.jpg',
        wallpaperSelection: [
            '/static/img/kali-bright.jpg',
            '/static/img/wallpapers/kali-dark.jpg',
            '/static/img/wallpapers/kali-green.jpg',
            '/static/img/wallpapers/kosmos.jpg',
            '/static/img/wallpapers/city2.jpg',
            '/static/img/wallpapers/nightcity.jpg',
            '/static/img/wallpapers/0xibra-mysterious-individual.png'
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