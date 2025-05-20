# Etapa de build
FROM node:20-alpine AS build

# Instala o pnpm globalmente
RUN npm install -g pnpm

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração
COPY package.json pnpm-lock.yaml ./

# Instala as dependências
RUN pnpm install --frozen-lockfile

# Copia o código fonte
COPY . .

# Executa o build da aplicação
RUN pnpm build

# Etapa de produção
FROM nginx:alpine AS production

# Copia os arquivos de build para o diretório do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia uma configuração personalizada do nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]
