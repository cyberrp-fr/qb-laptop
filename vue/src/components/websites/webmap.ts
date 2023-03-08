import DarknetWebsite from "./DarknetWebsite.vue"
import IframeProvider from "./IframeProvider.vue"
import GoogleWebsite from "./GoogleWebsite.vue"

export default [
    {
        name: 'Google',
        url: 'https://www.google.com',
        component: GoogleWebsite,
        matches: [
            'google.com',
            'google.fr',
            'www.google.com',
            'www.google.fr',
            'http://www.google.fr',
            'https://www.google.fr',
            'https://www.google.com'
        ]
    },
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
        description: 'Join Nerko NFT in building the biggest DAO for crypto holders.\nCheckout our whitepaper on our site.',
        url: 'https://nerko.io',
        component: IframeProvider,
        props: {
            url: 'http://websites.cyberrp.fr.s3-website.eu-west-3.amazonaws.com/themegenix.net-775881f17d1b4965cb9fb56f7344ab75/'
        },
        matches: [
            'nerkonft.io',
            'https://nerko.io',
            'http://nerkonft.io',
            'https://nerkonft.io'
        ]
    }
]