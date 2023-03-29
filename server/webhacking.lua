local WebMap

-- website categories
local Categories = {}

-- vulnerabilities naming
local SQL_INJECTION = "sql_injection"
local XSS = "xss"
local CODE_INJECTION = "code_injection"

-- enabled meaning implemented so far, initially i'm gonna implement "sql injection" and after the rest will following
local EnabledVulnerabilities = {SQL_INJECTION}
local Probability = 0.2

-- FUNCTIONS

local function LoadLocalWebMap()
    WebMap = LoadResourceFile(GetCurrentResourceName(), "data/webmap.json")
    if WebMap ~= nil then
        WebMap = json.decode(WebMap)
    else
        WebMap = {}
    end

    for k, w in pairs(WebMap) do
        -- temporary fix to ignore bad data
        if not string.find(w.url, "https://None") then
            WebMap[w.url] = w
            Categories[w.category] = w.category
        end
        WebMap[k] = nil
    end

end

local function InitHackingProps()
    -- for k, w in pairs(WebMap) do
    -- end

end

-- EVENTS 

-- CALLBACKS

-- INIT

if Config.EnableHacking then
    LoadLocalWebMap()
    InitHackingProps()
end
