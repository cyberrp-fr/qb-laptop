local CyberOrgConnectionEstablished = false
local DeviceConnectionEstablished = false

-- CALLBACKS

RegisterNUICallback("ddosCyberOrgAuthenticate", function (data, cb)
    local auth = false
    PlayerData = QBCore.Functions.GetPlayerData()
    if PlayerData.name == data.username and PlayerData.gang.iscyber == true then
        auth = true
        CyberOrgConnectionEstablished = true
    end

    cb({ auth = auth })
end)

RegisterNUICallback("ddosDeviceCheck", function (data, cb)
    local hash = data.hash
    if hash == nil then
        cb({ status = false, msg = "[error] le parametre \"hash\" est obligatoire." })
        return
    end

    if not CyberOrgConnectionEstablished then
        cb({ status = false, msg = "[error] aucune connexion réseau cyber trouvée, connectez vous au réseau d'abord."})
        return
    end

    if not QBCore.Functions.HasItem(Config.Ddos.RequiredItem, 1) then
        cb({ status = false, msg = "[error] Aucun \"appareil programmable\" détecté." })
        return
    end

    DeviceConnectionEstablished = true

    cb({ status = true })
end)
