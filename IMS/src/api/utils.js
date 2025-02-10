// src/api/utils.js

import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api";  // Update the URL as per your API

export async function fetchCategories() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories');  // Make sure this URL is correct
      return response.data;  // Assuming the response is an array of categories
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
  
  // Fetch suppliers from API
  export async function fetchSuppliers() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/suppliers');  // Ensure this URL is correct
      return response.data;  // Assuming the response is an array of suppliers
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return [];
    }
  }