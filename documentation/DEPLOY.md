## 🚀 Instalación y Ejecución

### Índice

- [Despliegue con Docker](#despliegue-con-docker)
  - [Requisitos Previos](#requisitos-previos)
- [Despliegue Manual](#despliegue-manual)
  - [Requisitos Previos](#requisitos-previos-1)
  - [Backend](#backend)
  - [Frontend](#frontend)

## **Despliegue con Docker**

### Requisitos Previos
- **Docker** >= v25.2.0
- **Docker Compose** >= v2.25.2

1. Acceder al directorio del deploy:
   ```bash
   cd deploy
   ```

2. Asignar permisos al script:
   ```bash
   chmod +x deploy.sh
   ```

3. Ejecutar el despliegue:
   ```bash
   ./deploy.sh
   ```


## **Despliegue Manual**

### Requisitos Previos
- **NodeJS** >= v22.17.0
- **Python** >= v3.10.12


### Backend

1. Acceder al directorio del backend:

   ```bash
   cd backend
   ```

2. Crear y activar el entorno virtual:

   ```bash
   python -m venv venv
   ```
   ```bash
   source venv/bin/activate
   ```


3. Instalar las dependencias:

   ```bash
   pip install -r requirements.txt
   ```

4. Configurar las variables de entorno: ejemplo

   ```bash
    DB_USER=root
    DB_PASSWORD=12345
    DB_NAME=veterinaria
    DB_PORT=3306
    DB_HOST=127.0.0.1
   ```

5. Ejecutar el servidor:

   ```bash
   flask run
   ```

La aplicación estará disponible en `http://localhost:5000`

### Frontend

1. Acceder al directorio del frontend:
    ```bash
    cd frontend
    ```
    
2. Instalar las dependencias:
    ```bash
    npm install
    ```

3. Ejecutar el servidor:
    ```bash
    npm run dev
    ```

La aplicación estará disponible en `http://localhost:5173`