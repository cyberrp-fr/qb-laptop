fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author '0xIbra - https://github.com/0xIbra'
description 'qb-laptop - laptops with linux OS'

shared_scripts {
    '@qb-core/shared/locale.lua',
	'locales/*.lua',
    'shared/config.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'server/darknet.lua'
}

client_scripts {
    'client/main.lua',
    'client/darknet.lua'
}

ui_page 'html/index.html'
files {
    'html/index.html',
    'html/assets/index.js',
    'html/assets/index.css',
    'html/static/js/skulpt/skulpt.min.js',
    'html/static/js/skulpt/skulpt-stdlib.js'
}

