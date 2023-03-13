LaptopData.AES = {
    Users = {}
}

------------
-- EVENTS --
------------

-- declare new user online, add his address to registry
RegisterServerEvent('qb-laptop:server:aes:userOnline')
AddEventHandler('qb-laptop:server:aes:userOnline', function (hashAddress)
    local src = source
    print('userOnline - hashAddress: ', hashAddress)
    LaptopData.AES.Users[hashAddress] = src
end)

-- declare user went offline, remove his address from registry
RegisterServerEvent('qb-laptop:server:aes:userOffline')
AddEventHandler('qb-laptop:server:aes:userOffline', function (hashAddress)
    local src = source
    LaptopData.AES.Users[src] = nil
end)

-- transmit message
-- RegisterServerEvent('qb-laptop:server:aes:transmitMessage')
