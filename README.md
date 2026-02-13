# REMFront – Frontend Onboarding Module

Frontend del mini módulo de onboarding y verificación de identidad para REM.
La aplicación permite registrar, consultar y revisar solicitudes de verificación, consumiendo un backend expuesto vía API REST.

---

## Alcance del proyecto

Este frontend implementa:
- Registro de solicitudes de verificación
- Listado y filtrado de solicitudes
- Visualización de detalle y score de riesgo
- Actualización controlada del estado de la solicitud

El proyecto está diseñado como un backoffice modular, desacoplado del backend y preparado para escalar.

---

## Requerimientos cumplidos

### Funcionales
- Listado de solicitudes
  - Tabla con nombre, email, país, estado y fecha de creación
  - Filtros por nombre y estado
- Formulario de creación
  - Campos obligatorios
  - Validación de email
  - Validación de teléfono (8–15 dígitos)
  - Validación dependiente del tipo de documento (INE, Pasaporte, Licencia)
  - Feedback visual de error y éxito
- Detalle de solicitud
  - Visualización completa de los datos
  - Visualización del score y nivel de riesgo calculado por el backend
  - Posibilidad de actualizar el estado respetando estados finales
- Al menos una prueba automatizada de frontend (Vitest)

### No funcionales
- Vue 3
- TypeScript
- Tailwind CSS
- Arquitectura modular
- Commits descriptivos (Conventional Commits)
- Docker para ejecución del frontend

---

## Tecnologías utilizadas
- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- Vue Router
- Vitest
- Docker / Docker Compose

---

## Estructura del proyecto

REMFront/
├─ src/
│  ├─ app/
│  ├─ assets/
│  ├─ layouts/
│  ├─ modules/
│  │  └─ verifications/
│  │     ├─ components/
│  │     ├─ services/
│  │     ├─ utils/
│  │     ├─ views/
│  │     └─ routes.ts
│  ├─ router/
│  ├─ views/
│  ├─ main.ts
│  └─ App.vue
├─ public/
├─ e2e/
├─ Dockerfile
├─ docker-compose.yml
├─ .dockerignore
├─ .env.example
├─ package.json
├─ vite.config.ts
└─ README.md

---

## Configuración de variables de entorno

El frontend consume el backend mediante la variable:

VITE_API_BASE_URL

### Opción 1: Archivo .env (recomendado)

Crear un archivo .env en la raíz del proyecto:

VITE_API_BASE_URL=http://localhost:8000/api/v1

El archivo .env no debe subirse al repositorio.

### Opción 2: Variable al ejecutar Docker

docker run -p 5173:5173 \
  -e VITE_API_BASE_URL=http://localhost:8000/api/v1 \
  rem-frontend

---

## Ejecución en local (sin Docker)

Requisitos:
- Node.js 18 o superior (recomendado Node 20)
- npm

Instalación:
npm install

Ejecución:
npm run dev

Frontend disponible en:
http://localhost:5173

Es necesario que el backend esté corriendo en:
http://localhost:8000/api/v1

---

## Ejecución con Docker

Usando Docker Compose:
docker compose up --build

Frontend disponible en:
http://localhost:5173

La variable VITE_API_BASE_URL se configura internamente con:
http://localhost:8000/api/v1

---

## Pruebas de frontend

Ejecutar pruebas:
npm run test:run

---

## Decisiones técnicas clave
- El frontend está totalmente desacoplado del backend
- Validaciones de formulario en frontend para mejorar la experiencia de usuario
- Validación dinámica según tipo de documento
- Diseño tipo backoffice con jerarquía visual clara
- Los estados finales de una solicitud no permiten modificaciones, alineado a reglas del negocio

---

## Limitaciones conocidas
- No se manejan archivos reales, la evidencia se representa como una URL simulada
- El paginado se realiza sobre los datos obtenidos del servicio

---

## Endpoints esperados del backend

GET /verifications  
POST /verifications  
GET /verifications/{id}  
PATCH /verifications/{id}/status
