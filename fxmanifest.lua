fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'CyberRP France - https://github.com/cyberrp-fr'
description 'qb-laptop - laptops with linux OS'

shared_scripts {
    '@qb-core/shared/locale.lua',
	'locales/*.lua',
    'shared/config.lua',
    'shared/utils.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'server/darknet.lua',
    'server/aes-messaging.lua',
    'server/webhacking.lua',
    'server/coding/*.lua'
}

client_scripts {
    'client/main.lua',
    'client/darknet.lua',
    'client/aes-messaging.lua',
    'client/coding/*.lua'
}

ui_page 'html/index.html'
files {
    'html/index.html',
    'html/assets/index.js',
    'html/assets/index.css',
    'html/static/js/skulpt/skulpt.min.js',
    'html/static/js/skulpt/skulpt-stdlib.js',
    'data/webmap.json'
}

