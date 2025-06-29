# Configuração de Porta para o Frontend FitFood

## Alterações Realizadas

Para resolver o conflito de portas no ambiente Coolify com Traefik, foram feitas as seguintes alterações:

1. **Dockerfile**:
   - Alterada a diretiva `EXPOSE` de 80 para 3000
   - Isso informa ao Docker que o container agora utiliza a porta 3000

2. **nginx.conf**:
   - Alterada a diretiva `listen` de 80 para 3000
   - O servidor nginx agora escuta na porta 3000 em vez da porta 80

## Como Funciona com Coolify e Traefik

### Arquitetura

```
Cliente → Traefik (Proxy Reverso) → Container FitFood (porta 3000)
```

### Explicação

1. **Traefik**: 
   - Atua como proxy reverso e gerenciador de tráfego
   - Escuta nas portas 80 (HTTP) e 443 (HTTPS) do host
   - Encaminha as solicitações para os containers apropriados com base em regras de roteamento

2. **Container FitFood**:
   - Agora escuta na porta 3000 internamente
   - Não expõe diretamente esta porta para o host
   - O Traefik encaminha o tráfego para esta porta interna

3. **Coolify**:
   - Gerencia a configuração do Traefik automaticamente
   - Cria as regras de roteamento com base nas configurações do serviço
   - Gerencia os certificados SSL/TLS quando necessário

## Configuração no Coolify

No painel do Coolify, certifique-se de que:

1. A porta publicada para o serviço está definida como 3000
2. As configurações de domínio e roteamento estão corretas
3. O Traefik está configurado para encaminhar o tráfego para a porta 3000 do container

## Verificação

Para verificar se a configuração está correta:

1. Após o deploy, verifique os logs do container para confirmar que o nginx iniciou corretamente na porta 3000
2. Teste o acesso ao site através do domínio configurado
3. Verifique os logs do Traefik para confirmar que as solicitações estão sendo encaminhadas corretamente

## Solução de Problemas

Se ocorrerem problemas:

1. Verifique se o container está em execução: `docker ps`
2. Verifique os logs do container: `docker logs <container_id>`
3. Verifique se o nginx está escutando na porta 3000: `docker exec <container_id> netstat -tulpn | grep 3000`
4. Verifique as regras de roteamento do Traefik no painel do Coolify 