local Webmap

-- vulnerabilities naming
local SQL_INJECTION = "sql_injection"
local XSS = "xss"
local CODE_INJECTION = "code_injection"

-- active meaning implemented so far, initially i'm gonna implement "sql injection" and after the rest will following
local ActiveVulnerabilities = {SQL_INJECTION}
local Probability = 0.2

-- FUNCTIONS

local function LoadLocalWebMap()
    WebMap = LoadResourceFile(GetCurrentResourceName(), "data/webmap.json")
    if WebMap ~= nil then
        WebMap = json.decode(WebMap)
    else
        WebMap = {}
    end
end

local function InitHackingProps()
    for k, w in pairs(WebMap) do
        local website = w
    end
end

-- EVENTS 

-- CALLBACKS

-- INIT

if Config.EnableHacking then
    LoadLocalWebMap()
    InitHackingProps()
end

-- MAIN LOOP
