#!/bin/sh
# Espera hasta que el servicio de la base de datos esté disponible
until nc -z db 5432; do
  echo "Esperando a que la base de datos PRODUCTS-WRITE esté lista..."
  sleep 2
done

# Ejecuta Prisma db push y luego inicia la aplicación
npx prisma db push && npm run start:dev
