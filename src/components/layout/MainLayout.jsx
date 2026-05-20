function MainLayout({ children }) {
  return (
    <div style={{ backgroundColor: '#050816', color: 'white' }}>
      <main style={{ padding: '40px' }}>
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
