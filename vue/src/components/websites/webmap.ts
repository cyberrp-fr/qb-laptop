import DarknetWebsite from "./DarknetWebsite.vue"
import IframeProvider from "./IframeProvider.vue"

export default [
    {
        name: 'ShadowNET',
        url: 'tor://shadownet.onion',
        component: DarknetWebsite,
        matches: [
            'shadownet.onion',
            'tor://shadownet.onion',
        ]
    },
    {
        name: 'Tour Travel',
        url: 'https://tourtravel.com',
        component: IframeProvider,
        props: {
            'url': 'https://modtour.wpengine.com/'
        },
        matches: [
            'tourtravel.com',
            'http://tourtravel.com',
            'https://tourtravel.com'
        ]
    }
]