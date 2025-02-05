<template>
  <!-- Import Header component -->
  <Header />

  <Sidebar />

  <div class="app-container">
    <div class="header-container">
      <h1 class="sales-header">Sales Report</h1>
      <div class="header-actions">

        <div class="filter-container">
          <button class="filter-btn" @click="toggleFilterDropdown">
            <i class="fas fa-filter"></i>
          </button>
          <div v-if="showFilterDropdown" class="dropdown">
            <select v-model="selectedStatus" class="filter-select" @change="filterItems">
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </div>

      <div class="sales-container">
        <div class="sales-table-container">
          <table class="sales-table">
            <thead>
              <tr>
                <th v-if="showCheckboxes">Select</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Items Sold</th>
                <th>Remitted</th>
                <th>Item Left</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in filteredItems" :key="sale.id" @click="toggleItemSelection(sale)" :class="{ selected: selectedItems.includes(sale) }">
                <td v-if="showCheckboxes">
                  <input type="checkbox" v-model="selectedItems" :value="sale" />
                </td>
                <td>{{ sale.name }}</td>
                <td>{{ sale.quantity }}</td>
                <td>₱{{ sale.unitPrice.toFixed(2) }}</td>
                <td>{{ sale.itemsSold }}</td>
                <td>₱{{ sale.remitted.toFixed(2) }}</td>
                <td>{{ sale.itemLeft }}</td>
                <td>{{ sale.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="totals-container">
          <div class="totals-item">
            <span>Total Items Sold:</span>
            <span>{{ totalItemsSold }}</span>
          </div>
          <div class="totals-item">
            <span>Total Sales:</span>
            <span>₱{{ totalSales.toFixed(2) }}</span>
          </div>
        </div>
      </div>

    <button class="add-to-reports-btn" @click="addToReports">+</button>
  </div>
</template>

<script>
import Sidebar from '@/components/sms/Sidebar.vue';
import Header from '@/components/Header.vue';

export default {
  components: {
    Sidebar,
    Header
  },
  data() {
    return {
      searchTerm: '',
      selectedStatus: '',
      showFilterDropdown: false,
      showCheckboxes: false, // New property to control checkbox visibility
      selectedItems: [], // Track selected items for reporting
      salesItems: [
        { id: 1, name: 'Lemonade', quantity: 100, unitPrice: 50, itemsSold: 20, remitted: 1000, itemLeft: 80, status: 'Completed' },
        { id: 2, name: 'Cappuccino', quantity: 150, unitPrice: 40, itemsSold: 50, remitted: 2000, itemLeft: 100, status: 'Pending' },
        { id: 3, name: 'Espresso', quantity: 200, unitPrice: 30, itemsSold: 100, remitted: 3000, itemLeft: 100, status: 'Completed' },
        { id: 4, name: 'Croissant', quantity: 250, unitPrice: 25, itemsSold: 150, remitted: 3750, itemLeft: 100, status: 'Cancelled' },
        { id: 5, name: 'Croissant', quantity: 250, unitPrice: 25, itemsSold: 150, remitted: 3750, itemLeft: 100, status: 'Cancelled' },
        { id: 1, name: 'Lemonade', quantity: 100, unitPrice: 50, itemsSold: 20, remitted: 1000, itemLeft: 80, status: 'Completed' },
        { id: 2, name: 'Cappuccino', quantity: 150, unitPrice: 40, itemsSold: 50, remitted: 2000, itemLeft: 100, status: 'Pending' },
        { id: 3, name: 'Espresso', quantity: 200, unitPrice: 30, itemsSold: 100, remitted: 3000, itemLeft: 100, status: 'Completed' },
        { id: 4, name: 'Croissant', quantity: 250, unitPrice: 25, itemsSold: 150, remitted: 3750, itemLeft: 100, status: 'Cancelled' },
        { id: 5, name: 'Croissant', quantity: 250, unitPrice: 25, itemsSold: 150, remitted: 3750, itemLeft: 100, status: 'Cancelled' },
        { id: 1, name: 'Lemonade', quantity: 100, unitPrice: 50, itemsSold: 20, remitted: 1000, itemLeft: 80, status: 'Completed' },
        { id: 2, name: 'Cappuccino', quantity: 150, unitPrice: 40, itemsSold: 50, remitted: 2000, itemLeft: 100, status: 'Pending' },
        { id: 3, name: 'Espresso', quantity: 200, unitPrice: 30, itemsSold: 100, remitted: 3000, itemLeft: 100, status: 'Completed' },
        { id: 4, name: 'Croissant', quantity: 250, unitPrice: 25, itemsSold: 150, remitted: 3750, itemLeft: 100, status: 'Cancelled' },
        { id: 5, name: 'Croissant', quantity: 250, unitPrice: 25, itemsSold: 150, remitted: 3750, itemLeft: 100, status: 'Cancelled' }
      ],
      filteredItems: []
    };
  },
  computed: {
    totalItemsSold() {
      return this.filteredItems.reduce((sum, sale) => sum + sale.itemsSold, 0);
    },
    totalSales() {
      return this.filteredItems.reduce((sum, sale) => sum + sale.remitted, 0);
    }
  },
  methods: {
    toggleFilterDropdown() {
      this.showFilterDropdown = !this.showFilterDropdown;
    },
    filterItems() {
      let filtered = this.salesItems;

      if (this.searchTerm) {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      }

      if (this.selectedStatus) {
        filtered = filtered.filter(item => item.status === this.selectedStatus);
      }

      this.filteredItems = filtered;
    },
    addToReports() {
    this.showCheckboxes = !this.showCheckboxes; // Toggle checkbox visibility
    
    if (this.selectedItems.length > 0) {
      // Get existing reports or initialize empty array
      const existingReports = JSON.parse(localStorage.getItem('salesReports') || '[]');
      
      // Add dateAdded to selected items
      const newReports = this.selectedItems.map(item => ({
        ...item,
        dateAdded: new Date().toISOString()
      }));

      // Combine existing and new reports
      const updatedReports = [...existingReports, ...newReports];
      
      // Save to localStorage
      localStorage.setItem('salesReports', JSON.stringify(updatedReports));
      
      // Clear selection
      this.selectedItems = [];
      this.showCheckboxes = false;
      
      alert('Selected items added to reports!');
    } else if (this.showCheckboxes) {
      // If just toggling checkboxes, don't show alert
      return;
    } else {
      alert('Please select items to add to reports.');
    }
  },

  toggleItemSelection(sale) {
    if (!this.showCheckboxes) return; // Only allow selection when checkboxes are shown
    
    const index = this.selectedItems.indexOf(sale);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(sale);
    }
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

.sales-header {
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


.sales-container {
  position: relative;
  flex-grow: 1;
  height: 100%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 25px;
  overflow-y: auto;
  margin-left: 5px;
  padding: 0;
}

.sales-table-container {
  overflow-y: auto;
  flex-grow: 1;
  max-height: calc(100vh - 150px);
}

.sales-table {
  width: 100%;
  border-collapse: collapse;
}

.sales-table th,
.sales-table td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.sales-table th {
  background-color: #f4f4f4;
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

.totals-container {
  display: flex;
  justify-content: space-between; /* Space between items */
  margin-top: auto;
  padding: 15px;
  background-color: #f4f4f4;
  border-bottom: 10px;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
}

.totals-item {
  display: flex;
  justify-content: flex-start; /* Align items to the left */
  align-items: center; /* Center vertically */
  width: 45%; /* Adjust width as needed */
  margin-right: 15px; /* Add margin between items */

}

.totals-item span {
  font-weight: bold;
  margin-right: 5px;
}

.add-to-reports-btn {
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
    align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  position: fixed; /* Fixed position */
  bottom: 20px; /* Distance from the bottom */
  right: 20px; /* Distance from the right */
  z-index: 10; 
}

.add-to-reports-btn:hover {
  background-color: #218838; /* Darker green on hover */
}
.selected {
  background-color: #e3f2fd;
}

tr {
  cursor: pointer;
}

input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
}
</style>