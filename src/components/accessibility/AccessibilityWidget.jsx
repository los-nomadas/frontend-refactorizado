import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

const AccessibilityIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="5" r="2.4" fill="white" />
    <path
      d="M4.5 10.5C7 9.5 9.5 9 12 9s5 .5 7.5 1.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line x1="12" y1="9.5" x2="12" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="17" x2="9" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="17" x2="15" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
  </svg>
);

const ContrastIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
  </svg>
);

const TextSizeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <text x="1" y="18" fontFamily="system-ui" fontSize="16" fontWeight="700" fill="currentColor">A</text>
    <text x="13" y="14" fontFamily="system-ui" fontSize="10" fontWeight="600" fill="currentColor">A</text>
  </svg>
);

const Toggle = ({ active, onToggle, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={active}
    aria-label={label}
    onClick={onToggle}
    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    style={{ backgroundColor: active ? '#2563eb' : 'rgba(255,255,255,0.15)' }}
  >
    <span
      className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
      style={{ transform: active ? 'translateX(24px)' : 'translateX(4px)' }}
    />
  </button>
);

const ITEMS = [
  {
    key: 'dayMode',
    label: 'Modo día',
    desc: 'Fondo claro',
    Icon: SunIcon,
  },
  {
    key: 'highContrast',
    label: 'Alto contraste',
    desc: 'Mayor legibilidad',
    Icon: ContrastIcon,
  },
  {
    key: 'largeText',
    label: 'Texto grande',
    desc: '+20% tamaño',
    Icon: TextSizeIcon,
  },
];

function AccessibilityWidget() {
  const { settings, toggle } = useAccessibility();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Opciones de accesibilidad"
          className="w-64 overflow-hidden rounded-2xl border border-white/10 bg-gray-950/95 shadow-2xl backdrop-blur-md"
          style={{ animation: 'a11y-panel-in 0.18s ease-out' }}
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Accesibilidad
            </p>
          </div>

          <ul className="divide-y divide-white/[0.06] px-1 py-1">
            {ITEMS.map(({ key, label, desc, Icon }) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: settings[key]
                        ? 'rgba(37,99,235,0.25)'
                        : 'rgba(255,255,255,0.07)',
                      color: settings[key] ? '#60a5fa' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    <Icon />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-white leading-tight">
                      {label}
                    </span>
                    <span className="block text-xs text-white/40 leading-tight mt-0.5">
                      {desc}
                    </span>
                  </span>
                  <Toggle active={settings[key]} onToggle={() => toggle(key)} label={label} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir opciones de accesibilidad"
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform duration-150 active:scale-95"
        style={{
          background: open
            ? 'linear-gradient(135deg, #1d4ed8, #2563eb)'
            : 'linear-gradient(135deg, #1e40af, #2563eb)',
          boxShadow: open
            ? '0 0 0 3px rgba(37,99,235,0.35), 0 8px 24px rgba(37,99,235,0.4)'
            : '0 4px 20px rgba(37,99,235,0.35)',
        }}
      >
        <AccessibilityIcon />
      </button>
    </div>
  );
}

export default AccessibilityWidget;
