## 📚 Índice

- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [DevOps](#devops)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Despliegue](#despliegue)
- [API](#api)

## 🛠️ Tecnologías Utilizadas

### Frontend
- **[Vue.js 3](https://vuejs.org/)** con TypeScript
- **[Vite](https://vitejs.dev/)** como build tool
- **[Pinia](https://pinia.vuejs.org/)** para gestión de estado (state)
- **[Vue Router](https://router.vuejs.org/)** para navegación
- **[ShadCN Vue](https://www.shadcn-vue.com/)** para componentes reutilizables del Design System de ShadCN
- **[Axios](https://axios-http.com/)** para peticiones asíncronas HTTP

### Backend
- **[Flask](https://flask.palletsprojects.com/)** framework web para Python
- **[Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/)** para autenticación con JSON Web Tokens (JWT)
- **[Flask-CORS](https://flask-cors.readthedocs.io/en/latest/)** para manejo de CORS
- **[MySQL](https://www.mysql.com/)** como base de datos

## DevOps
- **[Git](https://git-scm.com/)** para control de versiones
- **[GitHub](https://github.com/)** para alojamiento remoto del código fuente
- **[Docker](https://www.docker.com/)** para contenerización
- **[Docker Compose](https://docs.docker.com/compose/)** para orquestación de contenedores

## 📁 Estructura del Proyecto

```
pwd2025-tp-final-francodevarg/
├── frontend/          # Aplicación Vue.js
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/
│       └── router/
├── backend/           # API Flask
│   └── app/
│       ├── modules/   # Módulos (auth, turno, mascota, veterinario, usuario, horario)
│       ├── database/
│       └── middlewares/
├── documentation/     # Documentación
│   ├── database/
│   │   └── DER.svg
│   ├── showcase/
│   │   ├── showcase1.png
│   │   └── showcase2.png
│   ├── CONSIGNA.md
│   ├── DEPLOY.md
│   ├── DOCUMENTATION.md
│   └── RELEASE.md
└── README.md

```
# 🚀 Despliegue

Para desplegar el proyecto en local, ver el archivo [DEPLOY.md](/documentation/DEPLOY.md)

# API

Para ver la documentación de la API, ver el archivo [API.md](/documentation/API.md)