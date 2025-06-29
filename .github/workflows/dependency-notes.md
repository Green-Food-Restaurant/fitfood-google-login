# Notas sobre Resolução de Conflitos de Dependências

## Problema Identificado

Durante a execução da pipeline CI/CD, foi encontrado um erro de conflito de dependências:

```
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
npm error While resolving: lovable-tagger@1.1.8
npm error Found: vite@4.5.14
npm error node_modules/vite
npm error   peer vite@"^4 || ^5 || ^6 || ^7.0.0-beta.0" from @vitejs/plugin-react-swc@3.10.2
npm error   node_modules/@vitejs/plugin-react-swc
npm error     dev @vitejs/plugin-react-swc@"^3.9.0" from the root project
npm error   dev vite@"^4.5.14" from the root project
npm error
npm error Could not resolve dependency:
npm error peer vite@"^5.0.0" from lovable-tagger@1.1.8
npm error node_modules/lovable-tagger
npm error   dev lovable-tagger@"^1.1.8" from the root project
```

O problema ocorre porque:
- O projeto utiliza `vite@4.5.14`
- A dependência `lovable-tagger@1.1.8` requer `vite@^5.0.0`
- Isso cria um conflito de versão que impede a instalação das dependências

## Solução Aplicada

Para resolver este problema, foram implementadas as seguintes soluções:

1. **Uso da flag `--legacy-peer-deps`**:
   - Esta flag foi adicionada ao comando `npm ci` tanto na pipeline CI/CD quanto no Dockerfile
   - Ela instrui o npm a ignorar os requisitos de peer dependencies, permitindo a instalação mesmo com conflitos

```yaml
# Na pipeline CI/CD
- name: Install dependencies
  run: npm ci --legacy-peer-deps
```

```dockerfile
# No Dockerfile
RUN npm ci --legacy-peer-deps
```

## Alternativas Consideradas

Outras abordagens que poderiam ser usadas para resolver este problema:

1. **Atualizar o Vite para v5.x**:
   - Isso resolveria o conflito, mas poderia introduzir breaking changes
   - Requer testes mais extensivos

2. **Remover ou substituir lovable-tagger**:
   - Verificar se esta dependência é realmente necessária
   - Buscar alternativas compatíveis com Vite 4.x

3. **Usar npm overrides**:
   - Configurar um override específico para a versão do Vite usada por lovable-tagger

## Recomendações Futuras

Para evitar problemas semelhantes no futuro:

1. Considerar a migração para Vite 5.x em uma atualização planejada
2. Revisar periodicamente as dependências do projeto para identificar conflitos potenciais
3. Utilizar ferramentas como `npm-check-updates` para manter as dependências atualizadas de forma controlada 