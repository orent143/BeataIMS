<template>
  <Header />
  <SideBar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Suppliers List</h1>
      <div class="header-actions">
        <button @click="toggleAddForm" class="add-product-btn">Add</button>
      </div>
    </div>

    <div class="inventory-container">
      <table class="supplier-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contacts</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
            <td>{{ supplier.suppliername }}</td>
            <td>{{ supplier.contactinfo }}</td>
            <td>{{ supplier.email }}</td>
            <td>
              <button class="action-btn edit" @click="editSupplier(supplier)">
                <i class="pi pi-pencil"></i>
              </button>
              <button class="action-btn delete" @click="removeSupplier(supplier.id)">
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
      @add="addSupplier"
    />

    <edit-supplier
      v-if="showEditForm"
      :isVisible="showEditForm"
      :supplierToEdit="selectedSupplier"
      @save="saveSupplier"
      @close="closeForm"
    />
  </div>
</template>

<script>
import axios from 'axios';
import AddSupplier from '@/components/ims/AddSupplier.vue';
import EditSupplier from '@/components/ims/EditSupplier.vue';
import SideBar from '@/components/ims/SideBar.vue'; 
import Header from '@/components/Header.vue'; 

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
      selectedSupplier: null,
      suppliers: [],  
      filteredSuppliers: []   
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

  async fetchSuppliers() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/suppliers/');  
      this.suppliers = response.data; 
      this.filterSuppliers();  
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  },

  filterSuppliers() {
    this.filteredSuppliers = this.suppliers.filter((supplier) => {
      const matchesSearchTerm = supplier.suppliername.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus ? supplier.status === this.selectedStatus : true;
      return matchesSearchTerm && matchesStatus;
    });
  },

  async addSupplier(newSupplier) {
    await this.fetchSuppliers(); 
    this.toggleAddForm();
  },

  editSupplier(supplier) {
    this.selectedSupplier = supplier;
    this.toggleEditForm();
  },

  saveSupplier(updatedSupplier) {
    const index = this.suppliers.findIndex(supplier => supplier.id === updatedSupplier.id);
    if (index !== -1) {
      this.suppliers[index] = updatedSupplier; 
      this.filterSuppliers(); 
    }
    this.toggleEditForm();
  },

  async removeSupplier(supplierId) {
  if (confirm("Are you sure you want to delete this supplier?")) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/suppliers/suppliers/${supplierId}`);
      this.fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  }
},
closeForm() {
      this.selectedSupplier = null; 
      this.toggleEditForm(); 
    }
  },


created() {
  this.fetchSuppliers();
},
  watch: {
    searchTerm: 'filterSuppliers',
    selectedStatus: 'filterSuppliers'
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
