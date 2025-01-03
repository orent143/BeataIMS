<template>
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Stock List </h1>
      <div class="header-actions">
        <div class="search-container">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search"
            class="search-bar"
            @input="filterItems"
          />
          <i class="fas fa-search search-icon"></i>
        </div>

        <!-- Filter Button with dropdown for status -->
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

    <div class="main-content">
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
    <td>₱{{ ingredient.costPrice }}</td> <!-- Changed $ to ₱ -->
    <td>{{ ingredient.supplier }}</td>
    <td>{{ ingredient.status }}</td>
    <td>
      <!-- Action buttons -->
      <button class="action-btn" @click="editItem(ingredient)">Edit</button>
      <button class="action-btn" @click="removeItem(ingredient.id)">Remove</button>
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
    </div>

    <!-- Add or Edit Item Form -->
    <add-stock 
      v-if="showAddForm" 
      :isVisible="showAddForm" 
      @close="toggleAddForm" 
      @add="addItem"
    />

    <!-- Edit Item Form -->
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
import AddStock from '@/components/AddStock.vue';
import EditStock from '@/components/EditStock.vue'; // Import the EditStock component

export default {
  components: {
    AddStock,
    EditStock
  },
  data() {
    return {
      searchTerm: '',
      selectedStatus: '',
      showFilterDropdown: false,
      showAddForm: false,
      showEditForm: false,
      showPopoutOptions: false, // Controls the visibility of popout options
      selectedItem: null, // Store the item to be edited
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
      filteredItems: []
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
    editItem(item) {
      this.selectedItem = item;
      this.showEditForm = true; // Show the Edit Form
    },
    updateItem(updatedItem) {
      const index = this.stockItems.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        this.stockItems.splice(index, 1, updatedItem); // Update the item
      }
      this.filterItems(); // Reapply filtering after update
      this.toggleEditForm(); // Close the form after updating
    },
    removeItem(itemId) {
      this.stockItems = this.stockItems.filter(item => item.id !== itemId);
      this.filterItems();
    },
    addItem(newItem) {
      newItem.id = this.stockItems.length + 1;
      this.stockItems.push(newItem);
      this.filterItems();
      this.toggleAddForm(); // Close the add form
    },
    addLowStock() {
      console.log("Add Low Stock clicked");
      // Handle adding low stock logic
    },
    addSummary() {
      console.log("Add Summary clicked");
      // Handle adding summary logic
    }
  },
  created() {
    this.filterItems();
  },
  watch: {
    searchTerm: 'filterItems',
    selectedStatus: 'filterItems'
  }
};
</script>
  
  
  <style scoped>
  /* Use same styles as Inventory page */
  .app-container {
  display: flex;
  flex-direction: column;
  width: 80vw;
  max-width: 80vw;
  margin-left: 40px;
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

.main-content {
    display: flex;
    padding: 4px;
  }
  
  .inventory-container {
  position: relative;
  flex-grow: 1;
  height: 40vw;
  background-color: #dfdfdf;
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

.add-product-btn {
  padding: 8px 12px;
  background-color: #01A501;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 10px;
  width: 70px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.add-product-btn:hover {
  background-color: #00b32dad;
}
/* Add a gap between the action buttons */
.action-btn {
  padding: 6px 9px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-family: 'Arial', sans-serif;
  font-weight: 500;
  transition: background-color 0.3s;
  margin-right: 10px;
}

.action-btn:hover {
  background-color: #0056b3;
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
  </style>
  