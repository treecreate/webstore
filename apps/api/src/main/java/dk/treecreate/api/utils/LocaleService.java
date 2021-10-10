package dk.treecreate.api.utils;

import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class LocaleService
{
    public Locale getLocale(String lang)
    {
        return lang == null ? new Locale("dk") : new Locale(lang); // default locale is danish
    }
}
