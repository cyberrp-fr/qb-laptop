QBCore = exports["qb-core"]:GetCoreObject()
LaptopData = {}

QBCore.Functions.CreateUseableItem(Config.Item, function (source, item)
    TriggerClientEvent("qb-laptop:client:TurnOnLaptop", source)
end)


------------
-- EVENTS --
------------

RegisterServerEvent("qb-laptop:server:usb:Unmount")
AddEventHandler("qb-laptop:server:usb:Unmount", function (data)
    local src = source
    
    if data then
        local Player = QBCore.Functions.GetPlayer(src)
        for k, usb in pairs(data) do
            Player.PlayerData.items[usb.slot] = usb
        end

        Player.Functions.SetPlayerData("items", Player.PlayerData.items)
    end
end)
