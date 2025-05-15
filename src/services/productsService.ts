import axios from 'axios';

export const getProdutos = async (page = 0, size = 10, sortBy = 'id') => {
  try {
    const response = await axios.get('http://localhost:8082/v1/product/find', {
      params: {
        page,
        size,
        sortBy,
      },
    });
    console.log('Produtos recebidos:', response.data); // Log para verificar os dados recebidos
    return response.data; // Retorna o objeto completo da resposta com paginação
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};


