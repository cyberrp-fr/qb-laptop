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
        name: 'Nerko NFT',
        url: 'https://nerko.io',
        component: IframeProvider,
        props: {
            url: 'https://websites.cyberrp.fr/themegenix.net-775881f17d1b4965cb9fb56f7344ab75/'
        },
        matches: [
            'nerkonft.io',
            'http://nerkonft.io',
            'https://nerkonft.io'
        ]
    }
]