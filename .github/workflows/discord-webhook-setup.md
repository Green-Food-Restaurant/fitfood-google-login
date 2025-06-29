# Configuração do Webhook do Discord

Este guia explica como configurar um webhook do Discord para receber notificações da pipeline de CI/CD.

## Passos para Configuração

1. **Abra o Discord** e navegue até o servidor onde deseja receber as notificações.

2. **Crie um canal dedicado** para notificações de CI/CD (por exemplo, `#ci-cd-notifications`).

3. **Acesse as configurações do canal**:
   - Clique com o botão direito no canal
   - Selecione "Editar Canal"
   - Clique em "Integrações"
   - Clique em "Webhooks"
   - Clique em "Novo Webhook"

4. **Configure o webhook**:
   - Dê um nome ao webhook (por exemplo, "FitFood CI/CD")
   - Opcionalmente, altere o avatar do webhook
   - Clique em "Copiar URL do Webhook"

5. **Adicione o webhook como secret no GitHub**:
   - Vá para o repositório no GitHub
   - Navegue até "Settings" > "Secrets and variables" > "Actions"
   - Clique em "New repository secret"
   - Nome: `DISCORD_WEBHOOK`
   - Valor: Cole a URL do webhook copiada anteriormente
   - Clique em "Add secret"

## Formato das Notificações

As notificações no Discord terão o seguinte formato:

- ✅ **Sucesso**: Notificações verdes para builds e deploys bem-sucedidos
- ❌ **Falha**: Notificações vermelhas para erros
- 🚀 **Deploy**: Notificações azuis para deploys em andamento

## Personalização

Você pode personalizar as mensagens enviadas ao Discord editando as seções `curl` no arquivo `frontend-ci-cd.yml`. 

Exemplo de personalização:

```yaml
curl -H "Content-Type: application/json" \
  -X POST \
  -d '{
    "content": "✅ Build concluído com sucesso!",
    "embeds": [
      {
        "title": "Detalhes do Build",
        "color": 5763719,
        "fields": [
          {
            "name": "Branch",
            "value": "main",
            "inline": true
          },
          {
            "name": "Commit",
            "value": "abc123",
            "inline": true
          }
        ]
      }
    ]
  }' \
  "$DISCORD_WEBHOOK"
```

Para mais informações sobre a formatação de mensagens no Discord, consulte a [documentação oficial de webhooks do Discord](https://discord.com/developers/docs/resources/webhook). 