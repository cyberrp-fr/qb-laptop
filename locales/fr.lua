local Translations = {
    darknet = {
        error = {
            ["username_taken"] = "Alias déjà pris par quelqu'un.",
            ["no_user_found"] = "0 utilisateur trouvé avec cet Alias.",
            ["invalid_password"] = "Mot de passe incorrect."
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