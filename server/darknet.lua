LaptopData.Darknet = {
    Posts = {},
    Users = {}
}

---------------
-- FUNCTIONS --
---------------
-- deletes posts older than 24h
local function CleanDarknet()
    MySQL.query("DELETE FROM `laptop_darknet_posts` WHERE `created_at` < NOW() - INTERVAL 24 HOUR", {})
end

local function getUserByID(id)
    local found
    for key, user in pairs(LaptopData.Darknet.Users) do
        if id == user.id then
            found = user
        end
    end

    return found
end

-- loads darknet posts
local function LoadDarknet()
    -- load users
    local sql = "SELECT id, citizenid, username, password, profile_picture_url FROM `laptop_darknet_users`"
    local result = MySQL.query.await(sql, {})
    for key, user in pairs(result) do
        LaptopData.Darknet.Users[user.username] = user
    end

    -- load posts
    sql = "SELECT * FROM `laptop_darknet_posts` WHERE `created_at` > NOW() - INTERVAL 24 HOUR ORDER BY `created_at` DESC"
    result = MySQL.query.await(sql, {})
    for key, post in pairs(result) do
        post.replies = {}
        local user = getUserByID(post.user_id)
        post.user = user

        LaptopData.Darknet.Posts[post.id] = post
    end
end

-- filter posts
local function FilterDarknetPosts(filters)
    local result = {}

    for key, post in pairs(LaptopData.Darknet.Posts) do
        local match = true

        if filters.category ~= nil then
            if filters.category ~= post.category then
                match = false
            end
        end
        if filters.search ~= nil then
            if not string.match(post.title, filters.search) and not string.match(post.description, filters.search) then
                match = false
            end
        end

        if match then
            local postUser = getUserByID(post.user_id)
            if postUser ~= nil then
                post.userHandle = postUser.username
            end
            table.insert(result, post)
        end
    end

    return result
end

------------
-- EVENTS --
------------

AddEventHandler("onResourceStart", function(resource)
    if GetCurrentResourceName() ~= resource then return end

    CleanDarknet()
    LoadDarknet()
end)

RegisterServerEvent("qb-laptop:server:darknet:CommentPost")
AddEventHandler("qb-laptop:server:darknet:CommentPost", function (data)
    local postId = data.post_id
    local postUser = getUserByID(data.user_id)
    local reply = {
        post_id = data.post_id,
        user_id = data.user_id,
        username = postUser.username,
        user = postUser,
        comment = data.comment
    }

    if LaptopData.Darknet.Posts[postId] ~= nil then
        if LaptopData.Darknet.Posts[postId].replies == nil then
            LaptopData.Darknet.Posts[postId].replies = {}
        end

        table.insert(LaptopData.Darknet.Posts[postId].replies, reply)

        TriggerClientEvent("qb-laptop:client:darknet:RefreshComments", -1, {postId = postId, replies = LaptopData.Darknet.Posts[postId].replies})
    end
end)

RegisterServerEvent("qb-laptop:server:darknet:EditUserProfilePicture")
AddEventHandler("qb-laptop:server:darknet:EditUserProfilePicture", function (data)
    local src = source

    local username = data.username
    local profilePictureUrl = data.profilePictureUrl

    local sql = "UPDATE `laptop_darknet_users` SET `profile_picture_url` = ? WHERE 1=1 AND username = ?"
    MySQL.update.await(sql, {profilePictureUrl, username})

    if LaptopData.Darknet.Users[username] ~= nil then
        local User = LaptopData.Darknet.Users[username]
        User['profile_picture_url'] = profilePictureUrl

        LaptopData.Darknet.Users[username] = User

        TriggerClientEvent("qb-laptop:client:darknet:SetUser", src, User)
    end
end)

---------------
-- CALLBACKS --
---------------

-- get posts
QBCore.Functions.CreateCallback("qb-laptop:server:darknet:GetPosts", function(source, cb, filters)
    local result = FilterDarknetPosts(filters)
    cb(result)
end)

-- create post
QBCore.Functions.CreateCallback("qb-laptop:server:darknet:CreatePost", function (source, cb, data)
    local Player = QBCore.Functions.GetPlayer(source)
    local CitizenId = Player.PlayerData.citizenid

    local post = data
    post.citizenid = CitizenId

    local insertData = { post.citizenid, post.user_id, post.title, post.description, post.category }
    local insertId = MySQL.insert.await("INSERT INTO `laptop_darknet_posts` (`citizenid`, `user_id`, `title`, `description`, `category`) VALUES (?, ?, ?, ?, ?)", insertData)

    post.id = insertId
    post.replies = {}
    LaptopData.Darknet.Posts[post.id] = post

    TriggerClientEvent("qb-laptop:client:darknet:RefreshPosts", LaptopData.Darknet.Posts)
    cb({success = true, post = post})
end)

-- register user
QBCore.Functions.CreateCallback("qb-laptop:server:darknet:RegisterUser", function(source, cb, userData)
    if LaptopData.Darknet.Users[userData.username] ~= nil then
        cb({
            success = false,
            message = Lang:t("darknet.error.username_taken")
        })
        return
    end

    local username = userData.username
    local password = userData.password
    local Player = QBCore.Functions.GetPlayer(source)
    local citizenid = Player.PlayerData.citizenid

    local sql = "INSERT INTO `laptop_darknet_users` (citizenid, username, password) VALUES (?, ?, ?)"
    local result = MySQL.insert.await(sql, {citizenid, username, password})

    if not result then
        cb({success = false})
    end

    local user = {id = result, citizenid = citizenid, username = username}
    LaptopData.Darknet.Users[username] = user

    cb({success = true, user = user})
end)

-- authenticate user
QBCore.Functions.CreateCallback("qb-laptop:server:darknet:AuthenticateUser", function(source, cb, userData)
    if LaptopData.Darknet.Users[userData.username] == nil then
        cb({
            success = false,
            message = Lang:t("darknet.error.no_user_found")
        })
        return
    end

    local user = LaptopData.Darknet.Users[userData.username]
    if user.password ~= userData.password then
        cb({
            success = false,
            message = Lang:t("darknet.error.invalid_password")
        })
    else
        cb({
            success = true,
            user = user
        })
    end
end)
