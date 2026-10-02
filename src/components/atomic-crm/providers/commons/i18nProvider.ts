import { mergeTranslations } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
import frenchMessages from "ra-language-french";
import { raSupabaseEnglishMessages } from "ra-supabase-language-english";
import { raSupabaseFrenchMessages } from "ra-supabase-language-french";
import { arabicCrmMessages } from "./arabicCrmMessages";
import { arabicRaMessages } from "./arabicRaMessages";
import { englishCrmMessages } from "./englishCrmMessages";
import { frenchCrmMessages } from "./frenchCrmMessages";

const raSupabaseEnglishMessagesOverride = {
  "ra-supabase": {
    auth: {
      password_reset: "Check your emails for a Reset Password message.",
    },
  },
};

const raSupabaseFrenchMessagesOverride = {
  "ra-supabase": {
    auth: {
      password_reset:
        "Consultez vos emails pour trouver le message de reinitialisation du mot de passe.",
    },
  },
};

const englishCatalog = mergeTranslations(
  englishMessages,
  raSupabaseEnglishMessages,
  raSupabaseEnglishMessagesOverride,
  englishCrmMessages,
);

const frenchCatalog = mergeTranslations(
  englishCatalog,
  frenchMessages,
  raSupabaseFrenchMessages,
  raSupabaseFrenchMessagesOverride,
  frenchCrmMessages,
);

const arabicCatalog = mergeTranslations(
  englishCatalog,
  arabicRaMessages,
  arabicCrmMessages,
);

type SupportedLocale = "en" | "fr" | "ar";

const RTL_LOCALES = new Set(["ar"]);

export const getLocaleDirection = (locale: string): "rtl" | "ltr" =>
  RTL_LOCALES.has(locale) ? "rtl" : "ltr";

const applyDocumentLocale = (locale: string): void => {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.lang = locale;
  document.documentElement.dir = getLocaleDirection(locale);
};

export const getInitialLocale = (): SupportedLocale => {
  if (typeof navigator === "undefined") {
    return "en";
  }

  const browserLocale = navigator.languages?.[0] ?? navigator.language;
  if (browserLocale?.toLowerCase().startsWith("fr")) {
    return "fr";
  }
  if (browserLocale?.toLowerCase().startsWith("ar")) {
    return "ar";
  }

  return "en";
};

const initialLocale = getInitialLocale();

const polyglotProvider = polyglotI18nProvider(
  (locale) => {
    if (locale === "fr") {
      return frenchCatalog;
    }
    if (locale === "ar") {
      return arabicCatalog;
    }
    return englishCatalog;
  },
  initialLocale,
  [
    { locale: "en", name: "English" },
    { locale: "ar", name: "العربية" },
    { locale: "fr", name: "Français" },
  ],
  { allowMissing: true },
);

applyDocumentLocale(initialLocale);

// Keeps <html lang dir> in sync so Arabic renders right-to-left.
export const i18nProvider = {
  ...polyglotProvider,
  changeLocale: async (locale: string) => {
    await polyglotProvider.changeLocale(locale);
    applyDocumentLocale(locale);
  },
};

export const testI18nProvider = polyglotI18nProvider(
  () => englishCatalog,
  "en",
  [{ locale: "en", name: "English" }],
  { allowMissing: true },
);
