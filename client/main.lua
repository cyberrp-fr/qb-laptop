QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()
LaptopData = {
    isOn = false,
    Settings = nil,
}
local LaptopDataKVPKey = "player_settings"

---------------
-- FUNCTIONS --
---------------

local function DisableDisplayControlActions()
    DisableControlAction(0, 1, true) -- disable mouse look
    DisableControlAction(0, 2, true) -- disable mouse look
    DisableControlAction(0, 3, true) -- disable mouse look
    DisableControlAction(0, 4, true) -- disable mouse look
    DisableControlAction(0, 5, true) -- disable mouse look
    DisableControlAction(0, 6, true) -- disable mouse look
    DisableControlAction(0, 263, true) -- disable melee
    DisableControlAction(0, 264, true) -- disable melee
    DisableControlAction(0, 257, true) -- disable melee
    DisableControlAction(0, 140, true) -- disable melee
    DisableControlAction(0, 141, true) -- disable melee
    DisableControlAction(0, 142, true) -- disable melee
    DisableControlAction(0, 143, true) -- disable melee
    DisableControlAction(0, 177, true) -- disable escape
    DisableControlAction(0, 200, true) -- disable escape
    DisableControlAction(0, 202, true) -- disable escape
    DisableControlAction(0, 322, true) -- disable escape
    DisableControlAction(0, 245, true) -- disable chat
end

local function LoadLaptopSettings()
    local settingsData = GetResourceKvpString(LaptopDataKVPKey)
    if settingsData ~= nil then
        LaptopData.Settings = json.decode(settingsData)
    end
end

local function GetUSBs()
    local found = {}
    PlayerData = QBCore.Functions.GetPlayerData()
    for slot, item in pairs(PlayerData.items) do
        if item.name == "usb_stick_1" or item.name == "usb_stick_2" then
            table.insert(found, item)
        end

        if #found >= 4 then
            break
        end
    end

    return found
end

------------
-- EVENTS --
------------

RegisterNetEvent("qb-laptop:client:TurnOnLaptop", function ()
    if not QBCore.Functions.HasItem(Config.Item) then
        QBCore.Functions.Notify(Lang:t("error.dont_have_laptop"), "error")
        return
    end

    if LaptopData.Settings ~= nil then
        SendNUIMessage({
            action = "settings/set",
            settings = LaptopData.Settings
        })
    end

    TriggerEvent("qb-laptop:client:aes:OnLaptopTurnOn")

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "turnon",
        user = PlayerData.name
    })

    LaptopData.isOn = true
    CreateThread(function()
        while LaptopData.isOn do
            DisableDisplayControlActions()
            Wait(1)
        end
    end)

    Wait(1000)
    local usbs = GetUSBs()
    if #usbs > 0 then
        SendNUIMessage({
            action = "usb/set",
            usbs = usbs
        })
    end
end)


-------------------
-- NUI Callbacks --
-------------------

RegisterNUICallback("TurnOffLaptop", function (_, cb)
    SetNuiFocus(false, false)
    SetTimeout(500, function ()
        LaptopData.isOn = false
    end)

    cb("ok")
end)

RegisterNUICallback("SaveSettings", function (data, cb)
    LaptopData.Settings = data
    SetResourceKvp(LaptopDataKVPKey, json.encode(data))

    cb("ok")
end)

RegisterNUICallback("UnmountUSBs", function (data, cb)
    TriggerServerEvent("qb-laptop:server:usb:Unmount", data)

    cb("ok")
end)

---------------
-- LISTENERS --
---------------

AddEventHandler("onResourceStart", function(resource)
    if resource ~= GetCurrentResourceName() then return end

    LoadLaptopSettings()
end)

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = QBCore.Functions.GetPlayerData()
    LoadLaptopSettings()
end)
