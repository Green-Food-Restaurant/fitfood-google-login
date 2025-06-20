// Adapta a resposta da API para garantir que sempre retorna um objeto com 'data', 'hasNextPage' e 'totalItems' (se existirem)
export function adaptApiResponse(response: any) {
  if (!response) return { data: [], hasNextPage: false };

  // Caso a resposta já esteja no formato esperado
  if (response.data && Array.isArray(response.data)) {
    return {
      data: response.data,
      hasNextPage: response.hasNextPage ?? false,
      totalItems: response.totalItems ?? response.data.length
    };
  }

  // Caso a resposta seja um array diretamente
  if (Array.isArray(response)) {
    return {
      data: response,
      hasNextPage: false,
      totalItems: response.length
    };
  }

  // Caso a resposta seja um objeto único
  if (typeof response === 'object' && response !== null) {
    return {
      data: [response],
      hasNextPage: false,
      totalItems: 1
    };
  }

  // Fallback
  return { data: [], hasNextPage: false };
}
