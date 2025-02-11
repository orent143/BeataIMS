<template>
  <!-- Import Header component -->
  <Header />

  <SideBar />

  <div class="app-container">
    <!-- Header Section -->
    <div class="header-container">
      <h1 class="products-header">Product List</h1>
      <div class="header-actions">

        <!-- Filter Dropdown -->
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

        <!-- Add Stock Button -->
        <button @click="toggleAddForm" class="add-product-btn">Add</button>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="inventory-container">
      <table class="stock-table">
        <thead>
          <tr>
            <th v-if="isLowStockMode">Select</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredItems" :key="product.id">
            <td v-if="isLowStockMode">
              <input
                type="checkbox"
                :value="product.id"
                v-model="selectedLowStockItems"
              />
            </td>
            <td>{{ product.ProductName }}</td>
            <td>{{ product.Quantity }}</td>
            <td>₱{{ product.UnitPrice }}</td>
            <td>{{ product.CategoryID }}</td>
            <td>{{ product.SupplierID }}</td>
            <td>
              <span :class="'status status-' + product.Status.toLowerCase().replace(/ /g, '-')">
                {{ product.Status }}
              </span>
            </td>
            <td>
              <button class="action-btn edit" @click="editItem(product)">
                <i class="pi pi-pencil"></i>
              </button>
<button class="action-btn delete" @click="removeItem(product.id)">
  <i class="pi pi-trash"></i>
</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Floating Button and Popout Options -->
      <div class="floating-btn-container">
        <button class="floating-btn" @click="togglePopoutOptions">+</button>
        <div v-if="showPopoutOptions" class="popout-options">
          <button class="popout-option" @click="addLowStock">Add Low Stock</button>
          <button class="popout-option" @click="addSummary">Add Summary</button>
        </div>
      </div>
    </div>

    <!-- Add or Edit Item Form -->
    <add-product
      v-if="showAddForm"
      :isVisible="showAddForm"
      @close="toggleAddForm"
      @add="addItem"
    />

    <!-- Edit Item Form -->
    <edit-product
      v-if="showEditForm"
      :isVisible="showEditForm"
      :itemToEdit="selectedItem"
      @close="toggleEditForm"
      @update="handleUpdateProduct"
    />
  </div>
</template>

<script>
import axios from 'axios';
import SideBar from '@/components/ims/SideBar.vue';
import AddProduct from '@/components/ims/AddProduct.vue';
import EditProduct from '@/components/ims/EditProduct.vue';
import Header from '@/components/Header.vue';

export default {
  components: { AddProduct, EditProduct, SideBar, Header },
  data() {
    return {
      searchTerm: '',
      selectedStatus: '',
      showFilterDropdown: false,
      showAddForm: false,
      showEditForm: false,
      showPopoutOptions: false,
      selectedItem: null,
      productItems: [],
      filteredItems: [],
      selectedLowStockItems: [],
      isLowStockMode: false,
      currentDate: new Date().toISOString().split('T')[0],
      inventorySummaries: [],
    };
  },

  methods: {
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
    filterItems() {
      let filtered = this.productItems;
      if (this.searchTerm) {
        filtered = filtered.filter(item =>
          item.ProductName.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
      if (this.selectedStatus) {
        filtered = filtered.filter(item => item.Status === this.selectedStatus);
      }
      this.filteredItems = filtered;
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

    addItem(newItem) {
  newItem.id = this.productItems.length + 1;
  newItem.Status = newItem.Status || "In Stock"; // Retain the chosen status
  this.productItems.push(newItem);
  this.filterItems();
  this.toggleAddForm();
  this.createInventorySummary();
  this.saveToLocalStorage();
},

    editItem(product) {
      this.selectedItem = { ...product }; // Clone object to avoid direct mutation
      this.showEditForm = true;
    },

    async handleUpdateProduct(updatedProduct) {
  const index = this.productItems.findIndex(item => item.id === updatedProduct.id);
  if (index !== -1) {
    this.productItems[index] = { ...updatedProduct, Status: this.getStatusByQuantity(updatedProduct.Quantity) };
    this.filterItems(); // Add this line to update the filtered list
    this.saveToLocalStorage(); // Save updated list to local storage
  }
  this.showEditForm = false;
  
  // Refresh the product items without refreshing the whole page
  this.fetchProductItems(); // Fetch updated data from the server
},

async removeItem(itemId) {
  try {
    // Make a DELETE request to the API
    const response = await axios.delete(`http://127.0.0.1:8000/api/inventory/inventoryproduct/${itemId}`);
    
    // Check if the response is successful
    if (response.status === 200) {
      // Remove the item from the product list
      this.productItems = this.productItems.filter(item => item.id !== itemId);
      
      // Update filtered list after removal
      this.filterItems();
      
      // Optionally update the inventory summary after removal
      this.createInventorySummary();
      
      // Save updated data to localStorage
      this.saveToLocalStorage();
      
      alert('Product deleted successfully');
    } else {
      alert('Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('An error occurred while deleting the product');
  }
},

    createInventorySummary() {
      const lowStockItems = this.productItems.filter(item => item.Status === 'Low Stock');
      const outOfStockItems = this.productItems.filter(item => item.Status === 'Out of Stock');

      const summary = {
        id: Date.now(),
        date: this.currentDate,
        products: [...this.productItems],
        totalItems: this.productItems.length,
        totalValue: this.productItems.reduce((sum, item) => sum + (item.Quantity * item.UnitPrice), 0),
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length
      };

      this.inventorySummaries.push(summary);
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem('inventorySummaries', JSON.stringify(this.inventorySummaries));
      localStorage.setItem('productItems', JSON.stringify(this.productItems)); // Save updated list
    },

    loadFromLocalStorage() {
      const savedSummaries = localStorage.getItem('inventorySummaries');
      const savedProducts = localStorage.getItem('productItems');

      if (savedSummaries) {
        this.inventorySummaries = JSON.parse(savedSummaries);
      }
      if (savedProducts) {
        this.productItems = JSON.parse(savedProducts);
        this.filterItems();
      }
    },

    addLowStock() {
      this.isLowStockMode = !this.isLowStockMode;
    },

    addSummary() {
      this.createInventorySummary();
      alert('Inventory summary has been created successfully!');
    },

    async fetchProductItems() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/inventory/');
        this.productItems = response.data;
        this.filterItems();
      } catch (error) {
        console.error('Error fetching product items:', error);
      }
    },

    refreshProductList() {
      this.fetchProductItems();
    }
  },

  created() {
    this.loadFromLocalStorage();
    if (this.inventorySummaries.length === 0) {
      this.createInventorySummary();
    }
    this.fetchProductItems();
  },

  watch: {
    searchTerm: 'filterItems',
    selectedStatus: 'filterItems',
    productItems: {
      deep: true,
      handler() {
        this.saveToLocalStorage();
      }
    }
  }
};
</script>

<style scoped>
/* General Styling */
.app-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Allow the container to take remaining space */
  margin-left: 230px; /* Make space for sidebar, adjust as needed */
  height: 100%; /* Full height of the page */
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 18px;
  width: 95%;
}

.products-header {
  color: #000000;
  font-size: 30px;
  font-family: 'Arial', sans-serif;
  font-weight: 900;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Main Content */


.inventory-container {
  position: relative;
  flex-grow: 1;
  height: 37dvw;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  background-color: #ffffff;
  border-radius: 25px;
  overflow-y: auto;
  margin-left: 5px;
  padding: 0;
}

/* Stock Table Styling */
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

.stock-table tbody {
  font-family: 'Arial', sans-serif;
  font-size: 15px;
}

.stock-table th {
  background-color: #f4f4f4;
  padding: 13px;
  font-weight: bold;
}
.stock-table input[type="checkbox"] {
  margin: 0;
  padding: 0;
  cursor: pointer;
}

/* Modify header for low stock mode */
/* Search Bar */
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

/* Filter Button */
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

/* Add Product Button */
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

/* Action Buttons */
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

.action-btn:active {
  background-color: #004080;
}

.floating-btn-container {
  position: fixed; /* Change from absolute to fixed */
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 10; /* Ensure it's above other content */
}

.floating-btn {
  width: 35px;
  height: 35px;
  background-color: #4CAF50;
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
  background-color: #FF32BA;
}

/* Popout Options */
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
/* General Status Styles */
.status {
  padding: 4px 8px;
  border-radius: 15px;
  font-size: 12px;
  display: inline-block; /* Ensure it behaves like a block element */
}

/* Specific Status Styles */
.status-in-stock {
  background: #E8F5E9; /* Light green */
  color: #4CAF50; /* Dark green */
}

.status-low-stock {
  background: #FFF3E0; /* Light yellow */
  color: #FF9800; /* Dark yellow */
}

.status-out-of-stock {
  background: #F8D7DA; /* Light red */
  color: #721c24; /* Dark red */
}
</style>