import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPrevious, 
  onNext 
}) => {
  return (
    <div className="flex justify-center items-center mt-8 gap-4">
      <Button 
        onClick={onPrevious} 
        disabled={currentPage === 0}
        variant="outline"
        className="flex items-center gap-2"
      >
        <span>←</span> Anterior
      </Button>
      
      <span className="text-sm text-gray-600">
        Página {currentPage + 1} de {totalPages}
      </span>
      
      <Button 
        onClick={onNext} 
        disabled={currentPage === totalPages - 1}
        variant="outline"
        className="flex items-center gap-2"
      >
        Próxima <span>→</span>
      </Button>
    </div>
  );
};

export default Pagination;
