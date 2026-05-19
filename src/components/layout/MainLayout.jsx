import Header from './Header';

import Footer from './Footer';

function MainLayout({ children }) {

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050816',
        color: 'white',
      }}
    >

      <Header />

      <main
        style={{
          padding: '40px',
        }}
      >
        {children}
      </main>

      <Footer />

    </div>
  );
}

export default MainLayout;