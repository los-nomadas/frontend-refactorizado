function ProfilePage() {

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050816',
        color: 'white',
        padding: '40px',
      }}
    >

      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}
      >

        <div
          style={{
            backgroundColor: '#111827',
            padding: '40px',
            borderRadius: '20px',
          }}
        >

          <h1
            style={{
              fontSize: '42px',
              marginBottom: '20px',
            }}
          >
            Mi perfil
          </h1>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              fontSize: '18px',
            }}
          >

            <p>
              Usuario: {user?.username}
            </p>

            <p>
              Estado:
              {' '}
              <span
                style={{
                  color: '#22c55e',
                  fontWeight: 'bold',
                }}
              >
                Activo
              </span>
            </p>

            <p>
              Tipo de cuenta: Premium
            </p>

          </div>

        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
          }}
        >

          <div
            style={{
              backgroundColor: '#111827',
              padding: '30px',
              borderRadius: '16px',
            }}
          >

            <h2>
              ❤️ Favoritos
            </h2>

            <p>
              Gestiona tus viajes favoritos.
            </p>

          </div>

          <div
            style={{
              backgroundColor: '#111827',
              padding: '30px',
              borderRadius: '16px',
            }}
          >

            <h2>
              🎫 Reservas
            </h2>

            <p>
              Consulta tus reservas activas.
            </p>

          </div>

          <div
            style={{
              backgroundColor: '#111827',
              padding: '30px',
              borderRadius: '16px',
            }}
          >

            <h2>
              ⚙️ Configuración
            </h2>

            <p>
              Ajusta tu cuenta y preferencias.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProfilePage;