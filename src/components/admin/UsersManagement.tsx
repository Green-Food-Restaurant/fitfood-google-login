import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Pencil,
  Trash2,
  UserPlus, 
  Filter, 
  ArrowUpDown,
  Loader2,
  Upload,
  Calendar,
  Mail,
  UserCheck,
  UserX,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  usersService, 
  STATUS_OPTIONS, 
  ROLE_OPTIONS,
  PaginatedUsers
} from '@/services/usersService';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const UsersManagement: React.FC = () => {
  // Estados principais
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openUserDialog, setOpenUserDialog] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [updatingStatusIds, setUpdatingStatusIds] = useState<number[]>([]);
  // Estado para diálogo de confirmação de alteração de status
  const [openStatusDialog, setOpenStatusDialog] = useState<boolean>(false);
  const [userToUpdateStatus, setUserToUpdateStatus] = useState<User | null>(null);

  // Estado de paginação
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false
  });

  // Estado para formulário
  const [formData, setFormData] = useState<CreateUserDto | UpdateUserDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: { id: 2 }, // default: user
    status: { id: 1 } // default: active
  });
  // Função para carregar usuários
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Construir o filtro baseado nas seleções do usuário
      let filters = '';
      if (roleFilter !== 'all') {
        filters += `role.name||$eq||${roleFilter}`;
      }
      if (statusFilter !== 'all') {
        if (filters) filters += ',';
        filters += `status.name||$eq||${statusFilter}`;
      }
      if (searchTerm) {
        const searchFilter = `firstName||$cont||${searchTerm},lastName||$cont||${searchTerm},email||$cont||${searchTerm}`;
        if (filters) filters = `${filters},${searchFilter}`;
        else filters = searchFilter;
      }
      
      // Log para debug
      console.log(`Buscando usuários: página=${pagination.page}, limite=${pagination.limit}, filtros=${filters || 'nenhum'}`);

      const result = await usersService.getUsers(
        pagination.page,
        pagination.limit,
        filters
      );

      // Verificar se temos dados válidos
      if (!result || !result.data) {
        throw new Error('Resposta inválida do servidor');
      }

      // Log para confirmar sucesso
      console.log(`Usuários carregados com sucesso: ${result.data.length} encontrados`);

      setUsers(result.data);
      setPagination(prev => ({
        ...prev,
        hasNextPage: result.hasNextPage || false,
        totalItems: result.totalItems || result.data.length
      }));
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      
      // Formatar uma mensagem de erro mais detalhada
      let errorMessage = 'Falha ao carregar usuários. Tente novamente.';
      
      if (error.response) {
        // Erro de resposta do servidor
        errorMessage = `Erro ${error.response.status}: ${error.response.statusText || 'Falha na resposta do servidor'}`;
        console.error('Detalhes da resposta de erro:', error.response.data);
      } else if (error.request) {
        // Erro de requisição (sem resposta)
        errorMessage = 'Servidor não respondeu à requisição. Verifique sua conexão.';
        console.error('Requisição sem resposta:', error.request);
      } else if (error.message) {
        // Erro durante a configuração da requisição
        errorMessage = `Erro: ${error.message}`;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // Carregar usuários quando os filtros ou paginação mudam
  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, searchTerm, roleFilter, statusFilter]);

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM, yyyy", { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Função para adicionar um novo usuário
  const handleAddUser = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: { id: 2 }, // default: user
      status: { id: 1 } // default: active
    });
    setPhotoFile(null);
    setIsEditMode(false);
    setOpenUserDialog(true);
  };

  // Função para editar um usuário existente
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: { id: user.role.id },
      status: { id: user.status.id }
    });
    setPhotoFile(null);
    setIsEditMode(true);
    setOpenUserDialog(true);
  };

  // Função para confirmar exclusão de usuário
  const handleDeleteConfirm = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };
  // Função para deletar usuário
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsSubmitting(true);
    try {
      await usersService.deleteUser(userToDelete.id.toString());
      toast.success('Usuário excluído com sucesso');
      fetchUsers(); // Recarregar a lista
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      
      // Tratamento detalhado do erro
      let errorMessage = 'Falha ao excluir usuário.';
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = 'Você não tem permissão para excluir este usuário.';
        } else if (error.response.status === 409) {
          errorMessage = 'Este usuário não pode ser excluído pois está vinculado a outros registros.';
        } else {
          errorMessage = `Erro ${error.response.status}: ${error.response.statusText || 'Falha ao excluir'}`;
        }
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setOpenDeleteDialog(false);
      setUserToDelete(null);
    }
  };  // Função para exibir o diálogo de confirmação antes de alternar o status
  const handleToggleUserStatusConfirm = (user: User) => {
    setUserToUpdateStatus(user);
    setOpenStatusDialog(true);
  };

  // Função para alternar o status do usuário (ativo/inativo)
  const handleToggleUserStatus = async () => {
    if (!userToUpdateStatus) return;

    // Evite múltiplos cliques quando uma atualização já está em andamento
    if (updatingStatusIds.includes(userToUpdateStatus.id)) {
      return;
    }

    try {
      // Corrigir: considerar 'active' e 'Active' como ativo
      const currentIsActive = userToUpdateStatus.status.name === 'active' || userToUpdateStatus.status.name === 'Active';
      const newIsActive = !currentIsActive;
      const newStatusText = newIsActive ? 'ativo' : 'inativo';
      
      // Adicionar o ID do usuário à lista de IDs em atualização
      setUpdatingStatusIds((prev) => [...prev, userToUpdateStatus.id]);
      
      console.log(`Alterando status de ${userToUpdateStatus.firstName} ${userToUpdateStatus.lastName} para ${newStatusText}...`);
      
      // Chamar a API para atualizar o status
      await usersService.updateUserStatus(userToUpdateStatus.id.toString(), newIsActive);
      
      // Atualizar o usuário na lista local
      setUsers(users.map(u => 
        u.id === userToUpdateStatus.id 
          ? { 
              ...u, 
              status: { 
                ...u.status, 
                name: newIsActive ? 'active' : 'inactive', 
                id: newIsActive ? 1 : 2 
              } 
            } 
          : u
      ));
      
      // Mostrar mensagem de sucesso
      toast.success(`Status de ${userToUpdateStatus.firstName} ${userToUpdateStatus.lastName} alterado para ${newStatusText}.`);
    } catch (error: any) {
      console.error('Erro ao atualizar status do usuário:', error);
      
      // Mensagem de erro mais detalhada
      let errorMessage = 'Erro ao alterar status do usuário.';
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = 'Você não tem permissão para alterar o status deste usuário.';
        } else if (error.response.status === 404) {
          errorMessage = 'Usuário não encontrado. A página será recarregada.';
          // Recarregar dados em caso de usuário não encontrado
          setTimeout(() => fetchUsers(), 2000);
        } else {
          errorMessage = `Erro ${error.response.status}: ${error.response.statusText || 'Falha ao alterar status'}`;
        }
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      // Remover o ID do usuário da lista de IDs em atualização
      setUpdatingStatusIds((prev) => prev.filter((id) => id !== userToUpdateStatus.id));
      setOpenStatusDialog(false);
      setUserToUpdateStatus(null);
    }
  };

  // Tratamento de upload de foto
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  // Função para limpar o input de arquivo
  const clearPhotoInput = () => {
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };
  // Função para submeter o formulário (adicionar/editar usuário)
  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      let photoId: string | undefined;
      
      // Upload da foto, se houver
      if (photoFile) {
        try {
          console.log('Enviando foto para upload:', photoFile.name);
          const uploadResult = await usersService.uploadPhoto(photoFile);
          photoId = uploadResult.file.id;
          console.log('Foto enviada com sucesso, ID:', photoId);
        } catch (uploadError: any) {
          console.error('Erro no upload da foto:', uploadError);
          toast.error(`Falha no upload da foto: ${uploadError.message || 'Erro desconhecido'}`);
          // Continuamos o fluxo mesmo com falha no upload da foto
        }
      }
      
      // Adicionar ID da foto ao formulário, se houver
      const userData = {
        ...formData,
        ...(photoId ? { photo: { id: photoId } } : {})
      };
      
      console.log(`${isEditMode ? 'Atualizando' : 'Criando'} usuário:`, userData);
      
      if (isEditMode && selectedUser) {
        // Atualizar usuário existente
        await usersService.updateUser(selectedUser.id.toString(), userData as UpdateUserDto);
        toast.success('Usuário atualizado com sucesso');
      } else {
        // Adicionar novo usuário
        await usersService.createUser(userData as CreateUserDto);
        toast.success('Usuário criado com sucesso');
      }
      
      // Recarregar a lista e limpar o formulário
      fetchUsers();
      setOpenUserDialog(false);
      clearPhotoInput();
      
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      
      let errorMessage = 'Falha ao salvar usuário.';
      
      if (error.response) {
        // Mensagens personalizadas para códigos de erro comuns
        if (error.response.status === 400) {
          errorMessage = 'Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.';
          
          // Se houver detalhes de validação específicos
          if (error.response.data?.message) {
            if (typeof error.response.data.message === 'string') {
              errorMessage += ` ${error.response.data.message}`;
            } else if (Array.isArray(error.response.data.message)) {
              errorMessage += ` ${error.response.data.message.join(', ')}`;
            }
          }
        } else if (error.response.status === 409) {
          errorMessage = 'Já existe um usuário com este e-mail.';
        } else if (error.response.status === 403) {
          errorMessage = 'Você não tem permissão para realizar esta operação.';
        } else {
          errorMessage = `Erro ${error.response.status}: ${error.response.statusText || 'Falha ao salvar'}`;
        }
        
        console.error('Detalhes da resposta de erro:', error.response.data);
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para mudar página
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciamento de Usuários</h1>
        
        <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700">
          <UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Gerencie os usuários da plataforma.</CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Filtros e pesquisa */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar por nome ou email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todas</SelectItem>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todos</SelectItem>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.id} value={status.name}>
                        {status.name === 'active' ? 'Ativo' : 'Inativo'}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
            {/* Tabela de usuários */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-green-500" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-300 max-w-md text-center">
                <p className="font-bold mb-1">Erro ao carregar dados</p>
                <p className="text-sm">{error}</p>
                <Button 
                  onClick={() => {
                    setError(null);
                    fetchUsers();
                  }}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                >
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              {user.photo ? (
                                <AvatarImage src={user.photo.path} alt={`${user.firstName} ${user.lastName}`} />
                              ) : (
                                <AvatarFallback>
                                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user.provider === 'email' ? 'Cadastro local' : `${user.provider}`}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            user.role.name === 'admin' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }>
                            {user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm">{formatDate(user.createdAt)}</span>
                          </div>
                        </TableCell>                        <TableCell className="text-center">
                          <Badge
                            className={`
                              ${user.status.name === 'active' || user.status.name === 'Active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900'
                              }
                              flex items-center justify-center gap-1 px-3 py-1 select-none
                            `}
                            // Removido onClick e title para não ser mais botão
                            style={{ cursor: 'default', pointerEvents: 'none' }}
                          >
                            {user.status.name === 'active' || user.status.name === 'Active' ? (
                              <span className="flex items-center gap-1"><UserCheck className="h-3 w-3 mr-1" /> Ativo</span>
                            ) : (
                              <span className="flex items-center gap-1"><UserX className="h-3 w-3 mr-1" /> Inativo</span>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white"
                              title="Editar usuário"
                            >
                              <Pencil className="h-4 w-4 text-white" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteConfirm(user)}
                              className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700 text-white"
                              title="Excluir usuário"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </Button>
                            <Button
                              onClick={() => handleToggleUserStatusConfirm(user)}
                              className={`h-8 w-8 p-0 ${
                                user.status.name === 'active' || user.status.name === 'Active'
                                  ? 'bg-orange-500 hover:bg-orange-600'
                                  : 'bg-green-600 hover:bg-green-700'
                              } text-white ${updatingStatusIds.includes(user.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title={user.status.name === 'active' || user.status.name === 'Active' ? 'Desativar usuário' : 'Ativar usuário'}
                              disabled={updatingStatusIds.includes(user.id)}
                            >
                              {updatingStatusIds.includes(user.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin text-white" />
                              ) : user.status.name === 'active' || user.status.name === 'Active' ? (
                                <UserX className="h-4 w-4 text-white" />
                              ) : (
                                <UserCheck className="h-4 w-4 text-white" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Paginação */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando {users.length} resultados
            </div>
            <Pagination>
              <PaginationContent>                <PaginationItem>
                  <span 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className={`cursor-pointer flex items-center gap-1 ${pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Anterior</span>
                  </span>
                </PaginationItem>
                
                {/* Página atual */}                <PaginationItem>
                  <a className="bg-green-100 text-green-800 cursor-default rounded px-3 py-1 font-medium">
                    {pagination.page}
                  </a>
                </PaginationItem>
                
                {pagination.hasNextPage && (
                  <PaginationItem>
                    <a 
                      onClick={() => handlePageChange(pagination.page + 1)} 
                      className="cursor-pointer rounded px-3 py-1 hover:bg-gray-100"
                    >
                      {pagination.page + 1}
                    </a>
                  </PaginationItem>
                )}
                  <PaginationItem>
                  <span 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className={`cursor-pointer flex items-center gap-1 ${!pagination.hasNextPage ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <span>Próxima</span>
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
      
      {/* Modal para adicionar/editar usuário */}
      <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Atualize as informações do usuário abaixo.' 
                : 'Preencha as informações do novo usuário.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitUser} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email"
                    className="pl-10"
                    value={formData.email as string} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              
              {!isEditMode && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={formData.password as string || ''} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required={!isEditMode}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName as string || ''} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName as string || ''} 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo">Foto</Label>
                <div className="flex items-center space-x-2">                  <Button 
                    type="button" 
                    className="border rounded p-1 px-2 text-sm flex items-center gap-1" 
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Selecionar Foto
                  </Button>
                  <input 
                    ref={photoInputRef}
                    type="file" 
                    id="photo" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                  {photoFile && (
                    <span className="text-sm text-gray-500">
                      {photoFile.name}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select 
                  value={formData.role?.id.toString()} 
                  onValueChange={(value) => setFormData({...formData, role: { id: parseInt(value) }})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status?.id.toString()} 
                  onValueChange={(value) => setFormData({...formData, status: { id: parseInt(value) }})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.name === 'active' ? 'Ativo' : 'Inativo'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>              <Button type="button" className="border rounded p-2" onClick={() => setOpenUserDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded p-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isEditMode ? (
                  'Salvar Alterações'
                ) : (
                  'Adicionar Usuário'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmação para excluir usuário */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{userToDelete?.firstName} {userToDelete?.lastName}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>      </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Diálogo de confirmação para alteração de status */}
      <AlertDialog open={openStatusDialog} onOpenChange={setOpenStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alteração de status</AlertDialogTitle>
            <AlertDialogDescription>
              {userToUpdateStatus && (
                <>
                  {userToUpdateStatus.status.name === 'active' || userToUpdateStatus.status.name === 'Active' ? (
                    <>
                      Tem certeza que deseja <strong>desativar</strong> o usuário <strong>{userToUpdateStatus.firstName} {userToUpdateStatus.lastName}</strong>?
                      <br />
                      Usuários inativos perdem o acesso à plataforma.
                    </>
                  ) : (
                    <>
                      Tem certeza que deseja <strong>ativar</strong> o usuário <strong>{userToUpdateStatus.firstName} {userToUpdateStatus.lastName}</strong>?
                      <br />
                      Usuários ativos têm acesso à plataforma.
                    </>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleUserStatus}
              className={userToUpdateStatus?.status.name === 'active' || userToUpdateStatus?.status.name === 'Active' 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : userToUpdateStatus?.status.name === 'active' || userToUpdateStatus?.status.name === 'Active' ? (
                'Desativar'
              ) : (
                'Ativar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersManagement;
