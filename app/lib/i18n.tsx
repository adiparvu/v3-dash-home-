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
  // Page titles
  "page.settings": "Settings",
  "page.diagnostics": "Diagnostics",
  "page.insights": "Insights",
  "page.budget": "Budget",
  "page.maintenance": "Maintenance",
  "page.sensors": "Sensors",
  "page.notifications": "Notifications",
  "page.search": "Search",
  "page.contractors": "Contractors",
  "page.automations": "Automations",
  "page.inventory": "Inventory",
  "page.tasks": "Tasks",
  "page.properties": "Properties",
  "page.documents": "Documents",
  "page.widgets": "Widgets",
  "page.zones": "Zones",
  // Settings — section titles
  "set.account": "Account",
  "set.estate": "Estate",
  "set.app": "App",
  // Settings — items
  "set.editProfile": "Edit Profile",
  "set.editProfile.desc": "Name, avatar, display preferences",
  "set.security": "Security",
  "set.security.desc": "Face ID, sessions & audit log",
  "set.privacy": "Privacy & Data",
  "set.privacy.desc": "GDPR, data exports & deletion",
  "set.notifications": "Notifications",
  "set.notifications.desc": "Alerts & push preferences",
  "set.assistant": "AI Assistant",
  "set.assistant.desc": "Name, avatar, personality & model",
  "set.guardrails": "AI Guardrails",
  "set.guardrails.desc": "Policy, allowlisted tools & AI audit",
  "set.properties": "Properties",
  "set.properties.desc": "Manage properties & parcels",
  "set.transfer": "Transfer Ownership",
  "set.transfer.desc": "Verified, legally-recorded transfer",
  "set.units": "Units & Currency",
  "set.units.desc": "Metric/Imperial, EUR/USD",
  "set.integrations": "Integrations",
  "set.integrations.desc": "Home Assistant, sensors, APIs",
  "set.appearance": "Appearance",
  "set.appearance.desc": "Theme, accent color, layout",
  "set.language": "Language & Region",
  "set.language.desc": "Language, timezone, date format",
  // More — item labels (extra)
  "more.chat": "Chat",
  "more.energy": "Energy",
  "more.floorplan": "Floorplan",
  // More — item descriptions
  "more.d.automations": "Smart rules & triggers",
  "more.d.chat": "Household live messages",
  "more.d.ai": "Your personal estate AI",
  "more.d.properties": "Manage your properties",
  "more.d.budget": "Expenses, categories & trends",
  "more.d.documents": "Deeds, manuals & records",
  "more.d.insights": "Proactive estate recommendations",
  "more.d.energy": "Solar, Powerwall & grid flow",
  "more.d.floorplan": "Live rooms · energy · presence",
  "more.d.sensors": "26 connected sensors",
  "more.d.diagnostics": "Possible faults & suggestions",
  "more.d.maintenance": "Schedule & history",
  "more.d.contractors": "Service providers",
  "more.d.widgets": "Home, Lock Screen & Live Activities",
  "more.d.settings": "Preferences & security",
  "more.d.privacy": "GDPR, exports & deletion",
  // Notifications
  "notif.unread": "unread",
  "notif.pushOn": "Push on",
  "notif.enablePush": "Enable push",
  "notif.blocked": "Blocked",
  "notif.markAllRead": "Mark all read",
  "notif.liveAlerts": "Live alerts",
  "notif.live": "Live",
  "notif.simulated": "Simulated",
  "notif.historySynced": "History · synced",
  "notif.allCaughtUp": "All caught up",
  "notif.noNew": "You have no new notifications.",
  "common.now": "now",
  "common.synced": "Synced",
  // Filters / status / priority (shared)
  "f.all": "All",
  "f.pending": "Pending",
  "f.inProgress": "In Progress",
  "f.completed": "Completed",
  "f.due": "Due",
  "f.scheduled": "Scheduled",
  "f.done": "Done",
  "f.total": "Total",
  "prio.high": "High",
  "prio.normal": "Normal",
  "prio.low": "Low",
  "prio.medium": "Medium",
  // Tasks
  "tasks.add": "Add task",
  "tasks.new": "New Task",
  "tasks.titleField": "Title",
  "tasks.titlePlaceholder": "e.g. Check irrigation valves",
  "tasks.zone": "Zone",
  "tasks.priority": "Priority",
  "tasks.markDone": "Mark as done",
  "tasks.markNotDone": "Mark as not done",
  // Maintenance
  "maint.assignee": "Assignee",
  "maint.category": "Category",
  "maint.markComplete": "Mark Complete",
  "maint.reschedule": "Reschedule",
  "maint.add": "Add maintenance",
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
  "page.settings": "Setări",
  "page.diagnostics": "Diagnostic",
  "page.insights": "Recomandări",
  "page.budget": "Buget",
  "page.maintenance": "Mentenanță",
  "page.sensors": "Senzori",
  "page.notifications": "Notificări",
  "page.search": "Căutare",
  "page.contractors": "Contractori",
  "page.automations": "Automatizări",
  "page.inventory": "Inventar",
  "page.tasks": "Sarcini",
  "page.properties": "Proprietăți",
  "page.documents": "Documente",
  "page.widgets": "Widget-uri",
  "page.zones": "Zone",
  "set.account": "Cont",
  "set.estate": "Proprietate",
  "set.app": "Aplicație",
  "set.editProfile": "Editează profilul",
  "set.editProfile.desc": "Nume, avatar, preferințe de afișare",
  "set.security": "Securitate",
  "set.security.desc": "Face ID, sesiuni și jurnal de audit",
  "set.privacy": "Confidențialitate și date",
  "set.privacy.desc": "GDPR, export și ștergere date",
  "set.notifications": "Notificări",
  "set.notifications.desc": "Alerte și preferințe push",
  "set.assistant": "Asistent AI",
  "set.assistant.desc": "Nume, avatar, personalitate și model",
  "set.guardrails": "Reguli AI",
  "set.guardrails.desc": "Politici, unelte permise și audit AI",
  "set.properties": "Proprietăți",
  "set.properties.desc": "Gestionează proprietăți și parcele",
  "set.transfer": "Transfer proprietate",
  "set.transfer.desc": "Transfer verificat, înregistrat legal",
  "set.units": "Unități și monedă",
  "set.units.desc": "Metric/Imperial, EUR/USD",
  "set.integrations": "Integrări",
  "set.integrations.desc": "Home Assistant, senzori, API-uri",
  "set.appearance": "Aspect",
  "set.appearance.desc": "Temă, culoare accent, aranjament",
  "set.language": "Limbă și regiune",
  "set.language.desc": "Limbă, fus orar, format dată",
  "more.chat": "Chat",
  "more.energy": "Energie",
  "more.floorplan": "Plan etaj",
  "more.d.automations": "Reguli inteligente și declanșatori",
  "more.d.chat": "Mesaje live în gospodărie",
  "more.d.ai": "AI-ul tău personal pentru proprietate",
  "more.d.properties": "Gestionează proprietățile",
  "more.d.budget": "Cheltuieli, categorii și tendințe",
  "more.d.documents": "Acte, manuale și înregistrări",
  "more.d.insights": "Recomandări proactive pentru proprietate",
  "more.d.energy": "Solar, Powerwall și rețea",
  "more.d.floorplan": "Camere live · energie · prezență",
  "more.d.sensors": "26 de senzori conectați",
  "more.d.diagnostics": "Posibile defecțiuni și sugestii",
  "more.d.maintenance": "Program și istoric",
  "more.d.contractors": "Furnizori de servicii",
  "more.d.widgets": "Acasă, ecran blocat și Live Activities",
  "more.d.settings": "Preferințe și securitate",
  "more.d.privacy": "GDPR, export și ștergere",
  "notif.unread": "necitite",
  "notif.pushOn": "Push activ",
  "notif.enablePush": "Activează push",
  "notif.blocked": "Blocat",
  "notif.markAllRead": "Marchează toate citite",
  "notif.liveAlerts": "Alerte live",
  "notif.live": "Live",
  "notif.simulated": "Simulat",
  "notif.historySynced": "Istoric · sincronizat",
  "notif.allCaughtUp": "Ești la zi",
  "notif.noNew": "Nu ai notificări noi.",
  "common.now": "acum",
  "common.synced": "Sincronizat",
  "f.all": "Toate",
  "f.pending": "În așteptare",
  "f.inProgress": "În lucru",
  "f.completed": "Finalizate",
  "f.due": "Scadente",
  "f.scheduled": "Programate",
  "f.done": "Gata",
  "f.total": "Total",
  "prio.high": "Ridicat",
  "prio.normal": "Normal",
  "prio.low": "Scăzut",
  "prio.medium": "Mediu",
  "tasks.add": "Adaugă sarcină",
  "tasks.new": "Sarcină nouă",
  "tasks.titleField": "Titlu",
  "tasks.titlePlaceholder": "ex. Verifică vanele de irigare",
  "tasks.zone": "Zonă",
  "tasks.priority": "Prioritate",
  "tasks.markDone": "Marchează ca finalizat",
  "tasks.markNotDone": "Marchează ca nefinalizat",
  "maint.assignee": "Responsabil",
  "maint.category": "Categorie",
  "maint.markComplete": "Marchează finalizat",
  "maint.reschedule": "Reprogramează",
  "maint.add": "Adaugă mentenanță",
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
