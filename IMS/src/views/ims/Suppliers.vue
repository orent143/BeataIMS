<template>
  <!-- Import Header component -->
  <Header />

  <SideBar />

  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Suppliers List </h1>
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
        <table class="supplier-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Contacts</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="supplier in filteredItems" :key="supplier.id">
              <td>{{ supplier.name }}</td>
              <td>{{ supplier.category }}</td>
              <td>${{ supplier.contacts }}</td>
              <td>{{ supplier.email }}</td>
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
      </div>

    <add-supplier 
      v-if="showAddForm" 
      :isVisible="showAddForm" 
      @close="toggleAddForm" 
      @add="addItem"
    />

    <edit-supplier
      v-if="showEditForm"
      :isVisible="showEditForm"
      :itemToEdit="selectedItem"
      @close="toggleEditForm"
      @update="updateItem"
    />
  </div>
</template>

<script>
import AddSupplier from '@/components/ims/AddSupplier.vue';
import EditSupplier from '@/components/ims/EditSupplier.vue';
import SideBar from '@/components/ims/SideBar.vue'; // Import Sidebar component
import Header from '@/components/Header.vue'; // Import Header component

export default {
  components: {
    AddSupplier,
    EditSupplier,
    SideBar,
    Header
  },
  data() {
    return {
      searchTerm: '',
      selectedStatus: '',
      showFilterDropdown: false,
      showAddForm: false,
      showEditForm: false,
      selectedItem: null,
      supplierItems: [
        { id: 1, name: 'Coffee Co.', category: 'Grocery', contacts: '0912345678', email: 'CoffeeCo.com', status: 'In Stock' },
        { id: 2, name: 'Dairy Corp.', category: 'Grocery', contacts: '0912345678', email: 'DairyCorp.com', status: 'Low Stock' },
        { id: 3, name: 'Bakery Inc.', category: 'Bakery', contacts: '0912345678', email: 'Bakery.com', status: 'Out of Stock' },
        { id: 4, name: 'Fruit Co.', category: 'Grocery', contacts: '0912345678', email: 'Fruit.com', status: 'In Stock' },
        { id: 5, name: 'Sugar Corp.', category: 'Grocery', contacts: '0912345678', email: 'Sugar.com', status: 'Low Stock' },
        { id: 6, name: 'Water Supply Co.', category: 'Grocery', contacts: '0912345678', email: 'Water.com', status: 'In Stock' },
        { id: 7, name: 'Deli Foods', category: 'Grocery', contacts: '0912345678', email: 'Deli.com', status: 'In Stock' },
        { id: 8, name: 'Green Farms', category: 'Grocery', contacts: '0912345678', email: 'Green.com', status: 'Out of Stock' }
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
    filterItems() {
      let filtered = this.supplierItems;

      if (this.searchTerm) {
        filtered = filtered.filter(supplier =>
          supplier.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      if (this.selectedStatus) {
        filtered = filtered.filter(supplier => supplier.status === this.selectedStatus);
      }

      this.filteredItems = filtered;
    },
    editItem(item) {
      this.selectedItem = item;
      this.showEditForm = true;
    },
    updateItem(updatedItem) {
      const index = this.supplierItems.findIndex(supplier => supplier.id === updatedItem.id);
      if (index !== -1) {
        this.supplierItems.splice(index, 1, updatedItem);
      }
      this.filterItems();
      this.toggleEditForm();
    },
    removeItem(itemId) {
      this.supplierItems = this.supplierItems.filter(item => item.id !== itemId);
      this.filterItems();
    },
    addItem(newItem) {
      newItem.id = this.supplierItems.length + 1;
      this.supplierItems.push(newItem);
      this.filterItems();
      this.toggleAddForm();
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

.supplier-table {
  width: 100%;
  border-collapse: collapse;
}

.supplier-table th,
.supplier-table td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.supplier-table tbody {
  font-family: 'Arial', sans-serif;
  font-size: 15px;
}

.supplier-table th {
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
</style>
