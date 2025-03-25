<template>
  <Header :isSidebarCollapsed="isSidebarCollapsed" @toggle-sidebar="handleSidebarToggle" />
  <SideBar :isCollapsed="isSidebarCollapsed" />
  <div class="app-container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <div class="details-container">
      <div class="header-section">
        <button class="back-btn" @click="$router.go(-1)">
          <i class="pi pi-arrow-left"></i> Back
        </button>
        <h1>Product Details</h1>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="content-layout">

        <!-- Left Section - Product Details -->
        <div class="main-content">
          <div class="product-details">
            <img :src="product.Image || 'https://via.placeholder.com/150'" 
                 alt="Product Image" 
                 class="product-image" />
            <div class="product-title">
              <h2>{{ product.ProductName }}</h2>
              <span class="product-id">ID: {{ product.ProductID }}</span>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <label>Process Type</label>
              <span>{{ product.ProcessType || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <label>Quantity</label>
              <span>{{ product.Quantity }}</span>
            </div>
            <div class="detail-item">
              <label>Cost Price</label>
              <span>₱{{ product.CostPrice?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="detail-item">
              <label>Current Supplier</label>
              <span class="supplier-name">{{ product.CurrentSupplier || 'N/A' }}</span>
            </div>
            <div class="detail-item">
  <label>Status</label>
  <span :class="'status status-' + product.Status?.toLowerCase().replace(/ /g, '-')">
    {{ product.Status }}
  </span>
</div>
          </div>
        </div>

        <!-- Right Section - Stock & Deduction Details -->
        <div class="stock-details-sidebar">
          <div class="stock-details-header-container">
            <h3 class="stock-details-header">Stock & Deducted Transactions</h3>

            <div class="transaction-filters">
    <button 
      :class="['filter-btn', { active: transactionFilter === 'all' }]"
      @click="transactionFilter = 'all'"
    >
      All
    </button>
    <button 
      :class="['filter-btn', { active: transactionFilter === 'added' }]"
      @click="transactionFilter = 'added'"
    >
      Added Stock
    </button>
    <button 
      :class="['filter-btn', { active: transactionFilter === 'deducted' }]"
      @click="transactionFilter = 'deducted'"
    >
      Deducted Stock
    </button>
  </div>

            <div class="date-filter">
              <div class="date-inputs">
                <div class="date-input">
                  <label>From:</label>
                  <input 
                    type="date" 
                    v-model="dateFilter.from"
                    :max="dateFilter.to || today"
                  />
                </div>
                <div class="date-input">
                  <label>To:</label>
                  <input 
                    type="date" 
                    v-model="dateFilter.to"
                    :min="dateFilter.from"
                    :max="today"
                  />
                </div>
              </div>
              <button class="clear-filter" @click="clearDateFilter">
                <i class="pi pi-times"></i> Clear
              </button>
            </div>
          </div>

          <div class="combined-transactions">
            <div v-if="combinedTransactions.length === 0" class="no-data">
  No stock details available.
</div>
  <div v-for="item in filteredTransactions" 
       :key="item.id || item.TransactionID" 
       class="transaction-card">
    
    <!-- Stock Details -->
    <div v-if="item.stock_location" class="stock-card">
  <div class="stock-card-header">
    <span :class="['transaction-type', item.TransactionType ? item.TransactionType.toLowerCase() : 'add']">
    {{ item.TransactionType || 'Added' }}
  </span>
    <span class="timestamp">{{ formatTimestamp(item.created_at) }}</span>
  </div>
  <div class="stock-card-item">
    <span class="label">Supplier</span>
    <span class="supplier-tag">{{ item.SupplierName || 'N/A' }}</span>
  </div>
  <div class="stock-card-item">
    <span class="label">Cost Price</span>
    <span class="value">₱{{ item.CostPrice?.toFixed(2) || '0.00' }}</span>
  </div>
  <div class="stock-card-item">
    <span class="label">Batch Number</span>
    <span class="value">{{ item.batch_number || "N/A" }}</span>
  </div>
  <div class="stock-card-item">
    <span class="label">Location</span>
    <span class="value">{{ item.stock_location || 'N/A' }}</span>
  </div>
  <div class="stock-card-item">
    <span class="label">Quantity</span>
    <span class="value quantity">{{ item.quantity }}</span>
  </div>
  <div class="stock-card-item">
    <span class="label">Expiration Date</span>
    <span class="value" :class="{ 'expiring': isExpiringSoon(item.expiration_date) }">
      {{ formatDate(item.expiration_date) || "N/A" }}
    </span>
  </div>
</div>

    <div v-else class="deduct-card">
      <div class="transaction-header">
        <span :class="['transaction-type', item.TransactionType ? item.TransactionType.toLowerCase() : 'deduct']">
          {{ item.TransactionType === 'Deduct' ? 'Deducted' : item.TransactionType }}  </span>
       <span class="transaction-date">{{ formatDateTime(item.TransactionDate) }}</span>
      </div>
      <div class="transaction-details">
        <div class="transaction-item">
          <span class="label">Product Name</span>
          <span class="value">{{ item.ProductName }}</span>
        </div>
        <div class="transaction-item">
          <span class="label">Quantity Deducted</span>
          <span class="value quantity-deducted">{{ item.QuantityDeducted }}</span>
        </div>
        <div class="transaction-item">
          <span class="label">Cost Price</span>
          <span class="value price">{{ item.CostPrice }}</span>
        </div>
      </div>
    </div>

  </div>
</div>

        </div>
      </div> 
    </div> 
  </div> 
</template>

<script>
import axios from 'axios';
import Header from '@/components/Header.vue';
import SideBar from '@/components/ims/SideBar.vue';
import { useToast } from 'vue-toastification';

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return {
      isSidebarCollapsed: false,
      product: null,
      loading: true,
      error: null,
      dateFilter: {
        from: '',
        to: ''
      },
      combinedTransactions: [],
      transactionFilter: 'all',
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    },
    filteredTransactions() {
    let transactions = [...this.combinedTransactions];

    if (this.transactionFilter === "added") {
      transactions = transactions.filter(item => item.stock_location);
    } else if (this.transactionFilter === "deducted") {
      transactions = transactions.filter(item => !item.stock_location);
    }

    if (this.dateFilter.from && this.dateFilter.to) {
      const fromDate = new Date(this.dateFilter.from);
      const toDate = new Date(this.dateFilter.to);
      toDate.setHours(23, 59, 59);

      transactions = transactions.filter(item => {
        const itemDate = new Date(item.created_at || item.TransactionDate);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    return transactions;
  }
  },
  async created() {
  try {
    let productId = this.$route.params.id;
    productId = parseInt(productId, 10).toString();

    const productResponse = await axios.get(`http://127.0.0.1:8000/api/stock/stockin/${productId}`);
    this.product = { ...productResponse.data };

    const stockResponse = await axios.get(`http://127.0.0.1:8000/api/stock/stockdetails/${productId}`);
    
    this.combinedTransactions = [
      ...stockResponse.data.StockDetails, 
      ...stockResponse.data.DeductedTransactions
    ].sort((a, b) => new Date(b.created_at || b.TransactionDate) - new Date(a.created_at || a.TransactionDate));

  } catch (error) {
    console.error("API Error:", error);
    this.error = error.response?.data?.detail || 'Failed to load product details';
    useToast().error(this.error);
  } finally {
    this.loading = false;
  }
},
  methods: {
    
    getStatusByQuantity(quantity) {
      if (quantity <= 0) return 'Out of Stock';
      if (quantity <= 10) return 'Low Stock';
      return 'In Stock';
    },

    getStatusClass(quantity) {
      const status = this.getStatusByQuantity(quantity);
      return `status status-${status.toLowerCase().replace(/ /g, '-')}`;
    },
    clearDateFilter() {
      this.dateFilter = { from: '', to: '' };
    },
    handleSidebarToggle(collapsed) {
      this.isSidebarCollapsed = collapsed;
    },
    formatDateTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    formatTimestamp(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    isExpiringSoon(dateString) {
      const expDate = new Date(dateString);
      const today = new Date();
      return (expDate - today) / (1000 * 60 * 60 * 24) <= 30;
    },
  }
};
</script>

  
  <style scoped>
.app-container {
  margin-left: 230px;
  background: #f8f9fa;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.app-container.sidebar-collapsed {
  margin-left: 70px; 
}

  
  .details-container {
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    max-width: 100%;
    margin: 0 auto;
  }
  
  /* Header Styles */
  .header-section {
    display: flex;
    align-items: center;
    gap: 25px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 15px;
  }
  
  .header-section h1 {
    margin: 0;
    color: #333;
  font-size: 30px;
  font-family: 'Arial', sans-serif;
  font-weight: 900;
  }
  
  .back-btn {
    padding: 10px 20px;
    background: white;
    border: 2px solid #E54F70;
    border-radius: 8px;
    color: #E54F70;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .back-btn:hover {
    background: #E54F70;
    color: white;
    transform: translateX(-5px);
  }
  

  .content-layout {
  display: grid;
  grid-template-columns: 1fr 400px; /* Main content + stock details */
  gap: 30px;
  min-height: calc(100vh - 180px);
}

.main-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
}
  /* Product Header Styles */
  .product-header {
    display: flex;
    align-items: flex-start;
    gap: 30px;
    margin-bottom: 40px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
  }
  
  .product-image {
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .product-image:hover {
    transform: scale(1.05);
  }
  
  .product-title {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 10px;
  }
  
  .product-title h2 {
    font-size: 1.8rem;
    color: #2c3e50;
    margin: 0;
    font-weight: 700;
  }
  
  .product-id {
    color: #666;
    font-size: 1rem;
    padding: 4px 12px;
    background: #e9ecef;
    border-radius: 6px;
    display: inline-block;
  }
  
  /* Details Grid Styles */
  .details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin: 30px 0;
  padding: 25px;
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
}
  
  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  .detail-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }
  
  .detail-item label {
    color: #6c757d;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .detail-item span {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
  }
  
  /* Status Styles */
  .status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  color: #fff;
  text-align: center;
}

.status-in-stock {
  background: #d4edda;
  color: #155724;
}

.status-low-stock {
  background: #fff3cd;
  color: #856404;
}

.status-out-of-stock {
  background: #f8d7da;
  color: #721c24;
}
  
  /* Loading and Error States */
  .loading, .error {
    text-align: center;
    padding: 60px;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 500;
  }
  
  .loading {
    background: #f8f9fa;
    color: #6c757d;
  }
  
  .error {
    background: #fff5f5;
    color: #dc3545;
  }
  .supplier-name {
  color: #E54F70;
  font-weight: 600;
}
.supplier-tag {
  background: #E54F70;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;
}

  /* Stock Details Styles */
  .stock-details {
    
    margin-top: 40px;
    padding: 30px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  .stock-details-sidebar {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 20px;
  height: calc(100vh - 140px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.stock-cards-container {
  flex: 1;
  overflow-y: auto;
  margin-top: 10px;
  padding-right: 10px;
}

.stock-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}



  .stock-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #eee;
}

.transaction-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #eee;
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 15px;
}
.transaction-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, #E54F70, #ff8fa3);
  border-radius: 12px 12px 0 0;
}

.stock-card-header, .transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #eee;
}

.stock-card-item, .transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
}
.transaction-card:last-child {
  margin-bottom: 0;
}
.stock-card-item:last-child, .transaction-item:last-child {
  margin-bottom: 0;
}

.value {
  font-weight: 600;
  font-size: 1rem;
  padding: 4px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.value.quantity {
  color: #2e7d32;
  background: #e8f5e9;
}

.value.quantity-deducted {
  color: #E54F70;
  background: #fff5f5;
}

.value.price {
  color: #1976d2;
  background: #e3f2fd;
  font-family: monospace;
  font-size: 1.1rem;
}

.value.expiring {
  color: #f57c00;
  background: #fff3e0;
  animation: pulse 2s infinite;
}
.combined-transactions {
  flex: 1;
  overflow-y: auto;
  margin-top: 20px;
  padding-right: 10px;
}


.stock-card-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
.timestamp, .transaction-date {
  font-size: 0.85rem;
  color: #666;
  background: #f8f9fa;
  padding: 4px 10px;
  border-radius: 12px;
}

.stock-card-item .value.price {
  color: #1976d2;
  background: #e3f2fd;
  font-family: monospace;
  font-size: 1.1rem;
}
.stock-details-header {
  color: #333;
  font-weight: 900;
  font-size: 1.2rem;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}
  
  .stock-details-header::before {
    content: '';
    width: 4px;
    height: 24px;
    background: #E54F70;
    border-radius: 2px;
  }
  
  .stock-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
  }

  
  .stock-card-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  .stock-card-item .label {
    color: #6c757d;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  .stock-card-item .value {
    font-weight: 600;
    font-size: 1rem;
    color: #2c3e50;
    padding: 4px 12px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .stock-card-item .value.quantity {
    color: #2e7d32;
    background: #e8f5e9;
    font-size: 1.1rem;
  }
  
  .stock-card-item .value.expiring {
    color: #f57c00;
    background: #fff3e0;
    animation: pulse 2s infinite;
  }
  .date-filter {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 12px;
  margin-top: 15px;
}
.transaction-filters {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.filter-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #E54F70;
  background: white;
  color: #E54F70;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #fff5f5;
}

.filter-btn.active {
  background: #E54F70;
  color: white;
}
.date-inputs {
  display: flex; /* Ensure date inputs are stacked vertically */
  gap: 50px; 
}

.date-input {
  display: block; /* Each date input takes full width */
  margin-bottom: 15px;
}

.date-input label {
  display: block; 
  margin-bottom: 5px;
}

.date-input input {
  width: 100%; 
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.date-input input:hover {
  border-color: #E54F70;
}
.date-input input:focus {
  outline: none;
  border-color: #E54F70;
  box-shadow: 0 0 0 2px rgba(229, 79, 112, 0.1);
}

.clear-filter {
  background: white;
  border: 1px solid #E54F70;
  color: #E54F70;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  margin-left: auto;
}

.clear-filter:hover {
  background: #E54F70;
  color: white;
}
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
  
  /* Responsive Styles */
  @media (max-width: 768px) {
    .app-container {
      padding: 15px;
      margin-left: 0;
    }
  
    .details-container {
      padding: 20px;
    }
  
    .product-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  
    .product-image {
      width: 150px;
      height: 150px;
    }
  
    .stock-cards {
      grid-template-columns: 1fr;
    }
    .supplier-tag {
    font-size: 0.8rem;
    padding: 3px 10px;
  }
  
  .stock-card-header {
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
    .header-section h1 {
      font-size: 1.5rem;
    }
    date-inputs {
    flex-direction: column;
    gap: 10px;
  }

  .clear-filter {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }
  }
  @media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .stock-details-sidebar {
    position: relative;
    top: 0;
    height: 500px;
    margin-top: 20px;
  }
}
/* Add to your existing <style> section */
.transaction-type {
  font-weight: bold;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  display: inline-block;
}

.transaction-type.add {
  background-color: #28a745 !important; /* Green for added stock */
}

.transaction-type.added {
  background-color: #28a745 !important; /* Green for added stock */
}
.transaction-type.deduct {
  background-color: #dc3545 !important; /* Red for deducted stock */
}

.transaction-type.deducted {
  background-color: #dc3545 !important; /* Red for deducted stock */
}
.deducted-transactions {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.section-header {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-header i {
  color: #E54F70;
}


  </style>