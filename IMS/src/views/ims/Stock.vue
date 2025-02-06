<template>
  <!-- Import Header component -->
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
              <th>Name</th>
              <th>Quantity</th>
              <th>Cost Price</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ingredient in filteredItems" :key="ingredient.id">
              <td>{{ ingredient.name }}</td>
              <td>{{ ingredient.quantity }}</td>
              <td>₱{{ ingredient.costPrice }}</td>
              <td>{{ ingredient.supplier }}</td>
              <td>
  <span :class="'status status-' + ingredient.status.toLowerCase().replace(/ /g, '-')">
    {{ ingredient.status }}
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

        <div class="floating-btn-container">
          <button class="floating-btn" @click="togglePopoutOptions">+</button>
          <div v-if="showPopoutOptions" class="popout-options">
            <button class="popout-option" @click="addLowStock">Add Low Stock</button>
            <button class="popout-option" @click="filterLowStock">Low Stock</button>
          </div>
        </div>
      </div>

    <add-stock 
      v-if="showAddForm" 
      :isVisible="showAddForm" 
      @close="toggleAddForm" 
      @add="addItem"
    />

    <edit-stock
      v-if="showEditForm"
      :isVisible="showEditForm"
      :itemToEdit="selectedItem"
      @close="toggleEditForm"
      @update="updateItem"
    />
  </div>
</template>

<script>
import AddStock from '@/components/ims/AddStock.vue';
import EditStock from '@/components/ims/EditStock.vue';
import SideBar from '@/components/ims/SideBar.vue';
import Header from '@/components/Header.vue'; // Import Header component

export default {
  components: {
    SideBar,
    AddStock,
    EditStock,
    Header
  },
  data() {
    return {
      searchTerm: '',
      selectedStatus: '',
      showFilterDropdown: false,
      showAddForm: false,
      showEditForm: false,
      showPopoutOptions: false,
      selectedItem: null,
      lowStockFiltered: false,
      stockItems: [
        { id: 1, name: 'Coffee Beans', quantity: 50, costPrice: 5, status: 'In Stock', supplier: 'Coffee Co.' },
        { id: 2, name: 'Milk', quantity: 30, costPrice: 1.5, status: 'In Stock', supplier: 'Dairy Corp.' },
        { id: 3, name: 'Coffee Beans', quantity: 30, costPrice: 5, status: 'In Stock', supplier: 'Coffee Co.' },
        { id: 4, name: 'Milk', quantity: 20, costPrice: 1.5, status: 'In Stock', supplier: 'Dairy Corp.' },
        { id: 5, name: 'Foam Milk', quantity: 10, costPrice: 2, status: 'Low Stock', supplier: 'Dairy Corp.' },
        { id: 6, name: 'Flour', quantity: 40, costPrice: 1, status: 'In Stock', supplier: 'Bakery Inc.' },
        { id: 7, name: 'Butter', quantity: 15, costPrice: 4, status: 'Low Stock', supplier: 'Bakery Inc.' },
        { id: 8, name: 'Flour', quantity: 25, costPrice: 1, status: 'In Stock', supplier: 'Bakery Inc.' },
        { id: 9, name: 'Yeast', quantity: 5, costPrice: 2, status: 'In Stock', supplier: 'Bakery Inc.' },
        { id: 10, name: 'Lemon', quantity: 50, costPrice: 0.5, status: 'In Stock', supplier: 'Fruit Co.' },
        { id: 11, name: 'Sugar', quantity: 20, costPrice: 1, status: 'In Stock', supplier: 'Sugar Corp.' },
        { id: 12, name: 'Water', quantity: 100, costPrice: 0.1, status: 'In Stock', supplier: 'Water Supply Co.' },
        { id: 13, name: 'Cheese', quantity: 10, costPrice: 6, status: 'Out of Stock', supplier: 'Deli Foods' },
        { id: 14, name: 'Bread', quantity: 40, costPrice: 2, status: 'In Stock', supplier: 'Bakery Inc.' },
        { id: 15, name: 'Lettuce', quantity: 30, costPrice: 3, status: 'Low Stock', supplier: 'Green Farms' },
      ],
      filteredItems: [],
      inventorySummaries: [],
      currentDate: new Date().toISOString().split('T')[0],
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
      let filtered = this.stockItems;

      if (this.searchTerm) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      if (this.selectedStatus) {
        filtered = filtered.filter(item => item.status === this.selectedStatus);
      }

      this.filteredItems = filtered;
    },
    filterLowStock() {
      this.selectedStatus = 'Low Stock';
      this.lowStockFiltered = true;
      this.filterItems();
    },
    addLowStock() {
      if (this.lowStockFiltered && this.filteredItems.length > 0) {
        const lowStockItems = this.filteredItems;

        const lowStockSummary = {
          id: Date.now(),
          date: this.currentDate,
          products: lowStockItems,
          totalLowStock: lowStockItems.length,
          totalValue: lowStockItems.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0),
        };

        let lowStockReports = JSON.parse(localStorage.getItem('lowStockReports')) || [];

        lowStockReports.push(lowStockSummary);

        localStorage.setItem('lowStockReports', JSON.stringify(lowStockReports));

        alert(`Low stock report created! Total low stock items: ${lowStockItems.length}`);
      } else {
        alert('No low stock items to report.');
      }
    },
    editItem(item) {
      this.selectedItem = item;
      this.showEditForm = true;
    },
    updateItem(updatedItem) {
      const index = this.stockItems.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        this.stockItems.splice(index, 1, updatedItem);
      }
      this.filterItems();
      this.toggleEditForm();
    },
    removeItem(itemId) {
      this.stockItems = this.stockItems.filter(item => item.id !== itemId);
      this.filterItems();
    },
    addItem(newItem) {
      newItem.id = this.stockItems.length + 1;
      this.stockItems.push(newItem);
      this.filterItems();
      this.toggleAddForm();
    },
  },
  created() {
    const savedSummaries = localStorage.getItem('inventorySummaries');
    if (savedSummaries) {
      this.inventorySummaries = JSON.parse(savedSummaries);
    }
    this.filterItems();
  },
  watch: {
    searchTerm: 'filterItems',
    selectedStatus: 'filterItems',
  },
};
</script>

  
  <style scoped>
  /* Use same styles as Inventory page */
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
  
  /* Styling for the stock table */
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
  margin-right: 10px; /* Add space between checkbox and name */
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
/* Add a gap between the action buttons */
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
    display: flex;
    align-items: center;
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
    margin-right: 10px; /* Add space between checkbox and label */
  }

  .checkbox-label {
    font-size: 14px; /* Adjust font size */
    color: #333;
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