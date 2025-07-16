# Dockerfile.dev

FROM node:18

WORKDIR /app

# Inyectar variable de entorno como ARG y luego pasarla como ENV
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Ejecutar Vite con acceso desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
