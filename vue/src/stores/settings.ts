import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({
        // wallpaperUrl: 'https://wallpapercave.com/wp/wp6801277.jpg',
        wallpaperUrl: 'src/assets/img/kali-bright.jpg',
    });

    function setSettings(newSettings: any) {
        settings.value = newSettings;
    }

    return {
        settings,
        setSettings
    }
});