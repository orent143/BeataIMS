<template>
        <Sidebar />

  <div class="app-container">
    <div class="header-container">
      <h1 class="sales-header">Sales Report</h1>
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

    <div class="main-content">
      <div class="sales-container">
        <div class="sales-table-container">
          <table class="sales-table">
            <thead>
              <tr>
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
              <tr v-for="sale in filteredItems" :key="sale.id">
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
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/sms/Sidebar.vue';
export default {
  components: {
    Sidebar
    
  },
  data() {
    return {
      searchTerm: '',
      selectedStatus: '',
      showFilterDropdown: false,
      salesItems: [
        { id: 1, name: 'Lemonade', quantity: 100, unitPrice: 50, itemsSold: 20, remitted: 1000, itemLeft: 80, status: 'Completed' },
        { id: 2, name: 'Cappuccino', quantity: 150, unitPrice: 40, itemsSold: 50, remitted: 2000, itemLeft: 100, status: 'Pending' },
        { id: 3, name: 'Espresso', quantity: 200, unitPrice: 30, itemsSold: 100, remitted: 3000, itemLeft: 100, status: 'Completed' },
        { id: 4, name: 'Croissant', quantity: 250, unitPrice: 25, itemsSold: 150, remitted: 3750, itemLeft: 100, status: 'Cancelled' },
        { id: 1, name: 'Lemonade', quantity: 100, unitPrice: 50, itemsSold: 20, remitted: 1000, itemLeft: 80, status: 'Completed' },
        { id: 2, name: 'Cappuccino', quantity: 150, unitPrice: 40, itemsSold: 50, remitted: 2000, itemLeft: 100, status: 'Pending' },
        { id: 3, name: 'Espresso', quantity: 200, unitPrice: 30, itemsSold: 100, remitted: 3000, itemLeft: 100, status: 'Completed' },
        { id: 1, name: 'Lemonade', quantity: 100, unitPrice: 50, itemsSold: 20, remitted: 1000, itemLeft: 80, status: 'Completed' },
        { id: 2, name: 'Cappuccino', quantity: 150, unitPrice: 40, itemsSold: 50, remitted: 2000, itemLeft: 100, status: 'Pending' },
        { id: 3, name: 'Espresso', quantity: 200, unitPrice: 30, itemsSold: 100, remitted: 3000, itemLeft: 100, status: 'Completed' }
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
  margin-left: 250px; /* Make space for sidebar, adjust as needed */
  height: 100vh; /* Full height of the page */
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

.main-content {
  flex-grow: 1; /* Allow the content to take the remaining space */
  transition: margin-left 0.3s ease; /* Smooth transition when sidebar toggles */
  height: calc(100vh - 60px); /* Account for header height */
  overflow-y: auto; /* Enable scrolling if content overflows */
}

.sales-container {
  flex-grow: 1;
  background-color: #dfdfdf;
  border-radius: 25px;
  overflow: hidden;
  margin-left: 5px;
  padding: 0;
  display: flex;
  flex-direction: column;
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
  justify-content: space-between;
  margin-top: auto;
  padding: 15px;
  background-color: #f4f4f4;
  border-bottom: 10px;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
}

.totals-item {
  display: flex;
  justify-content: space-between;
  width: 45%;
}

.totals-item span {
  font-weight: bold;
}
</style>
