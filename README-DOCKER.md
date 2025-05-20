# Deploy do FitFood com Docker

Este guia explica como realizar o deploy da aplicação FitFood usando Docker e Docker Compose.

## Pré-requisitos

- Docker instalado (versão 20.10.0 ou superior)
- Docker Compose instalado (versão 2.0.0 ou superior)

## Configuração

1. Crie um arquivo `.env` baseado no `.env.example` com suas configurações:

```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com as configurações corretas para seu ambiente.

## Build e Deploy Local

Para construir e iniciar a aplicação localmente:

```bash
docker-compose up -d --build
```

A aplicação estará disponível em: http://localhost

Para parar os contêineres:

```bash
docker-compose down
```

## Logs e Monitoramento

Para visualizar os logs da aplicação:

```bash
docker-compose logs -f frontend
```

## Deploy em Produção

Para ambientes de produção, recomendamos:

1. Usar um serviço de container registry como Docker Hub, GitHub Container Registry ou AWS ECR
2. Configurar um pipeline de CI/CD para automatizar o processo de build e deploy
3. Configurar HTTPS usando um proxy reverso como Nginx ou Traefik com Let's Encrypt

### Exemplo de build para produção

```bash
# Build da imagem
docker build -t fitfood-frontend:latest .

# Tag para o registry
docker tag fitfood-frontend:latest seu-registry.com/fitfood-frontend:latest

# Push para o registry
docker push seu-registry.com/fitfood-frontend:latest
```

## Variáveis de Ambiente

As principais variáveis de ambiente que podem ser configuradas:

- `NODE_ENV`: Define o ambiente (development, production)
- `VITE_API_URL`: URL base da API de backend
- `VITE_GOOGLE_CLIENT_ID`: ID do cliente para autenticação Google OAuth
- `VITE_GOOGLE_REDIRECT_URI`: URI de redirecionamento para autenticação Google

## Observações

- A configuração atual usa Nginx para servir os arquivos estáticos e lidar com o roteamento SPA
- O arquivo nginx.conf contém configurações básicas de segurança e cache
- Para desenvolvimento, você pode descomentar a seção de volumes no docker-compose.yml para habilitar hot-reloading
