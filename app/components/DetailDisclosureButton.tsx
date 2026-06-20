"use client";

/**
 * Detail Disclosure Button — the iOS circled-"i" affordance (UIButtonType
 * .detailDisclosure). Use it on a row whose main tap does one thing, while the
 * ⓘ reveals more detail (typically opening a DetailSheet). Accessible by
 * default: it carries an aria-label and stops propagation so it never triggers
 * the surrounding row's action.
 */
type Props = {
  onPress: () => void;
  /** Accessible label, e.g. "Details for Morning Irrigation". */
  label: string;
  color?: string;
  size?: number;
};

export default function DetailDisclosureButton({ onPress, label, color = "var(--accent)", size = 26 }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onPress();
      }}
      className="flex-shrink-0 flex items-center justify-center rounded-full active:scale-90 transition-transform"
      style={{ width: size, height: size, color }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="8" r="1.05" fill="currentColor" />
        <path d="M12 11v5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  );
}
