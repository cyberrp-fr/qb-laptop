import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({
        // wallpaperUrl: 'https://wallpapercave.com/wp/wp6801277.jpg',
        wallpaperUrl: 'src/assets/img/kali-bright.jpg',
        wallpaperSelection: [
            'src/assets/img/kali-bright.jpg',
            'src/assets/img/wallpapers/kali-dark.jpg',
            'src/assets/img/wallpapers/kali-green.jpg',
            'src/assets/img/wallpapers/kosmos.jpg',
            'src/assets/img/wallpapers/0xibra-mysterious-individual.png'
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