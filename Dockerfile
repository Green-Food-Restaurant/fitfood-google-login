# Etapa de build
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Define argumentos de build para variáveis de ambiente
ARG VITE_AUTH_API_URL
ARG VITE_PRODUCTS_API_URL
ARG VITE_CHECKOUT_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_ENABLE_ADMIN_PANEL
ARG VITE_ENABLE_CHECKOUT
ARG VITE_TOKEN_KEY
ARG VITE_REFRESH_TOKEN_KEY
ARG VITE_USER_INFO_KEY
ARG VITE_REMEMBER_ME_KEY
ARG VITE_SESSION_TIMEOUT
ARG VITE_WITH_CREDENTIALS
ARG VITE_APP_ENV

# Define as variáveis de ambiente para o build
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_PRODUCTS_API_URL=$VITE_PRODUCTS_API_URL
ENV VITE_CHECKOUT_API_URL=$VITE_CHECKOUT_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_ENABLE_ADMIN_PANEL=$VITE_ENABLE_ADMIN_PANEL
ENV VITE_ENABLE_CHECKOUT=$VITE_ENABLE_CHECKOUT
ENV VITE_TOKEN_KEY=$VITE_TOKEN_KEY
ENV VITE_REFRESH_TOKEN_KEY=$VITE_REFRESH_TOKEN_KEY
ENV VITE_USER_INFO_KEY=$VITE_USER_INFO_KEY
ENV VITE_REMEMBER_ME_KEY=$VITE_REMEMBER_ME_KEY
ENV VITE_SESSION_TIMEOUT=$VITE_SESSION_TIMEOUT
ENV VITE_WITH_CREDENTIALS=$VITE_WITH_CREDENTIALS
ENV VITE_APP_ENV=$VITE_APP_ENV

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
