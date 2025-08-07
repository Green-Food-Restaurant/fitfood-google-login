import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';
import { FiAlertTriangle, FiRefreshCw, FiLogOut, FiClock } from 'react-icons/fi';

/**
 * Componente que mostra um modal quando a sessão está prestes a expirar
 * Permite ao usuário renovar a sessão ou fazer logout
 */
const SessionTimeoutModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isRenewing, setIsRenewing] = useState(false);
  const { refreshToken, logout, sessionTimeRemaining } = useAuth();
  
  // Usar refs para evitar loops infinitos
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSessionTimeRef = useRef<number | null>(null);

  // Limpar o timer quando o componente desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);  // Verificar se precisa mostrar o modal quando o tempo de sessão for menor que 1 minuto
  useEffect(() => {
    // Não fazer nada se o valor for undefined
    if (sessionTimeRemaining === undefined) {
      return;
    }

    // Implementar debounce para evitar atualizações frequentes demais
    // Só processar se a diferença for significativa (mais de 5 segundos)
    const currentTime = sessionTimeRemaining;
    const lastTime = lastSessionTimeRef.current;
    
    if (lastTime !== null && 
        currentTime !== null && 
        Math.abs(currentTime - lastTime) < 5000) {
      return;
    }
    
    // Armazenar o novo valor para comparação futura
    lastSessionTimeRef.current = sessionTimeRemaining;
    
    // Modal só aparece quando estamos próximos da expiração
    const shouldShowModal = sessionTimeRemaining !== null && sessionTimeRemaining <= 60000 && sessionTimeRemaining > 0;
    const shouldHideModal = sessionTimeRemaining === null || sessionTimeRemaining > 60000;

    if (shouldShowModal) {
      // Só configuramos o timer se ele ainda não existe
      if (!timerRef.current) {
        setOpen(true);
        setCountdown(Math.ceil(sessionTimeRemaining / 1000));
        
        timerRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Atualizamos apenas o countdown sem recriar o timer
        setCountdown(Math.ceil(sessionTimeRemaining / 1000));
      }
    } else if (shouldHideModal) {
      setOpen(false);
      
      // Limpar o timer quando fechar o modal
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [sessionTimeRemaining]);
  
  // Função para fazer logout
  const handleLogout = useCallback(() => {
    // Limpar o timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setOpen(false);
    logout();
    toast.info('Sua sessão foi encerrada', {
      description: 'Você foi desconectado com segurança.'
    });
  }, [logout]);

  // Fechar sessão quando o contador chegar a zero
  useEffect(() => {
    if (countdown === 0 && open) {
      handleLogout();
    }
  }, [countdown, handleLogout, open]);
    // Função para renovar a sessão
  const handleRenewSession = useCallback(async () => {
    if (isRenewing) return; // Evitar múltiplas chamadas simultâneas
    
    try {
      setIsRenewing(true);
      
      // Feedback visual para o usuário
      toast.loading('Renovando sua sessão...');
      
      // Utilizamos um flag para evitar processamento enquanto estiver ocupado
      const renewPromise = refreshToken();
      const success = await renewPromise;
      
      if (success) {
        // Limpar o timer apenas depois de confirmar o sucesso
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        // Atualizar o estado apenas se o componente ainda estiver montado
        setOpen(false);
        toast.success('Sessão renovada com sucesso!', {
          description: 'Você pode continuar usando o sistema.'
        });
      } else {
        // Se não conseguir renovar, mostrar mensagem e fazer logout
        toast.error('Não foi possível renovar a sessão', {
          description: 'Por favor, faça login novamente.'
        });
        handleLogout();
      }
    } catch (error) {
      console.error('Erro ao renovar sessão:', error);
      toast.error('Erro ao renovar sessão');
    } finally {
      // Atualizamos o estado apenas se o componente ainda estiver montado
      setIsRenewing(false);
    }
  }, [refreshToken, isRenewing, handleLogout]);
  // Função de manipulação de mudança do estado do modal
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen && open) {
      // Se o usuário fechar o modal manualmente, assumimos que ele quer continuar
      // mas não queremos chamar o refreshToken automaticamente para evitar loops
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setOpen(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex items-center space-x-2">
          <div className="flex-shrink-0 p-1.5 bg-amber-100 rounded-full">
            <FiAlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <DialogTitle className="text-amber-600">
              Sessão prestes a expirar
            </DialogTitle>
            <DialogDescription>
              Por motivos de segurança, sua sessão será encerrada automaticamente.
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="mt-2 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <FiClock className="text-gray-400" />
              <span>Tempo restante:</span>
            </div>
            <div className="font-mono font-bold text-amber-600">
              {`${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`}
            </div>
          </div>

          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-1000" 
              style={{ width: `${(countdown / 60) * 100}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-600">
            O que você deseja fazer antes que sua sessão expire?
          </p>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isRenewing}
            className="flex items-center gap-2"
          >
            <FiLogOut className="h-4 w-4" />
            <span>Encerrar Sessão</span>
          </Button>
          
          <Button 
            onClick={handleRenewSession}
            disabled={isRenewing}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <FiRefreshCw className={`h-4 w-4 ${isRenewing ? 'animate-spin' : ''}`} />
            <span>{isRenewing ? 'Renovando...' : 'Continuar Conectado'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionTimeoutModal;
