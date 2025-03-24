<template>
  <Header :isSidebarCollapsed="isSidebarCollapsed" @toggle-sidebar="handleSidebarToggle"/>
  <SideBar :isCollapsed="isSidebarCollapsed"/>
  <div class="app-container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <div class="header-container">
      <h1 class="sales-header">Sales Report</h1>
      <div class="header-actions">
        <div class="filter-container">
          <button class="filter-btn" @click="toggleFilterDropdown">
            <i class="fas fa-filter"></i>
          </button>
          <div v-if="showFilterDropdown" class="dropdown">
            <select v-model="selectedStatus" class="filter-select">
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
      <div class="sales-table-container" v-if="salesData.length">
        <table class="sales-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Items Sold</th>
              <th>Remitted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in salesData" :key="sale.name">
              <td>{{ sale.name }}</td>
              <td>{{ sale.quantity }}</td>
              <td>₱{{ sale.unit_price.toFixed(2) }}</td>
              <td>{{ sale.items_sold }}</td>
              <td>₱{{ sale.remitted.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="totals-container" v-if="salesData.length">
        <div class="totals-item">
          <span>Total Items Sold:</span>
          <span>{{ totalItemsSold }}</span>
        </div>
        <div class="totals-item">
          <span>Total Sales:</span>
          <span>₱{{ totalSales.toFixed(2) }}</span>
        </div>
      </div>

      <div v-else class="loading">
        <p>Loading sales data...</p>
      </div>
    </div>
    
  </div>
</template>

<script>
import SideBar from '@/components/ims/SideBar.vue';
import Header from '@/components/Header.vue';
import axios from 'axios';

export default {
  components: { SideBar, Header },
  data() {
    return {
      isSidebarCollapsed: false,
      salesData: [],
      showFilterDropdown: false,
      selectedStatus: '',
    };
  },
  computed: {
    totalItemsSold() {
      return this.salesData.reduce((sum, sale) => sum + sale.items_sold, 0);
    },
    totalSales() {
      return this.salesData.reduce((sum, sale) => sum + (sale.items_sold * sale.unit_price), 0);
    },
  },
  methods: {
    handleSidebarToggle(collapsed) {
      this.isSidebarCollapsed = collapsed;
    },
    async fetchSalesData() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/sales/sales');
        this.salesData = response.data;
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    },
    async updateSales(productId, quantitySold, remitted) {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/sales/update', {
      product_id: productId,
      quantity_sold: quantitySold,
      remitted: remitted
    });

    console.log(response.data.message);
  } catch (error) {
    console.error("Error updating sales:", error.response.data.detail);
  }
},
    toggleFilterDropdown() {
      this.showFilterDropdown = !this.showFilterDropdown;
    }
  },
  mounted() {
    this.fetchSalesData();
  }
};
</script>

<style scoped>
/* Add any relevant styles for your table and layout here */
.loading {
  text-align: center;
  margin-top: 20px;
}


.app-container {
  display: flex;
  flex-direction: column;
  margin-left: 230px;
  transition: all 0.3s ease;
}

.app-container.sidebar-collapsed {
  margin-left: 70px;
  padding-left: 20px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 18px;
  width: 95%;
}

.sales-header {
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


.sales-container {
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
  font-size: 16px;
  position: sticky;
  bottom: 0;
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
/* General Status Styles */
.status {
  padding: 4px 8px;
  border-radius: 15px;
  font-size: 12px;
  display: inline-block; /* Ensure it behaves like a block element */
}

/* Specific Status Styles */
.status-completed {
  background: #E8F5E9; /* Light green */
  color: #4CAF50; /* Dark green */
}

.status-pending {
  background: #FFF3E0; /* Light yellow */
  color: #FF9800; /* Dark yellow */
}

.status-cancelled {
  background: #F8D7DA; /* Light red */
  color: #721c24; /* Dark red */
}
</style>