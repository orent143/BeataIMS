import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api/inventory/";

export const createInventoryProduct = (formData) => {
  return axios.post(`${API_BASE_URL}inventoryproduct/`, formData);
};

export const getInventoryProducts = () => {
  return axios.get(`${API_BASE_URL}inventoryproduct/`);
};
export const updateInventoryProduct = (productId, updatedProduct) => {
  return axios.put(`${API_BASE_URL}inventoryproduct/${productId}`, updatedProduct);
};

