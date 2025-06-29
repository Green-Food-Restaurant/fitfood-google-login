# Configuração da Pipeline CI/CD

Este documento descreve os secrets necessários para configurar a pipeline de CI/CD do frontend do FitFood.

## Secrets Necessários

Configure os seguintes secrets no seu repositório GitHub:

### Docker Hub

- `DOCKER_USERNAME`: Seu nome de usuário do Docker Hub
- `DOCKER_TOKEN`: Token de acesso pessoal do Docker Hub

### Discord

- `DISCORD_WEBHOOK`: URL do webhook do Discord para notificações

### Netlify

- `NETLIFY_SITE_ID`: ID do site no Netlify
- `NETLIFY_AUTH_TOKEN`: Token de autenticação do Netlify

### Coolify

- `COOLIFY_WEBHOOK`: URL base da API do Coolify
- `COOLIFY_TOKEN`: Token de autenticação do Coolify
- `COOLIFY_FRONTEND_UUID`: UUID do recurso frontend no Coolify

## Como Configurar

1. Acesse as configurações do seu repositório no GitHub
2. Navegue até "Settings" > "Secrets and variables" > "Actions"
3. Clique em "New repository secret" e adicione cada um dos secrets listados acima

## Fluxo da Pipeline

A pipeline de CI/CD segue o seguinte fluxo:

1. **Build**: Compila o código fonte e executa linting
2. **Docker**: Cria e publica a imagem Docker
3. **Deploy Netlify**: Implanta a aplicação no Netlify (para ambiente de staging)
4. **Deploy Coolify**: Implanta a aplicação no Coolify (para ambiente de produção)

Cada etapa envia notificações para o canal do Discord configurado, informando o status da execução.

## Troubleshooting

Se a pipeline falhar, verifique:

1. Se todos os secrets estão configurados corretamente
2. Se o arquivo `frontend-ci-cd.yml` está correto
3. Os logs de erro no GitHub Actions
4. As notificações no Discord para detalhes específicos do erro 