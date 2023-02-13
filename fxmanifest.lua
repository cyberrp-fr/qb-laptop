fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author '0xIbra - https://github.com/0xIbra'
description 'qb-laptop - laptops with linux OS'

ui_page 'html/index.html'

shared_scripts {
    '@qb-core/shared/locale.lua',
	'locales/*.lua',
    'shared/config.lua'
}

server_scripts {
    'server/main.lua'
}

client_scripts {
    'client/main.lua'
}

files {
    'html/index.html',
    'html/assets/index.js',
    'html/assets/index.css',
    'html/assets/img/*.jpg',
    'html/assets/img/*.png',
}

