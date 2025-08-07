# Documentação do Componente de Gerenciamento de Usuários

## Visão Geral
O componente de Gerenciamento de Usuários fornece uma interface para administradores gerenciarem os usuários da plataforma Green Food. Ele permite listar, criar, editar e excluir usuários, bem como gerenciar suas permissões e status.

## Funcionalidades Implementadas

### 1. Listagem de Usuários
- Exibição paginada de usuários
- Filtragem por nome, e-mail, função e status
- Ordenação por data de criação

### 2. Criação de Usuários
- Formulário para adicionar novos usuários
- Campos obrigatórios: e-mail, senha, nome, sobrenome, função e status
- Upload de foto de perfil

### 3. Edição de Usuários
- Atualização dos dados de usuários existentes
- Alteração de função e status
- Mudança de foto de perfil

### 4. Exclusão de Usuários
- Remoção de usuários com confirmação

## Integração com API
O componente utiliza o serviço `usersService.ts` para se comunicar com o backend, que oferece os seguintes endpoints:

- `GET /api/v1/users` - Obtém lista paginada de usuários
- `GET /api/v1/users/{id}` - Obtém um usuário específico
- `POST /api/v1/users` - Cria um novo usuário
- `PATCH /api/v1/users/{id}` - Atualiza um usuário existente
- `DELETE /api/v1/users/{id}` - Remove um usuário
- `POST /api/v1/files/upload` - Upload de foto de perfil

## Como Utilizar
Para acessar o gerenciamento de usuários, navegue para a área administrativa (`/admin`) e selecione a opção "Usuários" no menu lateral. É necessário ter permissões de administrador para acessar esta funcionalidade.

## Estrutura de Dados

### User
```typescript
interface User {
  id: number;
  email: string;
  provider: string;
  socialId: string;
  firstName: string;
  lastName: string;
  photo: {
    id: string;
    path: string;
  } | null;
  role: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

### CreateUserDto
```typescript
interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  photo?: {
    id: string;
  };
  role: {
    id: number;
  };
  status: {
    id: number;
  };
}
```

### UpdateUserDto
```typescript
interface UpdateUserDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  photo?: {
    id: string;
  };
  role?: {
    id: number;
  };
  status?: {
    id: number;
  };
}
```
