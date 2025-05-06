import axios from 'axios';

export const getProdutos = () => 
  axios.get('http://localhost:3000/api/produtos')
       .then(res => res.data);
