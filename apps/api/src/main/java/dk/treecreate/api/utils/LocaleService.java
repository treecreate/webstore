package dk.treecreate.api.utils;

import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class LocaleService {
  public Locale getLocale(String lang) {
    return lang == null ? new Locale("dk") : new Locale(lang); // default locale is danish
  }
}
