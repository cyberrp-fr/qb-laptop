local HashAddress
local Discussions = {}

---------------
-- FUNCTIONS --
---------------

local function initialize()
    HashAddress = "hash@" .. Utils.GenerateHash(tostring(PlayerData.citizenid))
    TriggerServerEvent("qb-laptop:server:aes:userOnline", HashAddress)
end

-------------------
-- NUI CALLBACKS --
-------------------

-- create new discussion with 1 message
RegisterNUICallback("AESNewDiscussion", function (data, cb)
    local from = HashAddress
    local to = data.to
    local messages = data.messages

    local hash = 'hash@' .. from:gsub('hash@', '') .. to:gsub('hash@', '')
    local discussion = {
        from = from,
        to = to,
        messages = messages,
        discussionId = hash
    }

    TriggerServerEvent("qb-laptop:server:aes:newDiscussion", discussion)

    cb("ok")
end)

-- send message to discussion
RegisterNUICallback("AESSendMessage", function (data, cb)
    local from = HashAddress
    local discussionId = data.discussionId

    local to = Discussions[discussionId].to
    if to == HashAddress then
        to = Discussions[discussionId].from
    end

    local payload = {
        from = from,
        to = to,
        discussionId = discussionId,
        discussionMessage = data.message
    }

    TriggerServerEvent("qb-laptop:server:aes:SendMessage", payload)

    cb("ok")
end)


------------
-- EVENTS --
------------

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    initialize()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    TriggerServerEvent("qb-laptop:server:aes:userOffline", HashAddress)
end)

AddEventHandler("onResourceStart", function (resource)
    if resource ~= GetCurrentResourceName() then return end

    initialize()
end)

AddEventHandler("onResourceStop", function (resource)
    if resource ~= GetCurrentResourceName() then return end

    TriggerServerEvent("qb-laptop:server:aes:userOffline", HashAddress)
end)

AddEventHandler("qb-laptop:client:aes:OnLaptopTurnOn", function ()
    SendNUIMessage({
        action = "aes-messaging/address/set",
        AESAddress = HashAddress
    })
end)

RegisterNetEvent("qb-laptop:client:aes:SetDiscussion", function (data)
    Discussions[data.discussionId] = data

    SendNUIMessage({
        action = "aes-messaging/discussion/set",
        discussion = data
    })
end)

RegisterNetEvent("qb-laptop:client:aes:ReceiveMessage", function (data)
    local discussionId = data.discussionId
    local from = data.from
    local to = data.to
    local messageContent = data.discussionMessage

    local message = {
        to = to,
        from = from,
        content = messageContent
    }

    table.insert(Discussions[discussionId]['messages'], message)

    SendNUIMessage({
        action = "aes-messaging/receive",
        discussionId = discussionId,
        discussionMessage = message
    })
end)
