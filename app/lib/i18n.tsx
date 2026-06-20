"use client";

/**
 * Lightweight i18n layer for the prototype.
 *
 * A framework-free locale provider + `useT()` hook backed by a typed EN/RO
 * dictionary, persisted to localStorage (`prvio-locale`) and reflected on the
 * <html lang> attribute. English is the canonical keyset; other locales must
 * provide the same keys (enforced by the `Record<MessageKey, string>` type).
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Locale = "en" | "ro";

export const LOCALES: { id: Locale; label: string; native: string; flag: string }[] = [
  { id: "en", label: "English", native: "English", flag: "🇬🇧" },
  { id: "ro", label: "Romanian", native: "Română", flag: "🇷🇴" },
];

const en = {
  // Bottom navigation
  "nav.overview": "Overview",
  "nav.zones": "Zones",
  "nav.inventory": "Inventory",
  "nav.tasks": "Tasks",
  "nav.more": "More",
  // Overview / home
  "home.greeting": "Good morning",
  "home.live": "Live",
  "home.updatedNow": "Updated just now",
  "home.quickAccess": "Quick Access",
  "home.seeAll": "See all",
  "home.recentActivity": "Recent Activity",
  "home.clearAll": "Clear all",
  "home.healthScore": "Health Score",
  // Stats
  "stat.zones": "Zones",
  "stat.objects": "Objects",
  "stat.tasks": "Tasks",
  "stat.alerts": "Alerts",
  // More — section titles
  "more.title": "More",
  "more.estate": "Estate",
  "more.monitoring": "Monitoring",
  "more.account": "Account",
  "more.signOut": "Sign Out",
  // Common
  "common.back": "Back",
  "common.retry": "Try again",
  "common.loading": "Loading…",
  "common.empty": "Nothing here yet",
  "common.error": "Something went wrong",
  // Language settings
  "lang.title": "Language & Region",
  "lang.appLanguage": "App Language",
  "lang.timezone": "Time Zone",
} as const;

export type MessageKey = keyof typeof en;
type Dictionary = Record<MessageKey, string>;

const ro: Dictionary = {
  "nav.overview": "Acasă",
  "nav.zones": "Zone",
  "nav.inventory": "Inventar",
  "nav.tasks": "Sarcini",
  "nav.more": "Mai mult",
  "home.greeting": "Bună dimineața",
  "home.live": "Live",
  "home.updatedNow": "Actualizat acum",
  "home.quickAccess": "Acces rapid",
  "home.seeAll": "Vezi tot",
  "home.recentActivity": "Activitate recentă",
  "home.clearAll": "Șterge tot",
  "home.healthScore": "Scor de sănătate",
  "stat.zones": "Zone",
  "stat.objects": "Obiecte",
  "stat.tasks": "Sarcini",
  "stat.alerts": "Alerte",
  "more.title": "Mai mult",
  "more.estate": "Proprietate",
  "more.monitoring": "Monitorizare",
  "more.account": "Cont",
  "more.signOut": "Deconectare",
  "common.back": "Înapoi",
  "common.retry": "Reîncearcă",
  "common.loading": "Se încarcă…",
  "common.empty": "Încă nimic aici",
  "common.error": "Ceva nu a mers bine",
  "lang.title": "Limbă și regiune",
  "lang.appLanguage": "Limba aplicației",
  "lang.timezone": "Fus orar",
};

const dictionaries: Record<Locale, Dictionary> = { en, ro };

const STORAGE_KEY = "prvio-locale";

type I18nCtx = { locale: Locale; setLocale: (l: Locale) => void; t: (key: MessageKey) => string };

const I18nContext = createContext<I18nCtx>({
  locale: "en",
  setLocale: () => {},
  t: (key) => en[key],
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && saved in dictionaries) setLocaleState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((key: MessageKey) => dictionaries[locale][key] ?? en[key], [locale]);

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
export const useT = () => useContext(I18nContext).t;
