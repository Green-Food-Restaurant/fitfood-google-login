# Etapa de build
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Define as variáveis de ambiente para o build
ENV VITE_AUTH_API_URL=http://auth.greenfood.devarchitects.tech/api/v1/auth
ENV VITE_PRODUCTS_API_URL=http://product.greenfood.devarchitects.tech/v1/product
ENV VITE_CHECKOUT_API_URL=http://checkout.greenfood.devarchitects.tech/v1/checkout
ENV VITE_ENABLE_ADMIN_PANEL=true
ENV VITE_ENABLE_CHECKOUT=true
ENV VITE_TOKEN_KEY=greenfood_auth_token
ENV VITE_REFRESH_TOKEN_KEY=greenfood_refresh_token
ENV VITE_USER_INFO_KEY=greenfood_user_info
ENV VITE_REMEMBER_ME_KEY=greenfood_remember_me
ENV VITE_SESSION_TIMEOUT=1800000
ENV VITE_WITH_CREDENTIALS=false
ENV VITE_GOOGLE_CLIENT_ID=565009893604-sp8bd8vhclislma6b4anlla3sd23f0dr.apps.googleusercontent.com
ENV VITE_APP_ENV=production

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
