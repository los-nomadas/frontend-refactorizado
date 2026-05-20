function MainLayout({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050816',
        color: 'white',
      }}
    >
      <main
        style={{
          padding: '40px',
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
