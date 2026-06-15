import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import enCatalog from "../components/en.json";
import plCatalog from "../components/pl.json";

export type Locale = "en" | "pl";

export function initI18n() {
    const savedLocale = (localStorage.getItem("locale") as Locale | null) ?? undefined;
    const browserLocale = (navigator.language || "").toLowerCase().startsWith("pl") ? "pl" : "en";
    const locale: Locale = savedLocale ?? browserLocale;

    i18n
        .use(initReactI18next)
        .init({
            resources: {
                en: { translation: enCatalog },
                pl: { translation: plCatalog }
            },
            lng: locale,
            fallbackLng: "en",
            interpolation: {
                escapeValue: false // React already escapes by default
            }
        });

    i18n.on('languageChanged', (lng) => {
        localStorage.setItem("locale", lng);
    });
}

export function useT() {
    const { t } = useTranslation();
    return t as unknown as (key: string, ...args: any[]) => string;
}

export default i18n;
