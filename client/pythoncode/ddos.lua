

-- CALLBACKS

RegisterNUICallback("ddosCyberOrgAuthenticate", function (data, cb)
    local auth = false
    PlayerData = QBCore.Functions.GetPlayerData()
    if PlayerData.name == data.username and PlayerData.gang.iscyber == true then
        auth = true
    end

    -- print("req data: ", json.encode(data))
    -- print("player data name: ", PlayerData.name)
    -- print("player gang data: ", json.encode(PlayerData.gang))

    cb({ auth = auth })
end)

RegisterNUICallback("ddosDeviceCheck", function (data, cb)
    local hash = data.hash
    if hash == nil then
        cb({ status = false, msg = "[error] le parametre \"hash\" est obligatoire." })
    end

    if not QBCore.Functions.HasItem(Config.Ddos.RequiredItem, 1) then
        cb({ status = false, msg = "[error] Aucun \"appareil programmable\" détecté." })
    end

    cb({ status = true })
end)
