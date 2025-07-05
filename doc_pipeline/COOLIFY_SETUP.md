# Configuração do Coolify para Deploy Automatizado

Este guia explica como configurar o Coolify para permitir deploys automatizados a partir da pipeline de CI/CD do GreenFood.

## 📋 O que é o Coolify?

[Coolify](https://coolify.io/) é uma plataforma de hospedagem self-hosted de código aberto que permite gerenciar aplicações, bancos de dados e serviços em seu próprio servidor. É uma alternativa ao Heroku, Netlify, Vercel, etc.

## 🔧 Pré-requisitos

- Um servidor com Coolify instalado
- Acesso administrativo ao Coolify
- Uma conta no GitHub com acesso ao repositório do projeto

## 🚀 Configuração do Coolify

### 1. Criar um Novo Recurso no Coolify

1. Faça login no painel administrativo do Coolify
2. Clique em **Recursos** no menu lateral
3. Clique em **Novo Recurso**
4. Selecione **Aplicação**
5. Configure a aplicação:
   - **Nome**: GreenFood Web Frontend
   - **Tipo de Repositório**: GitHub
   - **Repositório**: Selecione o repositório do projeto
   - **Branch**: main
   - **Diretório de Build**: dist (ou o diretório onde os arquivos compilados são gerados)
   - **Comando de Build**: npm run build (ou o comando apropriado)
   - **Porta**: 3000
6. Clique em **Criar**

### 2. Obter as Informações Necessárias

Após criar o recurso, você precisará obter as seguintes informações:

1. **UUID do Recurso**:
   - Navegue até o recurso criado
   - O UUID estará na URL ou nas configurações do recurso

2. **Token de API**:
   - No menu lateral, clique em **Configurações**
   - Vá para **API**
   - Gere um novo token ou use um existente

3. **URL da API do Coolify**:
   - Geralmente é `https://seu-servidor-coolify/api`

### 3. Configurar Secrets no GitHub

1. Acesse seu repositório no GitHub
2. Navegue até **Settings > Secrets and variables > Actions**
3. Adicione os seguintes secrets:
   - **COOLIFY_WEBHOOK**: URL base da API do Coolify (ex: `https://seu-servidor-coolify`)
   - **COOLIFY_TOKEN**: Token de API do Coolify
   - **COOLIFY_FRONTEND_UUID**: UUID do recurso criado no Coolify

## 📝 Configuração do Webhook para Deploy Automático

O Coolify pode ser configurado para realizar deploys automáticos quando receber um webhook. Nossa pipeline utiliza a API do Coolify para acionar deploys programaticamente.

### Exemplo de Chamada de API para Deploy

```bash
curl -X POST "https://seu-servidor-coolify/api/v1/deploy?uuid=seu-uuid&force=false" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token" \
  -d '{
    "ref": "refs/heads/main",
    "environment": {
      "PORT": "3000"
    }
  }'
```

## 🔍 Verificação do Status do Deploy

Para verificar o status de um deploy, você pode usar a seguinte chamada de API:

```bash
curl -X GET "https://seu-servidor-coolify/api/v1/deployments/seu-deployment-id/status" \
  -H "Authorization: Bearer seu-token"
```

## ⚙️ Variáveis de Ambiente

As seguintes variáveis de ambiente são configuradas automaticamente pela pipeline:

- **PORT**: 3000 (ou a porta configurada em `CONTAINER_PORT`)
- Outras variáveis específicas da aplicação podem ser adicionadas no arquivo de workflow

## 🔒 Considerações de Segurança

- Nunca compartilhe seu token de API do Coolify
- Use tokens com o mínimo de permissões necessárias
- Considere implementar um mecanismo de rotação de tokens
- Verifique regularmente os logs de acesso do Coolify

## 🔄 Solução de Problemas

### Deploy não é iniciado

1. Verifique se os secrets estão configurados corretamente no GitHub
2. Confirme que o token de API do Coolify é válido e tem permissões suficientes
3. Verifique se o UUID do recurso está correto

### Deploy falha

1. Verifique os logs do deploy no painel do Coolify
2. Confirme que as variáveis de ambiente necessárias estão configuradas
3. Verifique se há problemas com a imagem Docker ou com os arquivos de build

---

Para mais informações sobre a API do Coolify, consulte a [documentação oficial](https://docs.coolify.io/api). 