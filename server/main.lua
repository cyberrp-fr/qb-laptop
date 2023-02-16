QBCore = exports["qb-core"]:GetCoreObject()
LaptopData = {}

QBCore.Functions.CreateUseableItem(Config.Item, function (source, item)
    TriggerClientEvent("qb-laptop:client:TurnOnLaptop", source)
end)
