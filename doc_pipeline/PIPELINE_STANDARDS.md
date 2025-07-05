# Padrões e Orientações para Pipelines CI/CD

Este documento descreve os padrões, convenções e melhores práticas adotados na criação de pipelines de CI/CD para os projetos GreenFood. Use-o como referência ao criar ou modificar pipelines em outros projetos.

## 📋 Estrutura Geral da Pipeline

Nossa pipeline segue uma estrutura de estágios bem definidos, cada um com responsabilidades específicas:

1. **Validação e Compilação** 🔍
2. **Construção e Publicação da Imagem** 🐳
3. **Deploy em Produção** 🚀
4. **Resumo do Pipeline** 📊

## 🌈 Convenções de Nomenclatura

- **Nome do Pipeline**: `[Nome do Projeto] CI/CD Pipeline`
- **Nomes dos Jobs**: Devem ser descritivos e precedidos por emoji relacionado à função
  - Exemplo: `🔍 Validação e Compilação`
- **Nomes dos Steps**: Devem seguir o padrão `[Verbo] - [Descrição]`
  - Exemplo: `Instalação de dependências`
- **Notificações**: Devem seguir o padrão `Notificação - [Etapa]`
  - Exemplo: `Notificação - Compilação`

## 🛠️ Variáveis de Ambiente Padrão

Defina as seguintes variáveis no início do arquivo de workflow:

```yaml
env:
  REGISTRY: docker.io
  IMAGE_NAME: [nome-do-projeto]-web-frontend
  DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
  CONTAINER_PORT: 3000
  SUCCESS_COLOR: 3066993
  ERROR_COLOR: 15158332
  WARNING_COLOR: 16027660
  INFO_COLOR: 3447003
  PROJECT_NAME: [Nome do Projeto] Web Frontend
```

## 🔔 Notificações no Discord

### Padrão de Cores
- **Sucesso**: Verde (`3066993`)
- **Erro**: Vermelho (`15158332`)
- **Aviso**: Amarelo (`16027660`)
- **Informação**: Azul (`3447003`)

### Estrutura das Notificações

Cada notificação deve seguir esta estrutura:

```yaml
curl -H "Content-Type: application/json" -X POST -d '{
  "embeds": [{
    "title": "[Emoji] [Título]",
    "description": "[Descrição clara e concisa]",
    "color": ${{ env.COLOR_TYPE }},
    "fields": [
      {"name": "Projeto", "value": "${{ env.PROJECT_NAME }}", "inline": true},
      {"name": "[Campo]", "value": "[Valor]", "inline": true},
      {"name": "[Campo]", "value": "[Valor]", "inline": true}
    ],
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }]
}' "$DISCORD_WEBHOOK"
```

### Emojis para Status

- ✅ Sucesso
- ❌ Falha
- ⚠️ Aviso
- 🔄 Em progresso
- 🎉 Conclusão com sucesso
- 📊 Resumo/Relatório

## 📝 Estágio 1: Validação e Compilação

### Etapas Obrigatórias

1. **Checkout do código**
2. **Configuração do ambiente** (Node.js, Java, etc.)
3. **Instalação de dependências**
4. **Verificação de variáveis de ambiente**
5. **Análise de código (Lint)**
6. **Compilação do projeto**
7. **Upload dos artefatos**

### Exemplo de Implementação

```yaml
validate-and-build:
  name: "🔍 Validação e Compilação"
  runs-on: ubuntu-latest
  steps:
    - name: Checkout do código
      uses: actions/checkout@v4.2.2
    
    # Outras etapas...
    
    - name: Upload dos artefatos de build
      uses: actions/upload-artifact@v4
      with:
        name: build-files
        path: dist/
        retention-days: 1
```

## 🐳 Estágio 2: Construção e Publicação da Imagem

### Etapas Obrigatórias

1. **Checkout do código**
2. **Download dos artefatos de build**
3. **Verificação do Dockerfile**
4. **Extração de metadados para Docker**
5. **Login no Docker Hub**
6. **Construção e publicação da imagem Docker**
7. **Análise de vulnerabilidades**

### Exemplo de Implementação

```yaml
build-and-publish-image:
  name: "🐳 Construção e Publicação da Imagem"
  needs: validate-and-build
  runs-on: ubuntu-latest
  outputs:
    image_tag: ${{ steps.get_tag.outputs.image_tag }}
  steps:
    # Etapas...
```

## 🚀 Estágio 3: Deploy em Produção

### Etapas Obrigatórias

1. **Verificação das configurações do ambiente**
2. **Iniciar deploy**
3. **Verificar status do deployment**
4. **Notificação do resultado**

### Exemplo de Implementação

```yaml
deploy-to-production:
  name: "🚀 Deploy em Produção"
  needs: build-and-publish-image
  runs-on: ubuntu-latest
  if: ${{ github.event_name != 'pull_request' && github.ref == 'refs/heads/main' }}
  steps:
    # Etapas...
```

## 📊 Estágio 4: Resumo do Pipeline

Este estágio deve reunir informações de todos os estágios anteriores e enviar uma notificação final com um resumo completo.

### Exemplo de Implementação

```yaml
pipeline-summary:
  name: "📊 Resumo do Pipeline"
  needs: [validate-and-build, build-and-publish-image, deploy-to-production]
  runs-on: ubuntu-latest
  if: ${{ always() }}
  steps:
    - name: Notificação - Resumo do pipeline
      run: |
        # Código para gerar o resumo...
```

## ⚙️ Boas Práticas

### Identificação de Etapas

Sempre use o parâmetro `id` para etapas importantes que serão referenciadas posteriormente:

```yaml
- name: Compilação do projeto
  id: build
  run: npm run build
```

### Tratamento de Erros

Use `if: always()` para garantir que as notificações sejam enviadas mesmo em caso de falha:

```yaml
- name: Notificação - Compilação
  if: always()
  run: |
    STATUS="${{ steps.build.outcome }}"
    # Resto do código...
```

### Verificações de Segurança

Inclua sempre análise de vulnerabilidades nas imagens Docker:

```yaml
- name: Análise de vulnerabilidades com Trivy
  id: trivy
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: '${{ steps.meta.outputs.tags }}'
    format: 'table'
    exit-code: '0'
    ignore-unfixed: true
    vuln-type: 'os,library'
    severity: 'CRITICAL,HIGH'
```

### Outputs entre Jobs

Use outputs para passar informações entre jobs:

```yaml
outputs:
  image_tag: ${{ steps.get_tag.outputs.image_tag }}
```

## 🔒 Secrets Necessários

Os seguintes secrets devem ser configurados no repositório:

- `DOCKER_USERNAME`: Nome de usuário do Docker Hub
- `DOCKER_TOKEN`: Token de acesso ao Docker Hub
- `DISCORD_WEBHOOK`: URL do webhook do Discord para notificações
- `COOLIFY_WEBHOOK`: URL base da API do Coolify
- `COOLIFY_TOKEN`: Token de autenticação do Coolify
- `COOLIFY_FRONTEND_UUID`: UUID do recurso no Coolify

## 📈 Monitoramento e Métricas

A pipeline inclui métricas básicas como duração total e status de cada etapa. Estas informações são incluídas no resumo final.

## 🔄 Fluxo de Execução Condicional

Use condicionais para executar etapas apenas quando necessário:

```yaml
if: ${{ github.event_name != 'pull_request' && github.ref == 'refs/heads/main' }}
```

---

## Exemplo Completo

Para um exemplo completo de implementação, consulte o arquivo `.github/workflows/frontend-ci-cd.yml` no projeto GreenFood Web Frontend.

## Adaptação para Outros Projetos

Ao adaptar esta pipeline para outros projetos:

1. Atualize o nome do projeto e da imagem
2. Ajuste as etapas de build conforme necessário para o tipo de projeto
3. Configure os secrets necessários no repositório
4. Verifique se as variáveis de ambiente no Dockerfile e docker-compose.yml estão corretas

---

Documento criado em: 20/07/2024 