import React, { useState, useEffect } from 'react';
import { getPlaceholderByCategory } from '@/utils/placeholders';

interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  fallbackSrc?: string;
  category?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Um componente de imagem que exibe automaticamente uma imagem de fallback 
 * quando a imagem principal não pode ser carregada.
 * Se uma categoria for fornecida, usará um placeholder específico para a categoria.
 */
const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  category,
  className = '',
  style = {},
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
    // Se uma categoria for fornecida e nenhum fallbackSrc específico for definido,
  // use o placeholder específico da categoria
  const finalFallbackSrc = category 
    ? getPlaceholderByCategory(category) 
    : fallbackSrc;
    
  // Garantir que URLs vazias ou inválidas (como "null" ou "undefined" em texto) sejam tratadas como ausência de imagem
  const isValidSrc = src && src.trim() !== '' && src !== 'null' && src !== 'undefined';
  const usingFallback = error || !isValidSrc;
  
  // Log para debug
  useEffect(() => {
    console.log(`ImageWithFallback: ${alt}`, { 
      src, 
      category, 
      isValidSrc, 
      usingFallback, 
      finalFallbackSrc 
    });
  }, [src, category, error]);
    return (
    <div className="relative w-full h-full">
      <img
        src={usingFallback ? finalFallbackSrc : src}
        alt={alt}
        className={className}
        style={style}
        onError={() => {
          console.log(`Erro ao carregar imagem: ${src}`);
          setError(true);
        }}
      />
      {usingFallback && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-[8px] text-center py-1">
          Imagem padrão
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
