package dk.treecreate.api.utils;

import java.util.Locale;

public class LocaleService
{
    public static Locale getLocale(String lang)
    {
        return lang == null ? new Locale("dk") : new Locale(lang); // default locale is danish
    }
}
