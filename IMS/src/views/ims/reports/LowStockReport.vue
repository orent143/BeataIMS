<template>
  <SideBar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Low Stock Report</h1>
      <div class="header-actions">
        <button class="export-btn" @click="exportToCSV">Export CSV</button>
        <div class="search-container">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search products"
            class="search-bar"
            @input="filterLowStockItems"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="inventory-container">
        <div class="table-container">
          <table class="stock-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Cost Price</th>
                <th>Supplier</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ingredient in filteredLowStockItems" :key="ingredient.id">
                <td>{{ ingredient.name }}</td>
                <td>{{ ingredient.quantity }}</td>
                <td>₱{{ ingredient.costPrice }}</td>
                <td>{{ ingredient.supplier }}</td>
                <td>{{ ingredient.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="totals-container">
          <div class="totals-item">
            <span>Low Stock Items:</span>
            <span>{{ totalLowStockItems }}</span>
          </div>
          <div class="totals-item">
            <span>Total Value:</span>
            <span>₱{{ totalValue }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/ims/SideBar.vue';

export default {
  components: {
    SideBar,
  },
  data() {
    return {
      lowStockItems: this.$route.state?.lowStockItems || [],
      searchTerm: '',
      filteredLowStockItems: [],
    };
  },
  computed: {
    totalLowStockItems() {
      return this.filteredLowStockItems.length;
    },
    totalValue() {
      return this.filteredLowStockItems.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
    },
  },
  methods: {
    filterLowStockItems() {
      if (this.searchTerm) {
        this.filteredLowStockItems = this.lowStockItems.filter(item =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
          item.status === 'Low Stock'
        );
      } else {
        this.filteredLowStockItems = this.lowStockItems.filter(item => item.status === 'Low Stock');
      }
    },

    exportToCSV() {
      const headers = ['Name', 'Quantity', 'Cost Price', 'Supplier', 'Status'];
      const data = this.filteredLowStockItems.map((ingredient) => [
        ingredient.name,
        ingredient.quantity,
        ingredient.costPrice,
        ingredient.supplier,
        ingredient.status,
      ]);

      const csvContent = [
        headers.join(','),
        ...data.map((row) => row.join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'low-stock-report.csv';
      a.click();
    },
  },
  created() {
    if (this.lowStockItems.length === 0) {
      const lowStockReports = JSON.parse(localStorage.getItem('lowStockReports')) || [];
      if (lowStockReports.length > 0) {
        // Assuming you're storing low stock items in a similar structure
        this.lowStockItems = lowStockReports[lowStockReports.length - 1].products; 
      } else {
        alert('No low stock reports available.');
      }
    }
    this.filterLowStockItems();
  },
};
</script>




<style scoped>
/* General Styling */
.app-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 250px;
  height: 100vh;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 18px;
  width: 95%;
}

.products-header {
  color: #000;
  font-size: 30px;
  font-family: 'Arial', sans-serif;
  font-weight: 900;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Filter Styles */
.filter-container {
  position: relative;
}

.filter-btn {
  background: none;
  border: none;
  font-size: 19px;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: 35px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  width: 200px;
}

.filter-select {
  width: 100%;
  padding: 8px;
}

/* Checkbox Styles */
.checkbox-container {
  display: flex;
  align-items: center;
}

.checkbox-container input {
  margin-right: 5px;
}

.checkbox-container label {
  font-size: 14px;
}

/* Table Styles */
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
  font-family: 'Arial', sans-serif;
  font-size: 15px;
}

.stock-table th {
  background-color: #f4f4f4;
  padding: 13px;
  font-weight: bold;
}

/* Main Content */
.main-content {
  flex-grow: 1;
  transition: margin-left 0.3s ease;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.inventory-container {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #dfdfdf;
  border-radius: 25px;
  margin-left: 5px;
  padding: 0;
}

/* Table Container takes available space */
.table-container {
  flex-grow: 1;
  overflow-y: auto;
  border-radius: 25px;
}

/* Totals Container Positioned at the Bottom */
.totals-container {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: #f4f4f4;
  border-bottom-right-radius: 25px;
  border-bottom-left-radius: 25px;
  margin-top: auto; /* Pushes it to the bottom */
}

.totals-item {
  width: 30%;
  font-weight: bold;
}

/* Button Styles */
.export-btn {
  background-color: #ff32ba;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Search Bar */
.search-container {
  position: relative;
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
  background-color: #d9d9d9;
}
</style>
