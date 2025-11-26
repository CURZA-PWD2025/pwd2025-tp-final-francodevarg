#!/bin/bash

set -e  # Salir si cualquier comando falla
echo "🚀 Iniciando despliegue con Docker Compose..."

# --- Cargar variables de entorno ---
if [ -f .env ]; then
  echo "📌 Cargando variables desde .env"
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ No se encontró archivo .env"
  exit 1
fi

# --- Detener contenedores anteriores ---
echo "🛑 Deteniendo contenedores anteriores..."
docker compose down

# --- Construir imágenes ---
echo "🔨 Construyendo imágenes..."
docker compose build

# --- Levantar contenedores ---
echo "📦 Levantando contenedores..."
docker compose up -d

docker compose ps

# --- Esperar a que el backend esté listo ---
BACKEND_SERVICE="flask-backend"  # Ajusta si tu servicio se llama diferente
BACKEND_PORT=5000

echo "⏳ Esperando a que '$BACKEND_SERVICE' esté listo en el puerto $BACKEND_PORT..."
until curl -s http://localhost:$BACKEND_PORT/ > /dev/null 2>&1; do
  echo "🟡 Backend aún no listo. Reintentando en 5 segundos..."
  sleep 5
done
echo "✅ '$BACKEND_SERVICE' está listo."

# --- Ejecutar migraciones ---
echo "🔄 Ejecutando migraciones..."
docker compose run --rm backend python app/database/migrations/db_init.py

echo "✨ Deploy completado!"
