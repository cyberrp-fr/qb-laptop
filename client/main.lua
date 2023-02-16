QBCore = exports["qb-core"]:GetCoreObject()
LaptopData = {
    isOn = false
}

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

------------
-- EVENTS --
------------

RegisterNetEvent("qb-laptop:client:TurnOnLaptop", function ()
    if not QBCore.Functions.HasItem(Config.Item) then
        QBCore.Functions.Notify(Lang:t("error.dont_have_laptop"), "error")
        return
    end

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "turnon",
        data = {},
    })

    LaptopData.isOn = true
    CreateThread(function()
        while LaptopData.isOn do
            DisableDisplayControlActions()
            Wait(1)
        end
    end)
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

---------------
-- LISTENERS --
---------------

-- AddEventHandler("onResourceStart", function(resource)
--     if resource ~= GetCurrentResourceName() then return end
-- end)
