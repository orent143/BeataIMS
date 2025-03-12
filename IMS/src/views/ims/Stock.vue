<template>
  <Header />
  <SideBar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Stock List</h1>
      <div class="header-actions">
        <div class="filter-container">
          <button class="filter-btn" @click="toggleFilterDropdown">
            <i class="fas fa-filter"></i>
          </button>
          <div v-if="showFilterDropdown" class="dropdown">
            <select v-model="selectedStatus" class="filter-select" @change="filterItems">
              <option value="">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
        <button @click="toggleAddForm" class="add-product-btn">Add</button>
      </div>
    </div>

    <div class="inventory-container">
      <table class="stock-table">
        <thead>
          <tr>
            <th>Stock Name</th>
            <th>Quantity</th>
            <th>Cost Price</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in filteredItems" :key="stock.StockID">
            <td>{{ stock.StockName }}</td>
            <td>{{ stock.Quantity }}</td>
            <td>₱{{ stock.CostPrice }}</td>
            <td>{{ getSupplierName(stock.SupplierID) }}</td>
            <td>
              <span :class="'status status-' + getStatus(stock.Quantity).toLowerCase().replace(/ /g, '-')">
                {{ getStatus(stock.Quantity) }}
              </span>
            </td>
            <td>
              <button class="action-btn edit" @click="editItem(stock)">
                <i class="pi pi-pencil"></i>
              </button>
              <button class="action-btn delete" @click="confirmDelete(stock.StockID)">
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="floating-btn-container">
        <button class="floating-btn" @click="togglePopoutOptions">+</button>
        <div v-if="showPopoutOptions" class="popout-options">
          <button class="popout-option" @click="addLowStock">Add Low Stock</button>
          <button class="popout-option" @click="filterLowStock">Low Stock</button>
        </div>
      </div>
    </div>

    <div class="modal-overlay" v-if="showConfirmModal">
      <div class="confirmation-modal">
        <div class="modal-content">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete this product?</p>
          <div class="modal-actions">
            <button @click="confirmSubmit" class="confirm-btn">Yes</button>
            <button @click="cancelSubmit" class="cancel-btn">No</button>
          </div>
        </div>
      </div>
    </div>

    <add-stock 
      v-if="showAddForm" 
      :isVisible="showAddForm" 
      @close="toggleAddForm" 
      @update-parent="fetchStocks"
    />

    <edit-stock
      v-if="showEditForm"
      :isVisible="showEditForm"
      :itemToEdit="selectedItem"
      @close="toggleEditForm"
      @update-parent="fetchStocks"
    />
  </div>
</template>

<script>
import axios from 'axios';
import AddStock from '@/components/ims/AddStock.vue';
import EditStock from '@/components/ims/EditStock.vue';
import SideBar from '@/components/ims/SideBar.vue';
import Header from '@/components/Header.vue';
import { useToast } from 'vue-toastification';

export default {
  components: {
    AddStock,
    EditStock,
    SideBar,
    Header
  },
  data() {
    return {
      stocks: [],
      filteredItems: [],
      selectedStatus: '',
      showFilterDropdown: false,
      showAddForm: false,
      showEditForm: false,
      showConfirmModal: false,
      selectedItem: null,
      selectedStockID: null,
      showPopoutOptions: false,
      suppliers: [], // Add this to store suppliers
      toast: useToast(), 
    };
  },
  watch: {
    selectedStatus() {
      this.filterItems();
    },
    stocks() {
      this.filterItems();
    }
  },
  methods: {
    async fetchStocks() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/stock/');
        this.stocks = response.data;
        this.filteredItems = [...this.stocks]; 
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    },
    async fetchSuppliers() {
   try {
      const response = await axios.get('http://127.0.0.1:8000/api/suppliers/');
      this.suppliers = response.data;
      console.log("Suppliers fetched:", this.suppliers);
   } catch (error) {
      console.error('Error fetching suppliers:', error);
   }
},
    getSupplierName(supplierId) {
   const supplier = this.suppliers.find(sup => sup.id === supplierId);
   return supplier ? supplier.suppliername : 'Unknown'; 
},
    filterItems() {
      if (this.selectedStatus) {
        this.filteredItems = this.stocks.filter(stock => this.getStatus(stock.Quantity) === this.selectedStatus);
      } else {
        this.filteredItems = this.stocks;
      }
    },
    toggleFilterDropdown() {
      this.showFilterDropdown = !this.showFilterDropdown;
    },
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
    },
    toggleEditForm() {
      this.showEditForm = !this.showEditForm;
    },
    togglePopoutOptions() {
      this.showPopoutOptions = !this.showPopoutOptions;
    },
    async addItem(newItem) {
      const toast = useToast();
      try {
        await axios.post('http://127.0.0.1:8000/api/stock/stocks/', {
          StockName: newItem.StockName,
          Quantity: newItem.Quantity,
          CostPrice: newItem.CostPrice,
          SupplierID: newItem.SupplierID
        });

        await this.fetchStocks(); 
        this.showAddForm = false;
        toast.success('Stock added successfully!');
      } catch (error) {
        console.error('Error adding stock:', error);
        toast.error('Error adding stock.');
      }
    },
    async addLowStock() {
      const toast = useToast();
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/stock/stocks/low_stock');
        
        toast.success('Low stock items have been successfully added to the stock report!');
        
        await this.fetchStocks(); 
      } catch (error) {
        console.error('Error adding low stock:', error);
        toast.error('Error adding low stock items.');
      }
    },
    confirmDelete(stockID) {
      this.selectedStockID = stockID;
      this.showConfirmModal = true;
    },
    cancelSubmit() {
      this.showConfirmModal = false;
      this.selectedStockID = null;
    },
    confirmSubmit() {
      this.showConfirmModal = false;
      this.removeItem(this.selectedStockID);
    },
    async removeItem(stockID) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/stock/stocks/${stockID}`);
        this.fetchStocks(); 
        this.toast.success('Stock deleted successfully!');
      } catch (error) {
        console.error('Error deleting stock:', error);
        this.toast.error('Error deleting stock.');
      }
    },
    filterLowStock() {
      this.filteredItems = this.stocks.filter(stock => stock.Quantity <= 10);
    },
    getStatus(quantity) {
      if (quantity === 0) return "Out of Stock";
      if (quantity <= 10) return "Low Stock";
      return "In Stock";
    },
    editItem(stock) {
      this.selectedItem = stock;
      this.showEditForm = true;
    },
  },
  mounted() {
    this.fetchStocks();
    this.fetchSuppliers(); // Fetch suppliers on component creation

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
    border-bottom: 1px solid #ddd;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  .stock-table tbody{
    font-family: 'Arial', sans-serif;
  font-size: 15px;
  }

  .stock-table th {
    background-color: #f4f4f4;
    padding: 13px;
    color: #333;
    font-weight: bold;
  }
 
  .search-container {
  position: relative;
  margin-right: 3px;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #333;
  pointer-events: none;
}

.search-bar {
  padding: 8px 30px 8px 8px;
  border: 1px solid #94949400;
  border-radius: 10px;
  width: 130px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  background-color: #D9D9D9;
}

.filter-btn {
  padding: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 19px;
  color: #333;
  transition: color 0.3s;
}

.filter-container {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 35px;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 10;
  width: 8dvw;
}

.filter-select {
  padding: 8px;
  font-size: 14px;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 10px;
}
.name-with-checkbox {
  display: flex;
  align-items: center;
}

.name-with-checkbox input[type="checkbox"] {
  margin-right: 10px;
}
.add-product-btn {
  padding: 8px 12px;
  background-color: #E54F70;
  color: #dbdbdb;
  border: none;
  border-radius: 10px;
  width: 70px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.add-product-btn:hover {
  background-color: #ed9598;
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

  .popout-option input[type="checkbox"] {
    margin-right: 10px;
  }

  .checkbox-label {
    font-size: 14px;
    color: #333;
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
</style>