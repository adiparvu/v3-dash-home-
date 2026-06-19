"use client";

/**
 * Calling integrations sheet (spec: Communication & Collaboration → Calling Integrations).
 * From a contact profile or chat, the user may initiate a Standard Phone Call,
 * FaceTime Audio/Video, WhatsApp Audio/Video or Telegram Audio/Video. Each option
 * deep-links to the corresponding installed service via its URL scheme.
 */

export type CallContact = {
  name: string;
  /** E.164-ish phone string, e.g. "+40 722 000 001". Optional. */
  phone?: string;
  /** Telegram username (without @) or falls back to the phone number. */
  telegram?: string;
};

/** Strip everything except digits and a leading +, for URL schemes. */
function toDigits(phone: string): string {
  const trimmed = phone.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/[^\d]/g, "");
}

type Option = { id: string; label: string; icon: string; href: string; color: string };

function buildOptions(contact: CallContact): Option[] {
  const opts: Option[] = [];
  const phone = contact.phone && contact.phone !== "—" ? toDigits(contact.phone) : "";
  const waNumber = phone.replace(/^\+/, "");

  if (phone) {
    opts.push({ id: "phone", label: "Phone Call", icon: "📞", href: `tel:${phone}`, color: "#4ADE80" });
    opts.push({ id: "ft-audio", label: "FaceTime Audio", icon: "🎧", href: `facetime-audio:${phone}`, color: "#22D3EE" });
    opts.push({ id: "ft-video", label: "FaceTime Video", icon: "📹", href: `facetime:${phone}`, color: "#22D3EE" });
    opts.push({ id: "wa-audio", label: "WhatsApp Audio", icon: "🔊", href: `https://wa.me/${waNumber}`, color: "#25D366" });
    opts.push({ id: "wa-video", label: "WhatsApp Video", icon: "🎥", href: `https://wa.me/${waNumber}`, color: "#25D366" });
  }

  const tg = contact.telegram?.replace(/^@/, "");
  if (tg) {
    opts.push({ id: "tg-audio", label: "Telegram Audio", icon: "🔊", href: `https://t.me/${tg}`, color: "#229ED9" });
    opts.push({ id: "tg-video", label: "Telegram Video", icon: "🎥", href: `https://t.me/${tg}`, color: "#229ED9" });
  } else if (phone) {
    opts.push({ id: "tg-audio", label: "Telegram Audio", icon: "🔊", href: `https://t.me/${waNumber}`, color: "#229ED9" });
    opts.push({ id: "tg-video", label: "Telegram Video", icon: "🎥", href: `https://t.me/${waNumber}`, color: "#229ED9" });
  }

  return opts;
}

export default function CallMenu({ contact, onClose }: { contact: CallContact; onClose: () => void }) {
  const options = buildOptions(contact);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
        <h2 className="font-bold text-lg mb-0.5" style={{ color: "var(--text-1)" }}>Call {contact.name}</h2>
        <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>Choose a service to launch</p>

        {options.length === 0 ? (
          <p className="text-text-secondary text-sm py-6 text-center">No phone number on file for this contact.</p>
        ) : (
          <div className="rounded-2xl overflow-hidden mb-3" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
            {options.map((o, i) => (
              <a
                key={o.id}
                href={o.href}
                target={o.href.startsWith("http") ? "_blank" : undefined}
                rel={o.href.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={onClose}
                className="w-full flex items-center gap-3 px-4 py-3.5"
                style={{ borderBottom: i < options.length - 1 ? "0.5px solid var(--glass-border)" : undefined }}
              >
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: `${o.color}1a`, border: `1px solid ${o.color}33` }}>{o.icon}</span>
                <span className="text-sm font-medium flex-1" style={{ color: "var(--text-1)" }}>{o.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            ))}
          </div>
        )}

        <button onClick={onClose} className="w-full py-3.5 rounded-2xl font-medium text-base" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>Cancel</button>
      </div>
    </div>
  );
}
