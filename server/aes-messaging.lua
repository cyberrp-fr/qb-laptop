LaptopData.AES = {
    Users = {}
}

------------
-- EVENTS --
------------

-- declare new user online, add his address to registry
RegisterServerEvent("qb-laptop:server:aes:userOnline")
AddEventHandler("qb-laptop:server:aes:userOnline", function (hashAddress)
    local src = source
    LaptopData.AES.Users[hashAddress] = src
end)

-- declare user went offline, remove his address from registry
RegisterServerEvent("qb-laptop:server:aes:userOffline")
AddEventHandler("qb-laptop:server:aes:userOffline", function (hashAddress)
    LaptopData.AES.Users[hashAddress] = nil
end)

-- create new discussion
RegisterServerEvent("qb-laptop:server:aes:newDiscussion")
AddEventHandler("qb-laptop:server:aes:newDiscussion", function (data)
    local src = source
    TriggerClientEvent("qb-laptop:client:aes:SetDiscussion", src, data)

    local destSource = LaptopData.AES.Users[data.to]
    if destSource ~= nil then
        TriggerClientEvent("qb-laptop:client:aes:SetDiscussion", destSource, data)
    end
end)

-- transmit message
RegisterServerEvent("qb-laptop:server:aes:SendMessage")
AddEventHandler("qb-laptop:server:aes:SendMessage", function (data)
    local src = source
    TriggerClientEvent("qb-laptop:client:aes:ReceiveMessage", src, data)

    local destSource = LaptopData.AES.Users[data.to]
    if destSource ~= nil then
        TriggerClientEvent("qb-laptop:client:aes:ReceiveMessage", destSource, data)
    end
end)
