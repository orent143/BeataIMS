<template>
    <Header />
    <SideBar />
    <div class="app-container">
      <div class="details-container">
        <div class="header-section">
          <button class="back-btn" @click="$router.go(-1)">
            <i class="pi pi-arrow-left"></i> Back
          </button>
          <h1>Product Details</h1>
        </div>
  
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="product-details">
          <div class="product-header">
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
              <span>{{ product.ProcessType }}</span>
            </div>
            <div class="detail-item">
              <label>Quantity</label>
              <span>{{ product.Quantity }}</span>
            </div>
            <div class="detail-item">
              <label>Unit Price</label>
              <span>₱{{ product.UnitPrice }}</span>
            </div>
            <div class="detail-item">
    <label>Current Supplier</label>
    <span class="supplier-name">{{ product.CurrentSupplier }}</span>
  </div>
            <div class="detail-item">
              <label>Status</label>
              <span :class="'status status-' + product.Status?.toLowerCase().replace(/ /g, '-')">
                {{ product.Status }}
              </span>
            </div>
          </div>
  
          <!-- Additional stock details -->
          <div v-if="product.stockDetails && product.stockDetails.StockDetails.length" class="stock-details">
  <h3 class="stock-details-header">Stock Details</h3>
  <div class="stock-cards">
    <div v-for="stock in product.stockDetails.StockDetails" 
         :key="stock.id" 
         class="stock-card">
         <div class="stock-card-header">
      <span class="supplier-tag">{{ stock.SupplierName }}</span>
      <span class="timestamp">{{ formatTimestamp(stock.created_at) }}</span>
    </div>
      <div class="stock-card-item">
        <span class="label">Batch Number</span>
        <span class="value">{{ stock.batch_number || "N/A" }}</span>
      </div>
      <div class="stock-card-item">
        <span class="label">Location</span>
        <span class="value">{{ stock.stock_location }}</span>
      </div>

      <div class="stock-card-item">
        <span class="label">Quantity</span>
        <span class="value quantity">{{ stock.quantity }}</span>
      </div>
      <div class="stock-card-item">
        <span class="label">Expiration Date</span>
        <span class="value" :class="{ 'expiring': isExpiringSoon(stock.expiration_date) }">
          {{ formatDate(stock.expiration_date) || "N/A" }}
        </span>
      </div>
      <div class="stock-card-footer">
      <div class="timestamp-info">
        <div>
          <span class="label">Created:</span>
          <span class="value">{{ formatDateTime(stock.created_at) }}</span>
        </div>
        <div>
          <span class="label">Updated:</span>
          <span class="value">{{ formatDateTime(stock.updated_at) }}</span>
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
  import TransactionLog from '@/components/ims/TransactionLog.vue';
  
  export default {
    components: {
      Header,
      SideBar,
      TransactionLog
    },
    data() {
      return {
        product: null,
        loading: true,
        error: null
      }
    },
    async created() {
      try {
        let productId = this.$route.params.id;
  
        // Remove leading zeros
        productId = parseInt(productId, 10).toString(); 
  
        console.log("Fetching product details for ID:", productId); // Debugging log
  
        const productResponse = await axios.get(`http://127.0.0.1:8000/api/stock/stockin/${productId}`);
        this.product = {
          ...productResponse.data,
          Status: this.getStatusByQuantity(productResponse.data.Quantity)
        };
  
        const stockResponse = await axios.get(`http://127.0.0.1:8000/api/stock/stockdetails/${productId}`);
        this.product.stockDetails = stockResponse.data;
  
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
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 10) return 'Low Stock';
    return 'In Stock';
  },

  formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  formatTimestamp(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return this.formatDate(dateString);
    }
  },
    isExpiringSoon(dateString) {
      if (!dateString) return false;
      const expirationDate = new Date(dateString);
      const today = new Date();
      const daysUntilExpiration = Math.floor((expirationDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
    }
  }
  }
  </script>
  
  <style scoped>
  .app-container {
    margin-left: 210px;
    background: #f8f9fa;
    min-height: 100vh;
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
    margin-bottom: 35px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 20px;
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
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
  
  .stock-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #eee;
}
.timestamp {
  font-size: 0.85rem;
  color: #666;
  background: #f8f9fa;
  padding: 4px 10px;
  border-radius: 12px;
}

.stock-card-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
.timestamp-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.9rem;
}

.timestamp-info .label {
  color: #666;
  font-weight: 500;
  margin-right: 8px;
}

.timestamp-info .value {
  color: #2c3e50;
  font-weight: 500;
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
  
  .stock-card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    transition: all 0.3s ease;
    border: 1px solid #eee;
    position: relative;
    padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  }
  
  .stock-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, #E54F70, #ff8fa3);
    border-radius: 12px 12px 0 0;
  }
  
  .stock-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
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
  }
  </style>