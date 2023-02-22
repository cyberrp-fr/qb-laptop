local DarknetUser

------------
-- EVENTS --
------------
RegisterNetEvent("qb-laptop:client:darknet:RefreshComments", function (data)
    
    SendNUIMessage({
        action = 'darknet/post/replies/set',
        postId = data.postId,
        replies = data.replies
    })
end)

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
    QBCore.Functions.TriggerCallback("qb-laptop:server:darknet:CreatePost", function (response)
        cb(response)
    end, data)
end)

-- post comment
RegisterNUICallback("DarknetPostComment", function(data, cb)
    TriggerServerEvent("qb-laptop:server:darknet:CommentPost", data)
    cb("ok")
end)

-- register user
RegisterNUICallback("RegisterDarknetUser", function(userData, cb)
    -- @todo validation

    QBCore.Functions.TriggerCallback("qb-laptop:server:darknet:RegisterUser", function (response)
        if response.success then
            DarknetUser = response.user
            cb(response)
        else
            cb(response)
        end
    end, userData)
end)

-- authenticate user
RegisterNUICallback("AuthenticateUser", function(userData, cb)
    QBCore.Functions.TriggerCallback("qb-laptop:server:darknet:AuthenticateUser", function (response)
        cb(response)
    end, userData)
end)
