# Dockerfile.dev

# Imagen base
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias (para aprovechar cache)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto por defecto de Vite
EXPOSE 5173


# Ejecutar Vite en modo desarrollo, disponible fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
