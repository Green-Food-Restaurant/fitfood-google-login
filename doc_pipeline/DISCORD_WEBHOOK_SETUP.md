# Configuração do Webhook do Discord para CI/CD

Este guia explica como configurar um webhook do Discord para receber notificações automáticas da pipeline de CI/CD do GreenFood.

## 📋 Pré-requisitos

- Acesso administrativo a um servidor do Discord
- Permissão para gerenciar webhooks no canal desejado

## 🔧 Passos para Configuração

### 1. Criar o Webhook no Discord

1. Abra o Discord e navegue até o servidor onde deseja receber as notificações
2. Clique com o botão direito no canal desejado e selecione **Configurações do Canal**
3. No menu lateral, clique em **Integrações**
4. Clique em **Webhooks** e depois em **Novo Webhook**
5. Configure o webhook:
   - Dê um nome ao webhook (por exemplo, "GreenFood CI/CD")
   - Opcionalmente, altere o avatar
   - Clique em **Copiar URL do Webhook** para obter o URL
   - Clique em **Salvar**

### 2. Configurar o Secret no GitHub

1. Acesse seu repositório no GitHub
2. Navegue até **Settings > Secrets and variables > Actions**
3. Clique em **New repository secret**
4. Configure o secret:
   - **Nome**: `DISCORD_WEBHOOK`
   - **Valor**: Cole o URL do webhook copiado do Discord
5. Clique em **Add secret**

## 🎨 Personalização das Notificações

As notificações enviadas para o Discord seguem um formato padronizado com cores diferentes para cada tipo de status:

- **Verde** (3066993): Sucesso
- **Vermelho** (15158332): Falha
- **Amarelo** (16027660): Aviso
- **Azul** (3447003): Informação

Você pode personalizar as mensagens editando os templates no arquivo `.github/workflows/frontend-ci-cd.yml`.

## 📊 Exemplos de Notificações

### Notificação de Sucesso

```json
{
  "embeds": [{
    "title": "✅ Build concluído com sucesso",
    "description": "O código foi compilado com sucesso e os artefatos foram salvos",
    "color": 3066993,
    "fields": [
      {"name": "Projeto", "value": "GreenFood Web Frontend", "inline": true},
      {"name": "Branch", "value": "main", "inline": true},
      {"name": "Commit", "value": "abc1234", "inline": true}
    ],
    "timestamp": "2024-07-20T12:00:00Z"
  }]
}
```

### Notificação de Falha

```json
{
  "embeds": [{
    "title": "❌ Falha na compilação",
    "description": "Ocorreu um erro durante a compilação do código",
    "color": 15158332,
    "fields": [
      {"name": "Projeto", "value": "GreenFood Web Frontend", "inline": true},
      {"name": "Branch", "value": "main", "inline": true},
      {"name": "Commit", "value": "abc1234", "inline": true}
    ],
    "timestamp": "2024-07-20T12:00:00Z"
  }]
}
```

## 🔍 Solução de Problemas

### Webhook não está enviando mensagens

1. Verifique se o URL do webhook está correto no secret do GitHub
2. Confirme que o webhook ainda está ativo no Discord
3. Verifique se o canal do Discord ainda existe e se o webhook tem permissão para enviar mensagens

### Mensagens com formatação incorreta

1. Verifique se o payload JSON está formatado corretamente
2. Confirme que todas as variáveis estão sendo substituídas corretamente

### Limite de taxa excedido

O Discord tem limites de taxa para webhooks. Se você estiver enviando muitas notificações em um curto período, algumas podem ser descartadas. Considere:

1. Reduzir o número de notificações
2. Agrupar notificações relacionadas
3. Implementar um mecanismo de espera entre notificações

---

Para mais informações sobre webhooks do Discord, consulte a [documentação oficial](https://discord.com/developers/docs/resources/webhook). 