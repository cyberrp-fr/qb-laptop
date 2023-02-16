LaptopData.Darknet = {
    Posts = {}
}

---------------
-- FUNCTIONS --
---------------
-- deletes posts older than 24h
local function CleanDarknet()
    MySQL.query("DELETE FROM `laptop_darknet_posts` WHERE `date` < NOW() - INTERVAL 24 HOUR", {})
end

-- loads darknet posts
local function LoadDarknet()
    local sql = "SELECT * FROM `laptop_darknet_posts` WHERE `date` > NOW() - INTERVAL 24 HOUR ORDER BY date DESC"
    local result = MySQL.query.await(sql, {})
    for key, post in pairs(result) do
        LaptopData.Darknet.Posts[key] = post
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

RegisterServerEvent("qb-laptop:server:darknet:CreatePost", function(source, data)
    local Player = QBCore.Functions.GetPlayer(source)
    local CitizenId = Player.PlayerData.citizenid

    local post = data
    post.citizenid = CitizenId

    local i = #LaptopData.Darknet.Posts + 1
    LaptopData.Darknet.Posts[i] = post

    local insertData = { post.citizenId, post.title, post.description, post.category }
    MySQL.insert("INSERT INTO `laptop_darknet_posts` (`citizenid`, `title`, `description`, `category`) VALUES (?, ?, ?, ?)", insertData)
end)

---------------
-- CALLBACKS --
---------------

-- get posts
QBCore.Functions.CreateCallback("qb-laptop:server:darknet:GetPosts", function(source, cb, filters)
    local result = FilterDarknetPosts(filters)
    cb(result)
end)
