# Dockerfile Simplificado para Desarrollo Backend

# Usa la versión de Node deseada
FROM node:22-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia PRIMERO los archivos de paquetes para usar la caché de Docker
# Asegúrate que package.json y package-lock.json (si existe) estén en ./backend
COPY package*.json ./

# Instala TODAS las dependencias (dev y prod)
# Puedes usar 'npm ci' si tienes un package-lock.json fiable, si no, 'npm install'
RUN npm install
# Alternativa: RUN npm ci

# Copia el resto del código fuente
# Esto sirve como base, pero el volumen de docker-compose lo sobrescribirá
COPY . .

# Expone el puerto
EXPOSE 3000

# Comando para ejecutar en modo desarrollo
# Intentemos con npm run dev primero, ahora que npm install instala todo
CMD [ "npm", "run", "dev" ]
# Si eso falla, podemos volver a la ruta directa que ahora sí debería existir:
# CMD [ "./node_modules/.bin/nodemon", "src/server.ts" ]