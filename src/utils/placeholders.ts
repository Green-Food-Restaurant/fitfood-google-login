// Um utilitário para mapear categorias a imagens de placeholder específicas

// Lista de todas as URLs de placeholders para pré-carregamento
const placeholderUrls = [
  '/placeholder.svg',
  '/placeholders/lanche-placeholder.svg',
  '/placeholders/bebida-placeholder.svg',
  '/placeholders/sobremesa-placeholder.svg',
  '/placeholders/acompanhamento-placeholder.svg',
  '/placeholders/salada-placeholder.svg'
];

/**
 * Pré-carrega todas as imagens placeholder para uso rápido
 */
export const preloadPlaceholders = () => {
  console.log('🖼️ Pré-carregando imagens de placeholder...');
  const preloadedImages: HTMLImageElement[] = [];
  
  placeholderUrls.forEach(url => {
    const img = new Image();
    img.src = url;
    img.onload = () => console.log(`✅ Placeholder carregado: ${url}`);
    img.onerror = () => console.error(`❌ Erro ao carregar placeholder: ${url}`);
    preloadedImages.push(img);
  });
  
  return preloadedImages; // Retorna as imagens para evitar que sejam coletadas pelo garbage collector
};

/**
 * Retorna o caminho para a imagem de placeholder apropriada para a categoria especificada
 * @param categoria A categoria do produto
 * @returns O caminho para a imagem de placeholder
 */
export const getPlaceholderByCategory = (categoria: string | null | undefined): string => {
  if (!categoria) return '/placeholder.svg';
  
  switch (categoria.toUpperCase()) {
    case 'LANCHE':
      return '/placeholders/lanche-placeholder.svg';
    case 'BEBIDA':
      return '/placeholders/bebida-placeholder.svg';
    case 'SOBREMESA':
      return '/placeholders/sobremesa-placeholder.svg';
    case 'ACOMPANHAMENTO':
      return '/placeholders/acompanhamento-placeholder.svg';
    case 'SALADAS':
      return '/placeholders/salada-placeholder.svg';
    default:
      return '/placeholder.svg';
  }
};

// Iniciar o pré-carregamento assim que este módulo for importado
preloadPlaceholders();

// Não usar export default aqui para evitar confusões com importação
// export default getPlaceholderByCategory;
