local QBCore = exports["qb-core"]:GetCoreObject()


-- QBCore.Functions.CreateUseableItem("duffel-bag", function(source, item)
-- 	local Player = QBCore.Functions.GetPlayer(source)
-- 	if Player.Functions.GetItemBySlot(item.slot) ~= nil then
--         TriggerClientEvent('qb-items:client:use:duffel-bag', source, item.info.bagid)
--     end
-- end)

QBCore.Functions.CreateUseableItem(Config.Item, function (source, item)
    TriggerClientEvent("qb-laptop:client:TurnOnLaptop", source)
end)
