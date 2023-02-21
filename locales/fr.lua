local Translations = {
    darknet = {
        error = {
            ["username_taken"] = "Alias déjà pris par quelqu'un."
        }
    }
}

if GetConvar("qb_locale", "en") == "fr" then
    Lang = Locale:new({
        phrases = Translations,
        warnOnMissing = true,
        fallbackLang = Lang,
    })
end