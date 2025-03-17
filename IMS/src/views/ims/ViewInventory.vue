<template>
  <Header />
  <SideBar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Inventory List</h1>
      <div class="header-actions">
        <div class="filter-container">
          <div class="filter-label">Filtered by</div>
          <button class="filter-btn" @click="toggleFilterDropdown">
            {{ selectedProcessType || 'Process Type' }}
          </button>
        </div>
        <button @click="toggleTransactionLog" class="transaction-log-btn">
          <i class="pi pi-history"></i>
          Transaction Log
        </button>
      </div>
    </div>

    <div class="inventory-container">
      <table class="stock-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Cost Price</th>
            <th>Status</th>
            <th class="details-header">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredItems" :key="product.id">
            <td class="product-id">{{ product.ProductID ? product.ProductID : 'N/A' }}</td>
            <td>
              <div class="product-info">
                <img :src="product.Image || 'https://via.placeholder.com/50'" alt="Product Image" class="product-image" />
                <span class="product-name">{{ product.ProductName }}</span>
              </div>
            </td>
            <td>{{ product.Quantity }}</td>
            <td>₱{{ product.UnitPrice }}</td>
            <td>
              <span :class="'status status-' + (product.Status ? product.Status.toLowerCase().replace(/ /g, '-') : 'unknown')">
                {{ product.Status || 'Unknown' }}
              </span>
            </td>
            <td>
              <div class="details-container">
                <span class="details-text">{{ product.Details }}</span>
                <button class="btn-details" @click="viewDetails(product)">
                  VIEW DETAILS
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="floating-btn-container">
      <button class="floating-btn" @click="togglePopoutOptions">+</button>
      <div v-if="showPopoutOptions" class="popout-options">
        <button class="popout-option" @click="addLowStock">Add Low Stock</button>
        <button class="popout-option" @click="postInventorySummary">Add Summary</button>
      </div>
    </div>

    <transaction-log 
      :isVisible="showTransactionLog"
      @close="toggleTransactionLog"
    />
  </div>
</template>

  <script>
  import axios from 'axios';
  import SideBar from '@/components/ims/SideBar.vue';
  import Header from '@/components/Header.vue';
  import TransactionLog from '@/components/ims/TransactionLog.vue';
  
  import { useToast } from 'vue-toastification';
  
  export default {
    components: {  SideBar, Header,     TransactionLog  },
    data() {
  return {
    searchTerm: '',
    showFilterDropdown: false,
    selectedProcessType: 'Ready-Made', // Default to Ready-Made
    showPopoutOptions: false,
    selectedItem: null,
    productItems: [],
    filteredItems: [],
    selectedLowStockItems: [],
    isLowStockMode: false,
    currentDate: new Date().toISOString().split('T')[0],
    inventorySummaries: [],
    selectedProductId: null,
    showTransactionLog: false,
    categories: [], 
    toast: useToast(), 
  };
},

  
    methods: {
      toggleFilterDropdown() {
        this.showFilterDropdown = !this.showFilterDropdown;
      },
      toggleTransactionLog() {
    this.showTransactionLog = !this.showTransactionLog;
  },
      viewDetails(product) {
  if (!product || !product.ProductID) {
    this.toast.error('Invalid product details');
    return;
  }
  this.$router.push({
    name: 'ViewDetailsVue',
    params: { id: product.ProductID }
  });
},

      togglePopoutOptions() {
        this.showPopoutOptions = !this.showPopoutOptions;
      },
      filterItems() {
  let filtered = this.productItems;

  if (this.searchTerm) {
    filtered = filtered.filter(item =>
      item.ProductName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Ensure filtering is applied only to "Ready-Made" products
  filtered = filtered.filter(item => item.ProcessType === "Ready-Made");

  this.filteredItems = filtered;
  this.showFilterDropdown = false;
},
      getStatusByQuantity(quantity) {
        if (quantity === 0) {
          return 'Out of Stock';
        } else if (quantity <= 10) {
          return 'Low Stock';
        } else {
          return 'In Stock';
        }
      },

  
      async fetchProductItems() {
  try {
    let url = 'http://127.0.0.1:8000/api/inventory/inventoryproducts/filter?process_type=Ready-Made';
    const response = await axios.get(url);
    
    this.productItems = response.data.map(item => {
      return {
        ...item,
        ProductID: item.id ? String(item.id).padStart(4, '0') : 'N/A',
        Status: this.getStatusByQuantity(item.Quantity)
      };
    });

    this.filterItems();
  } catch (error) {
    console.error('Error fetching product items:', error);
  }
},

      async postInventorySummary() {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/inventory/inventorysummary');
          
          let savedReports = JSON.parse(localStorage.getItem("inventorySummaries")) || [];
          savedReports.push(response.data);
  
          localStorage.setItem("inventorySummaries", JSON.stringify(savedReports));
  
          this.toast.success("Inventory summary posted successfully!");
        } catch (error) {
          console.error("Error posting inventory summary:", error);
          this.toast.error("Failed to post inventory summary.");
        }
      },
    },
  
    created() {
      const productId = this.$route.params.id;
      console.log("Product ID:", productId);
      this.fetchProductItems();
  
    },
  
    watch: {
      searchTerm: 'filterItems',
      selectedProcessType: 'filterItems',
  
      productItems: {
        deep: true,
        handler() {
          localStorage.setItem('productItems', JSON.stringify(this.productItems));
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .app-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-left: 230px;
    height: 100%;
  }
  
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 18px;
    width: 95%;
  }
  
  .products-header {
    color: #333;
    font-size: 30px;
    font-family: 'Arial', sans-serif;
    font-weight: 900;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .inventory-container {
    position: relative;
    flex-grow: 1;
    height: 37dvw;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    border-radius: 15px;
    overflow-y: auto;
    margin-left: 5px;
    padding: 0;
  }
  
  .stock-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .stock-table th,
  .stock-table td {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }
  
  .stock-table tbody {
    font-size: 15px;
  }
  
  .stock-table th {
    background-color: #f4f4f4;
    padding: 13px;
    color: #333;
    font-weight: bold;
  }
  
  .product-id {
  font-family: monospace;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}
  
  .product-name {
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }
  .product-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
  }
  
  .filter-btn {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
    background: white;
    min-width: 150px;
    justify-content: space-between;
  }

  .filter-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .filter-label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }



  
  .action-btn {
    padding: 8px;
    background-color: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    margin-right: 10px;
    width: 35px;
    height: 35px;
    align-items: center;
    justify-content: center;
  }
  
  .action-btn.edit {
    color: #1976d2;
  }
  
  .action-btn.delete {
    color: #dc3545;
  }
  
  .action-btn:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .action-btn:active {
    background-color: rgba(0, 0, 0, 0.2);
  }
  
  .floating-btn-container {
    position: fixed; 
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 10; 
  }
  
  .floating-btn {
    width: 35px;
    height: 35px;
    background-color: #E54F70;
    color: #0000009d;
    border: none;
    border-radius: 50%;
    font-size: 19px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .floating-btn:hover {
    background-color: #ed9598;
  }
  
  .popout-options {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: absolute;
    bottom: 0;
    right: 40px;
  }
  
  .popout-option {
    background-color: #FFFFFF;
    color: rgb(34, 34, 34);
    padding: 10px;
    margin: 5px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 10px;
    width: 100px;
  }
  
  .popout-option:hover {
    background-color: #FF32BA;
  }
  
  .popout-option:active {
    background-color: #004080;
  }
  
  .status {
    padding: 4px 8px;
    border-radius: 15px;
    font-size: 12px;
    display: inline-block;
  }
  
  .status-in-stock {
    background: #E8F5E9;
    color: #4CAF50;
  }
  
  .status-low-stock {
    background: #FFF3E0;
    color: #FF9800;
  }
  
  .status-out-of-stock {
    background: #F8D7DA;
    color: #721c24;
  }
  
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
  
  .confirmation-modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease-out;
  }
  
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .modal-content {
    text-align: center;
  }
  
  .modal-content h3 {
    margin-bottom: 15px;
    color: #333;
  }
  
  .modal-content p {
    margin-bottom: 20px;
    color: #666;
  }
  
  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  .cancel-btn, .confirm-btn {
    padding: 8px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
  }
  
  .cancel-btn {
    background-color: #f3f3f3;
    color: #666;
  }
  
  .confirm-btn {
    background-color: #E54F70;
    color: white;
  }
  
  .cancel-btn:hover {
    background-color: #e7e7e7;
  }
  
  .confirm-btn:hover {
    background-color: #d84666;
  }
  .stock-table td {
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }
  .transaction-log-btn {
    padding: 8px 16px;
    background-color: #fff;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
  }
  
  .transaction-log-btn:hover {
    border-color: #E54F70;
    color: #E54F70;
  }
  .details-header {
  text-align: center;
}
.details-container {
  align-items: center;
}
.details-text {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #666;
  font-size: 14px;
  max-width: 150px;
}
.btn-details {
  background-color: transparent;
  color: #4CAF50;
  border: 1.5px solid #4CAF50;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: auto;
}

.btn-details:hover {
  background-color: #4CAF50;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
  </style>