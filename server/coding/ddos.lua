

-- CALLBACKS --

QBCore.Functions.CreateCallback("qb-laptop:server:coding:ddos:CreateDeviceFromShellDevice", function (source, cb)
    local Player = QBCore.Functions.GetPlayer(source)

    if not Player.PlayerData.gang.iscyber then
        cb({ status = false })
    end

    if not exports["qb-inventory"]:HasItem(source, Config.Ddos.RequiredItem) then
        cb({ status = false })
        return
    end

    local item = exports["qb-inventory"]:GetItemByName(source, Config.Ddos.RequiredItem)
    if not item then
        cb({ status = false })
        return
    end

    local networkName = Player.PlayerData.gang.label

    exports["qb-inventory"]:RemoveItem(source, Config.Ddos.RequiredItem, 1, item.slot)
    exports["qb-inventory"]:AddItem(source, Config.Ddos.RewardItem, 1, item.slot, { network = networkName })

    cb({ status = true })
end)