# quicktask-project/frontend/Dockerfile (Corregido)

# --- Etapa 1: Build (Compilación Angular) ---
# Usa una imagen de Node.js LTS y segura
FROM node:22-alpine AS build
# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias PRIMERO
COPY package*.json ./

# Instala TODAS las dependencias de Angular
RUN npm install

# Copia TODO el resto del código fuente del frontend desde el contexto
# El contexto es ./frontend, así que '.' copia todo lo que hay dentro de ./frontend
COPY . .

# Construye la aplicación Angular para producción
# Asegúrate que 'quicktask-frontend' es el nombre correcto de tu app en angular.json
RUN npm run build -- --configuration production

# --- Etapa 2: Producción (Servir con Nginx) ---
# Usa la imagen oficial de Nginx
FROM nginx:stable-alpine

# Elimina la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu archivo de configuración personalizado de Nginx
# Busca nginx.conf directamente en el contexto (./frontend)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos construidos de Angular desde la etapa de build
# Asegúrate que 'dist/quicktask-frontend' coincide con la carpeta de salida
COPY --from=build /usr/src/app/dist/quicktask-frontend /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80
