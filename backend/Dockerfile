# quicktask-project/backend/Dockerfile (Corregido v2)

# 1. Etapa de Build (Compilación TS -> JS)
# Usa una imagen de Node.js LTS y segura (ej. 20 o 22)
FROM node:22-alpine AS build
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias PRIMERO
# Aprovecha el cache de Docker si no cambian
COPY package*.json ./

# Instala TODAS las dependencias (incluyendo devDependencies para compilar TS)
RUN npm install

# Copia TODO el resto del código fuente del backend desde el contexto
# El contexto es ./backend, así que '.' copia todo lo que hay dentro de ./backend
COPY . .

# Compila TypeScript a JavaScript (la salida estará en 'dist')
RUN npm run build

# 2. Etapa de Producción (Ejecución JS)
# Usa la misma imagen ligera y segura
FROM node:22-alpine
WORKDIR /usr/src/app

# Copia solo las dependencias de producción desde la etapa de build
COPY --from=build /usr/src/app/package*.json ./
RUN npm install --only=production --ignore-scripts

# Copia el código JavaScript compilado desde la etapa de build
COPY --from=build /usr/src/app/dist ./dist

RUN ls -la dist
# Expone el puerto en el que correrá la aplicación dentro del contenedor
EXPOSE 3000

# Comando para iniciar la aplicación cuando el contenedor arranque
# Asegúrate que 'server.js' sea tu punto de entrada compilado
CMD [ "node", "dist/server.js" ]
