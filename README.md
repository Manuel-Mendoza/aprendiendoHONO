# learnHono 🚀

Este es un proyecto de aprendizaje para Hono, un framework web para TypeScript que se ejecuta en cualquier entorno de JavaScript.

## 📝 Descripción

Este proyecto es una API REST simple con las siguientes características:

-   **🔐 Autenticación de usuarios:** Registro, inicio de sesión y verificación de usuarios.
-   **📦 Base de datos:** Utiliza [Turso](https://turso.tech/) como base de datos, que es una base de datos distribuida basada en libSQL.
-   **🐘 ORM:** Utiliza [Drizzle ORM](https://orm.drizzle.team/) para interactuar con la base de datos.
-   **✅ Validación:** Utiliza [Zod](https://zod.dev/) para la validación de esquemas.

## 🛠️ Tecnologías

-   [Hono](https://hono.dev/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Node.js](https://nodejs.org/en/)
-   [Turso](https://turso.tech/)
-   [Drizzle ORM](https://orm.drizzle.team/)
-   [Zod](https://zod.dev/)

## 🚀 Cómo empezar

1.  Clona el repositorio:

```bash
git clone https://github.com/tudominio/learnHono.git
```

2.  Instala las dependencias:

```bash
npm install
```

3.  Crea un archivo `.env` con las siguientes variables de entorno:

```bash
TURSO_DATABASE_URL=YOUR_TURSO_DATABASE_URL
TURSO_AUTH_TOKEN=YOUR_TURSO_AUTH_TOKEN
```

4.  Ejecuta el proyecto en modo de desarrollo:

```bash
npm run dev
```

5.  Abre tu navegador en `http://localhost:3000` para ver la aplicación en funcionamiento.

## Routes

-   `POST /api/login`: Inicia sesión de un usuario.
-   `POST /api/register`: Registra un nuevo usuario.
-   `GET /api/user`: Verifica el token de un usuario.