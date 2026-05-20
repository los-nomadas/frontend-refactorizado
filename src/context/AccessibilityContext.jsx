import { createContext, useContext, useEffect, useState } from 'react';

const AccessibilityContext = createContext(null);

const DEFAULTS = { dayMode: false, highContrast: false, largeText: false };

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('nomadas-a11y');
      return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('nomadas-a11y', JSON.stringify(settings));
    const html = document.documentElement;
    html.classList.toggle('a11y-day', settings.dayMode);
    html.classList.toggle('a11y-contrast', settings.highContrast);
    html.classList.toggle('a11y-large', settings.largeText);
  }, [settings]);

  const toggle = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <AccessibilityContext.Provider value={{ settings, toggle }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be inside AccessibilityProvider');
  return ctx;
}
