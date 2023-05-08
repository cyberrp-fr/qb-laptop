

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
