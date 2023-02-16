

---------------
-- CALLBACKS --
---------------
-- get darknet posts
RegisterNUICallback("GetDarknetPosts", function(filters, cb)
    QBCore.Functions.TriggerCallback("qb-laptop:server:darknet:GetPosts", function(posts)
        cb(posts)
    end, filters)
end)

-- create darknet post
RegisterNUICallback("CreateDarknetPost", function(data, cb)
    TriggerServerEvent("qb-laptop:server:darknet:CreatePost", data)
    cb("ok")
end)
