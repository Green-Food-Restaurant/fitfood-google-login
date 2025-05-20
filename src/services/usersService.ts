import { httpService } from './httpService';
import { adaptApiResponse } from '@/utils/apiUtils';

export interface User {
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

export interface CreateUserDto {
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

export interface UpdateUserDto {
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

export interface PaginatedUsers {
  data: User[];
  hasNextPage: boolean;
  totalItems?: number; // Opcional para compatibilidade
}

// Definições de status e roles para usar no cadastro/edição
export const STATUS_OPTIONS = [
  { id: 1, name: 'active' },
  { id: 2, name: 'inactive' }
];

export const ROLE_OPTIONS = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'user' },
  { id: 3, name: 'manager' }
];

export const usersService = {
  // Buscar todos os usuários com paginação e filtros
  getUsers: async (
    page: number = 1, 
    limit: number = 10, 
    filters?: string
  ): Promise<PaginatedUsers> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters) params.append('filters', filters);
    
    try {
      console.log(`Requisitando usuários com parâmetros: ${params.toString()}`);
      const response = await httpService.get(`/users?${params.toString()}`);
      console.log('Resposta da API:', response);
      
      // Usar o adaptador para garantir formato consistente
      return adaptApiResponse(response);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  // Buscar um usuário específico por ID
  getUserById: async (id: string): Promise<User> => {
    const response = await httpService.get(`/users/${id}`);
    return response.data;
  },
  // Criar um novo usuário
  createUser: async (userData: CreateUserDto): Promise<User> => {
    const response = await httpService.post('/users', userData);
    return response.data;
  },

  // Atualizar um usuário existente
  updateUser: async (id: string, userData: UpdateUserDto): Promise<User> => {
    const response = await httpService.patch(`/users/${id}`, userData);
    return response.data;
  },  // Atualizar apenas o status do usuário
  updateUserStatus: async (id: string, isActive: boolean): Promise<User> => {
    const status = isActive ? "ACTIVE" : "INACTIVE";
    console.log(`Atualizando status do usuário ${id} para ${status}`);
    
    try {
      const response = await httpService.patch<User>(`/users/${id}`, {
        status
      });
      
      console.log('Resposta da atualização de status:', response);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      throw error;
    }
  },

  // Remover um usuário
  deleteUser: async (id: string): Promise<void> => {
    await httpService.delete(`/users/${id}`);
  },

  // Upload de foto de usuário
  uploadPhoto: async (file: File): Promise<{file: {id: string, path: string}}> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await httpService.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }
};
