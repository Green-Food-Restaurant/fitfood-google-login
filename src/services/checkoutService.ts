import axios from 'axios';

const CHECKOUT_API_URL = import.meta.env.VITE_CHECKOUT_API_URL || 'http://localhost:8090/v1/checkout/create';

export interface CheckoutResponse {
  statusCode: number;
  message: string;
  data: {
    initPoint: string;
  };
  timestamp: string;
}

export async function createCheckout(payload: unknown): Promise<{ data: CheckoutResponse }> {
  return axios.post(CHECKOUT_API_URL, payload);
}
