# Etapa de build
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copia o código fonte
COPY . .

# Construi a aplicação
RUN npm run build

# Etapa de produção
FROM nginx:stable-alpine

# Copia uma configuração personalizada do nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos de build da etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]
