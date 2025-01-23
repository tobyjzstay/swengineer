import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en_AU from "./locales/en-AU.json";
import en_GB from "./locales/en-GB.json";
import en_NZ from "./locales/en-NZ.json";
import en_US from "./locales/en-US.json";
import mi_NZ from "./locales/mi-NZ.json";
import zh_CN from "./locales/zh-CN.json";

const isQueryLangPresent = new URLSearchParams(window.location.search).has("lang");

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            "en-AU": {
                translation: en_AU,
            },
            "en-GB": {
                translation: en_GB,
            },
            "en-NZ": {
                translation: en_NZ,
            },
            "en-US": {
                translation: en_US,
            },
            en: {
                translation: en_US,
            },
            "mi-NZ": {
                translation: mi_NZ,
            },
            mi: {
                translation: mi_NZ,
            },
            "zh-CN": {
                translation: zh_CN,
            },
            zh: {
                translation: zh_CN,
            },
        },
        fallbackLng: "en",
        detection: {
            order: [isQueryLangPresent ? "querystring" : "localStorage", "navigator"],
            lookupQuerystring: "lang",
            caches: isQueryLangPresent ? [] : ["localStorage"],
        },
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });
