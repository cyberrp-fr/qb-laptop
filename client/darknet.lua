local DarknetUser

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

-- register user
RegisterNUICallback("RegisterDarknetUser", function(userData, cb)
    -- @todo validation

    QBCore.Functions.TriggerCallback("qb-laptop:server:darknet:RegisterUser", function (response)
        if response.error == false then
            DarknetUser = response.user
            cb({success = true, user = DarknetUser})
        else
            cb({success = false, message = response.message})
        end
    end, userData)
end)
