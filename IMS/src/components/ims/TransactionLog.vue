<template> 
  <div v-if="isVisible" class="modal-overlay">
    <div class="transaction-log-modal">
      <div class="modal-header">
        <h2>Transaction History</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="pi pi-times"></i>
        </button>
      </div>
      <div class="transaction-log-content">
        <table class="transaction-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Transaction Type</th>
              <th>Quantity Change</th>
              <th>Unit Price</th>
              <th>User</th>  <!-- Add this column -->
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactions" :key="transaction.id">
  <td>{{ getProductName(transaction.product_id) }}</td>
  <td>
    <span :class="'transaction-type ' + (transaction.transaction_type ? transaction.transaction_type.toLowerCase() : '')">
      {{ transaction.transaction_type || 'Unknown' }}
    </span>
  </td>
  <td :class="{
    'quantity-added': transaction.quantity_change > 0, 
    'quantity-removed': transaction.quantity_change < 0
  }">
    {{ transaction.quantity_change > 0 ? '+' : ''}}{{ transaction.quantity_change }}
  </td>
  <td>{{ formatCurrency(transaction.unit_price) }}</td>
  <td>{{ transaction.user_name || 'System' }}</td>  <!-- Add this cell -->
  <td>{{ formatDate(transaction.timestamp) }}</td>
</tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  name: 'TransactionLog',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      transactions: [],
      products: [],  // Initialize products as an empty array

      toast: useToast()
    };
  },
  methods: {
    async fetchTransactions() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/inventory/inventory_transactions');
        this.transactions = response.data.transactions || response.data;
      } catch (error) {
        console.error('Error fetching transactions:', error);
        this.toast.error('Failed to load transaction history');
      }
    },
    async fetchProducts() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/inventory/inventoryproducts/all');
      this.products = response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
  getProductName(productId) {
  if (!this.products || !Array.isArray(this.products)) return "Unknown Product";
  const product = this.products.find(p => p.id === productId);
  return product ? product.ProductName : "Unknown Product";
},
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleString();
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    }
  },
  watch: {
  isVisible(newValue) {
    if (newValue) {
      this.fetchTransactions();
      this.fetchProducts();  // Fetch products when modal opens
    }
  }
  }
};
</script>

  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .transaction-log-modal {
    background: white;
    border-radius: 10px;
    width: 90%;
    max-width: 900px;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .modal-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
  }
  
  .modal-header h2 {
    color: #333;
    margin: 0;
    font-size: 1.5rem;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
    transition: color 0.3s;
  }
  
  .close-btn:hover {
    color: #E54F70;
  }
  
  .transaction-log-content {
    padding: 20px;
  }
  
  .transaction-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .transaction-table th,
  .transaction-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  .transaction-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #333;
  }
  
  .transaction-type {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .transaction-type.added {
    background-color: #E8F5E9;
    color: #4CAF50;
  }
  
  .transaction-type.used {
    background-color: #FFF3E0;
    color: #FF9800;
  }
  
  .transaction-type.updated {
    background-color: #E3F2FD;
    color: #2196F3;
  }
  
  .quantity-added {
    color: #4CAF50;
    font-weight: 500;
  }
  
  .quantity-removed {
    color: #FF9800;
    font-weight: 500;
  }
  .transaction-table td.user-cell {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.user-name {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.user-name i {
  font-size: 14px;
  color: #999;
}
  </style>