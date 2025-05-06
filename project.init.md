# Roadmap de Desenvolvimento – Site de Comida Fit

## Etapa 1 – Finalização da Base Visual (concluído)
**Ações:**
- Criar estrutura inicial com Vite + React + Tailwind.
- Criar layout da Home com hero, seções de especialidades e CTA.
- Criar página de Produtos com grid responsivo.
- Implementar Header e Footer reutilizáveis.
- Garantir responsividade em mobile e desktop.

---

## Etapa 2 – Funcionalidades Essenciais (Semana 1–2)
**Ações:**
- Escolher entre CMS (Strapi) ou backend com Node.js/Express.
- Criar API REST para produtos, categorias, preços.
- Conectar frontend via Axios/React Query.
- Popular API com dados reais para testes iniciais.

---

## Etapa 3 – Carrinho e Checkout (Semana 3)
**Ações:**
- Criar contexto de carrinho com React Context ou Zustand.
- Permitir adicionar/remover produtos, atualizar quantidades.
- Criar página de checkout com formulário de endereço e dados.
- Integração com Stripe ou Mercado Pago.
- Validar campos obrigatórios antes do envio do pedido.

---

## Etapa 4 – Autenticação e Área do Usuário (Semana 4)
**Ações:**
- Configurar Firebase Auth ou Auth0.
- Criar páginas de login/cadastro.
- Criar área protegida com pedidos anteriores, perfil e logout.
- Salvar dados em banco (Firestore ou PostgreSQL).

---

## Etapa 5 – Painel Administrativo (Semana 5)
**Ações:**
- Criar rota/admin com autenticação de admin.
- Criar formulário para adicionar/editar/remover produtos.
- Listagem de produtos e pedidos no painel.
- Exibir estatísticas simples com gráficos (opcional).

---

## Etapa 6 – Marketing e Experiência (Semana 6)
**Ações:**
- Criar campo de cupom no checkout com regras (ex: 10% OFF).
- Adicionar avaliações com estrelas e comentários.
- Integração com Mailchimp para capturar e-mails.
- Animações com Framer Motion (banners, cards, transições).

---

## Etapa 7 – Otimização e SEO (Semana 7)
**Ações:**
- Configurar título/meta tags por página.
- Adicionar OpenGraph e imagens de preview.
- Criar sitemap.xml e robots.txt.
- Revisar acessibilidade com `aria-*`, contraste e navegação por teclado.
- Melhorar pontuação no Lighthouse.

---

## Etapa 8 – PWA e Funcionalidades Extras (opcional)
**Ações:**
- Criar manifest.json com ícone e nome do app.
- Configurar service worker para cache offline.
- Ativar push notifications com Firebase Messaging.
- Testar instalação em mobile como app nativo.

---

## Ferramentas Sugeridas
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js + Express, ou Strapi CMS
- **Autenticação**: Firebase Auth / Auth0
- **Banco**: MongoDB ou PostgreSQL
- **Pagamento**: Stripe / Mercado Pago
- **Hospedagem**: Vercel (frontend), Render / Railway (backend)

---

> Este roadmap pode ser adaptado para sprints quinzenais ou ágeis. Podemos converter em board Kanban, se preferir.
