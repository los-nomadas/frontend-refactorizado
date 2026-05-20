import { useAccessibility } from '../../context/AccessibilityContext';

function MainLayout({ children }) {
  const { settings } = useAccessibility();
  return (
    <div
      style={{
        backgroundColor: settings.dayMode ? '#f1f5f9' : '#050816',
        color: settings.dayMode ? '#0f172a' : 'white',
        minHeight: 'calc(100vh - 56px)',
      }}
    >
      <main style={{ padding: '40px' }}>
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
