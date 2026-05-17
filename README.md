# Nomadas Frontend

Frontend de la aplicación web para la agencia de viajes Nomadas
(proyecto final, bootcamp Factoría F5).

> Este repositorio se encuentra en **FASE 1: limpieza**. La
> implementación completa del briefing (CRUD de User, Hotel,
> Driver, Bus, Trip y Booking, dashboard de dirección, formulario
> de reserva con acompañantes) se construye en **FASE 2** sobre
> esta base limpia.

## Stack

- React
- Vite
- JavaScript / JSX
- Tailwind CSS
- Axios
- Vitest + React Testing Library
- Playwright

## Comandos

```bash
npm install
npm run dev
npm run build
npm run test
```

## Variables de entorno

Copiar `.env.example` a `.env` y configurar:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Ramas

- `dev` — rama de integración (única en uso).
- `main` — bloqueada para entregas estables.
