# Dockerfile.dev

FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Exponer puerto 5173 (por defecto en Vite)
EXPOSE 5173

# Ejecutar Vite en modo dev
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

#docker build -t frontend-vite .
#docker run -p 5173:5173 frontend-vite