Utils = {}

Utils.GenerateHash = function(input)
    local hash = ""
    local bytes = { input:byte(1, #input) }
    for i = 1, #bytes do
        hash = hash .. string.format("%02x", bytes[i])
    end
    return hash
end