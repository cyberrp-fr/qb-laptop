local CyberOrgConnectionEstablished = false
local DeviceConnectionEstablished = false
local DevicePort = nil

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
    DevicePort = math.random(1, 9)

    cb({ status = true, devicePort = DevicePort })
end)

RegisterNuiCallback("ddosVerifyPort", function (data, cb)
    cb({ status = (data.port == DevicePort) })
end)

RegisterNUICallback("ddosCreateDeviceFromShellDevice", function (data, cb)
    if not CyberOrgConnectionEstablished then
        cb({ status = false, msg = "[error] aucune connexion réseau cyber org." })
        return
    end

    if not DeviceConnectionEstablished then
        cb({ status = false, msg = "[error] aucun appareil détecté." })
        return
    end

    if data.port ~= DevicePort then
        cb({ status = false, msg = "[error] port incorrect ou inactif, aucune connectivité sur le port \"".. data.port .. "\"." })
        return
    end

    QBCore.Functions.TriggerCallback("qb-laptop:server:coding:ddos:CreateDeviceFromShellDevice", function (result)
        print("ddos response: ", json.encode(result))
        cb({ status = result.status })
    end)
end)
