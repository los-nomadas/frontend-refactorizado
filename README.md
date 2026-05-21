# frontend-LOS NOMADAS

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)
![JavaScript](https://img.shields.io/badge/JavaScript-JSX-yellow?logo=javascript)
![Status](https://img.shields.io/badge/Status-Frontend_Project-success)

---

# Español

## 📌 **frontend- LOS NOMADAS**

### Es una aplicación frontend desarrollada para la agencia de viajes ** Los Nómadas**. El proyecto está construido con **React 19**, **Vite 8** y **TailwindCSS 4**, proporcionando una interfaz moderna, rápida y escalable para la gestión de viajes, reservas, hoteles, autobuses, conductores y usuarios. La aplicación consume una API REST mediante **Axios**, utilizando autenticación basada en **JWT** y rutas protegidas.

---

# 🚀 Tecnologías Utilizadas

| Tecnología | Versión |
|---|---|
| React | 19 |
| Vite | 8 |
| TailwindCSS | 4 |
| React Router DOM | 7 |
| Axios | Última compatible |
| JavaScript | JSX |

---

# 📋 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión recomendada: 18 o superior)
- **npm** (incluido con Node.js)

Verificar instalación:

```bash
node -v
npm -v
```

---

# ⚙️ Instalación

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

## 2. Entrar en el directorio del proyecto

```bash
cd frontend-amusement-park
```

## 3. Instalar dependencias

```bash
npm install
```

---

# 🔐 Configuración de Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

# ▶️ Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:

```txt
http://localhost:5173
```

---

# 🏗️ Build de Producción

Generar build optimizado:

```bash
npm run build
```

Previsualizar build:

```bash
npm run preview
```

---

# 📜 Scripts Disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run preview` | Previsualiza el build generado |
| `npm run lint` | Ejecuta ESLint |

---

# 📁 Estructura del Proyecto

```txt
src/
├── api/
│   ├── apiConfig.js
│   └── services.js
│
├── components/
│   ├── common/
│   │   ├── Button
│   │   ├── Feedback
│   │   ├── Modal
│   │   └── ProtectedRoute
│   │
│   └── layout/
│       ├── Header
│       └── Footer
│
├── hooks/
│   └── useAuth.js
│
└── pages/
    ├── bookings/
    ├── buses/
    ├── dashboard/
    ├── drivers/
    ├── home/
    ├── hotels/
    ├── login/
    ├── trips/
    └── users/
```

---

# 🧩 Descripción de Carpetas

## `src/api`

Contiene toda la configuración de comunicación con la API REST:

- `apiConfig.js`
  - Configuración global de Axios
  - Interceptores JWT
  - Manejo de autenticación

- `services.js`
  - Centraliza todos los servicios REST del proyecto

---

## `src/components`

Componentes reutilizables de la aplicación.

### `common/`

Componentes genéricos:

- `Button`
- `Feedback`
- `Modal`
- `ProtectedRoute`

### `layout/`

Componentes de estructura global:

- `Header`
- `Footer`

---

## `src/hooks`

### `useAuth.js`

Hook personalizado para manejo de autenticación y estado del usuario.

---

## `src/pages`

Contiene todas las vistas principales organizadas por módulo.

---

# 🌐 Rutas y Páginas

| Ruta | Página | Descripción |
|---|---|---|
| `/` | HomePage | Página principal |
| `/login` | LoginPage | Inicio de sesión |
| `/trips` | TripsPage | Listado de viajes |
| `/trips/:id` | TripDetailPage | Detalle de un viaje |
| `/users` | UsersPage | Gestión de usuarios |
| `/hotels` | HotelsPage | Gestión de hoteles |
| `/buses` | BusesPage | Gestión de autobuses |
| `/drivers` | DriversPage | Gestión de conductores |
| `/bookings` | BookingsPage | Gestión de reservas |
| `/dashboard` | DashboardPage | Panel administrativo |

---

# 🔌 Servicios API

La aplicación utiliza una capa de servicios centralizada para consumir la API REST.

## Servicios disponibles

| Servicio | Descripción |
|---|---|
| `authService` | Autenticación y login |
| `userService` | Gestión de usuarios |
| `hotelService` | Gestión de hoteles |
| `busService` | Gestión de autobuses |
| `driverService` | Gestión de conductores |
| `tripService` | Gestión de viajes |
| `bookingService` | Gestión de reservas |
| `dashboardService` | Datos y métricas del dashboard |

---

# 🔐 Autenticación JWT

La aplicación implementa autenticación basada en **JSON Web Tokens (JWT)** mediante Axios interceptors.

## Características

- Almacenamiento del token de autenticación
- Inclusión automática del token en cada request
- Protección de rutas privadas mediante `ProtectedRoute`
- Gestión centralizada de autenticación desde `useAuth.js`

---

# 📦 Dependencias Principales

```json
{
  "react": "^19",
  "vite": "^8",
  "tailwindcss": "^4",
  "react-router-dom": "^7",
  "axios": "^1"
}
```

---

# 🌍 English

### frontend-LOS NOMADAS is a frontend application developed for the **Nómadas** travel agency.

The project is built using **React 19**, **Vite 8**, and **TailwindCSS 4**, providing a modern, fast, and scalable interface for managing trips, bookings, hotels, buses, drivers, and users.

The application consumes a REST API using **Axios**, implementing **JWT-based authentication** and protected routes.

---

# 🚀 Technologies Used

| Technology | Version |
|---|---|
| React | 19 |
| Vite | 8 |
| TailwindCSS | 4 |
| React Router DOM | 7 |
| Axios | Latest compatible |
| JavaScript | JSX |

---

# 📋 Prerequisites

Before running the project, ensure you have installed:

- **Node.js** (recommended version: 18 or higher)
- **npm** (included with Node.js)

Check installation:

```bash
node -v
npm -v
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <REPOSITORY_URL>
```

## 2. Navigate to the project directory

```bash
cd frontend-amusement-park
```

## 3. Install dependencies

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

# ▶️ Run in Development Mode

```bash
npm run dev
```

The application will be available at:

```txt
http://localhost:5173
```

---

# 🏗️ Production Build

Generate optimized production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts development server |
| `npm run build` | Generates production build |
| `npm run preview` | Previews generated build |
| `npm run lint` | Runs ESLint |

---

# 📁 Project Structure

```txt
src/
├── api/
│   ├── apiConfig.js
│   └── services.js
│
├── components/
│   ├── common/
│   │   ├── Button
│   │   ├── Feedback
│   │   ├── Modal
│   │   └── ProtectedRoute
│   │
│   └── layout/
│       ├── Header
│       └── Footer
│
├── hooks/
│   └── useAuth.js
│
└── pages/
    ├── bookings/
    ├── buses/
    ├── dashboard/
    ├── drivers/
    ├── home/
    ├── hotels/
    ├── login/
    ├── trips/
    └── users/
```

---

# 🧩 Folder Description

## `src/api`

Contains all REST API communication logic:

- `apiConfig.js`
  - Global Axios configuration
  - JWT interceptors
  - Authentication handling

- `services.js`
  - Centralized REST service layer

---

## `src/components`

Reusable application components.

### `common/`

Generic shared components:

- `Button`
- `Feedback`
- `Modal`
- `ProtectedRoute`

### `layout/`

Global layout components:

- `Header`
- `Footer`

---

## `src/hooks`

### `useAuth.js`

Custom hook for authentication and user state management.

---

## `src/pages`

Contains all main application views organized by module.

---

# 🌐 Routes and Pages

| Route | Page | Description |
|---|---|---|
| `/` | HomePage | Main landing page |
| `/login` | LoginPage | User login |
| `/trips` | TripsPage | Trips listing |
| `/trips/:id` | TripDetailPage | Trip details |
| `/users` | UsersPage | User management |
| `/hotels` | HotelsPage | Hotel management |
| `/buses` | BusesPage | Bus management |
| `/drivers` | DriversPage | Driver management |
| `/bookings` | BookingsPage | Booking management |
| `/dashboard` | DashboardPage | Administrative dashboard |

---

# 🔌 API Services

The application uses a centralized service layer to consume the REST API.

## Available Services

| Service | Description |
|---|---|
| `authService` | Authentication and login |
| `userService` | User management |
| `hotelService` | Hotel management |
| `busService` | Bus management |
| `driverService` | Driver management |
| `tripService` | Trip management |
| `bookingService` | Booking management |
| `dashboardService` | Dashboard metrics and analytics |

---

# 🔐 JWT Authentication

The application implements **JSON Web Token (JWT)** authentication using Axios interceptors.

## Features

- Authentication token storage
- Automatic token injection into requests
- Private route protection using `ProtectedRoute`
- Centralized authentication handling via `useAuth.js`

---

# 📦 Main Dependencies

```json
{
  "react": "^19",
  "vite": "^8",
  "tailwindcss": "^4",
  "react-router-dom": "^7",
  "axios": "^1"
}
```
