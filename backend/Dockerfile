# Cambiamos a la versión 22 para cumplir con los requisitos de Mongoose
FROM node:22-alpine

# Creamos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias primero
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código de tu backend
COPY . .

# Exponemos el puerto de la API
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "server.js"]