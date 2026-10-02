import { afterEach, describe, expect, it, vi } from "vitest";
import { getInitialLocale, i18nProvider } from "./i18nProvider";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("i18nProvider", () => {
  it("registers en, ar and fr locales", () => {
    expect(i18nProvider.getLocales?.()).toEqual([
      { locale: "en", name: "English" },
      { locale: "ar", name: "العربية" },
      { locale: "fr", name: "Français" },
    ]);
  });

  it("translates crm keys in arabic", async () => {
    await i18nProvider.changeLocale("ar");

    expect(i18nProvider.translate("crm.language")).toBe("اللغة");
    expect(i18nProvider.translate("ra.action.save")).toBe("حفظ");
  });

  it("uses arabic plural forms for counts", async () => {
    await i18nProvider.changeLocale("ar");

    expect(
      i18nProvider.translate("crm.common.task_count", { smart_count: 2 }),
    ).toBe("مهمتان");
    expect(
      i18nProvider.translate("crm.common.task_count", { smart_count: 5 }),
    ).toBe("5 مهام");
    expect(
      i18nProvider.translate("crm.common.task_count", { smart_count: 20 }),
    ).toBe("20 مهمة");
  });

  it("uses the plural resource name for list titles in arabic", async () => {
    await i18nProvider.changeLocale("ar");

    expect(
      i18nProvider.translate("resources.contacts.name", { smart_count: 2 }),
    ).toBe("جهات الاتصال");
  });

  it("switches the document to right-to-left for arabic and back", async () => {
    await i18nProvider.changeLocale("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("ar");

    await i18nProvider.changeLocale("en");
    expect(document.documentElement.dir).toBe("ltr");
    expect(document.documentElement.lang).toBe("en");
  });

  it("uses browser arabic locale when available", () => {
    vi.stubGlobal("navigator", {
      language: "ar-EG",
      languages: ["ar-EG", "en-US"],
    });

    expect(getInitialLocale()).toBe("ar");
  });

  it("translates the language key in french", async () => {
    await i18nProvider.changeLocale("fr");

    expect(i18nProvider.translate("crm.language")).toBe("Langue");
  });

  it("falls back to english for unknown locales", async () => {
    await i18nProvider.changeLocale("es");

    expect(i18nProvider.translate("crm.language")).toBe("Language");
  });

  it("uses customized password reset overrides for en and fr", async () => {
    await i18nProvider.changeLocale("en");
    expect(i18nProvider.translate("ra-supabase.auth.password_reset")).toBe(
      "Check your emails for a Reset Password message.",
    );

    await i18nProvider.changeLocale("fr");
    expect(i18nProvider.translate("ra-supabase.auth.password_reset")).toBe(
      "Consultez vos emails pour trouver le message de reinitialisation du mot de passe.",
    );
  });

  it("translates recently added fr crm keys", async () => {
    await i18nProvider.changeLocale("fr");

    expect(i18nProvider.translate("resources.deals.empty.title")).toBe(
      "Aucune affaire trouvée",
    );
  });

  it("uses browser french locale when available", () => {
    vi.stubGlobal("navigator", {
      language: "fr-FR",
      languages: ["fr-FR", "en-US"],
    });

    expect(getInitialLocale()).toBe("fr");
  });

  it("falls back to english when browser locale is unsupported", () => {
    vi.stubGlobal("navigator", {
      language: "es-ES",
      languages: ["es-ES", "pt-BR"],
    });

    expect(getInitialLocale()).toBe("en");
  });
});
