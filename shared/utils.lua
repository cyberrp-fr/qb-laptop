Utils = {}

Utils.GenerateHash = function(input)
    local hash = ""
    local bytes = { input:byte(1, #input) }
    for i = 1, #bytes do
        hash = hash .. string.format("%02x", bytes[i])
    end
    return hash
end

Utils.TableLength = function (t)
    local c = 0
    for _ in pairs(t) do
        c = c + 1
    end
    return c
end