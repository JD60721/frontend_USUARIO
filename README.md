# frontend_USUARIO

Aplicación frontend en React + Vite para gestionar autenticación y selección de inventario.

## Requisitos
- Node.js 18+ (recomendado LTS)
- npm 9+

## Instalación y ejecución
1. Instalar dependencias
   - `npm install`
2. Configurar variables de entorno (Vite)
   - Copia `.env.example` a `.env`
   - Ajusta `VITE_API_URL` con la URL del backend
3. Iniciar el servidor de desarrollo
   - `npm run dev`
   - Abre `http://localhost:5173`

## Variables de entorno
- `VITE_API_URL` (obligatoria)
  - URL base del backend, por ejemplo: `http://localhost:5000/api`
  - El cliente HTTP (`src/services/api.js`) usa `import.meta.env.VITE_API_URL` y, si no está definida, cae en `http://localhost:5000/api`.

## Estructura
- `src/pages/Login.jsx`: Login/Registro con JWT (token guardado en `localStorage`).
- `src/pages/Products.jsx`: Selección de productos con cantidades y persistencia al backend.
- `src/services/api.js`: Cliente Axios configurado con `VITE_API_URL`.
- `src/App.jsx`: Rutas (`/login`, `/productos`).

## Flujo básico
1. Registro/Login en `/login`.
2. Redirección a `/productos` si hay token.
3. Seleccionar cantidades y pulsar "Guardar selección".
4. Se envía `POST /products/selection` con `Authorization: Bearer <token>`.

## Backend relacionado
- Puerto por defecto: `5000`.
- CORS configurado con `CLIENT_URL` (por defecto `http://localhost:5173`).
- Endpoints usados:
  - `POST /api/auth/register`, `POST /api/auth/login`
  - `POST /api/products/selection`

## Problemas comunes
- Error de red en Login: verifica que el backend esté activo en `http://localhost:5000`.
- Token inválido/no presente: el backend responde 401; vuelve a iniciar sesión.

## Scripts
- `npm run dev`: Vite dev server.
- `npm run build`: build de producción.
- `npm run preview`: previsualización del build.
