<template>
  <SideBar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Summary Reports</h1>
      <div class="header-actions">
        <div class="search-container">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search summaries"
            class="search-bar"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-container">
          <button class="filter-btn" @click="toggleFilterDropdown">
            <i class="fas fa-filter"></i>
          </button>
          <div v-if="showFilterDropdown" class="dropdown">
            <select v-model="selectedDate" class="filter-select">
              <option value="">All Dates</option>
              <option v-for="date in availableDates" :key="date" :value="date">
                {{ formatDate(date) }}
              </option>
            </select>
          </div>
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
                <th>Unit Price</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="summary in filteredSummaries" :key="summary.id">
                <tr v-for="product in summary.products" :key="product.id">
                  <td>{{ product.name }}</td>
                  <td>{{ product.quantity }}</td>
                  <td>₱{{ product.unitPrice }}</td>
                  <td>{{ product.category }}</td>
                  <td>{{ product.supplier }}</td>
                  <td>{{ product.status }}</td>
                </tr>
                <tr class="summary-spacer">
                  <td colspan="6"></td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="totals-container">
          <div class="totals-item">
            <span>Report Date:</span>
            <span>{{ formatDate(selectedDate) }}</span>
          </div>
          <div class="totals-item">
            <span>Total Items:</span>
            <span>{{ filteredSummaries.reduce((sum, summary) => sum + summary.totalItems, 0) }}</span>
          </div>
          <div class="totals-item">
            <span>Total Value:</span>
            <span>₱{{ filteredSummaries.reduce((sum, summary) => sum + summary.totalValue, 0).toFixed(2) }}</span>
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
    SideBar
  },
  name: 'SummaryReport',
  data() {
    return {
      searchTerm: '',
      selectedDate: new Date().toISOString().split('T')[0], // Current date by default
      showFilterDropdown: false,
      summaries: [
        {
          id: 1,
          date: '2024-12-29',
          totalItems: 165,
          totalValue: 9450,
          products: [
            { id: 1, name: "Espresso", quantity: 50, unitPrice: 60, category: "Beverages", supplier: "Coffee Co.", status: "In Stock" },
            { id: 2, name: "Cappuccino", quantity: 30, unitPrice: 50, category: "Beverages", supplier: "Coffee Co.", status: "In Stock" },
            { id: 3, name: "Croissant", quantity: 20, unitPrice: 50, category: "Bakery", supplier: "Bakery Inc.", status: "Low Stock" },
            { id: 4, name: "Bagel", quantity: 15, unitPrice: 20, category: "Bakery", supplier: "Bakery Inc.", status: "In Stock" },
            { id: 5, name: "Lemonade", quantity: 25, unitPrice: 75, category: "Beverages", supplier: "Beverage Co.", status: "In Stock" }
          ]
        },
        {
          id: 2,
          date: '2024-12-28',
          totalItems: 145,
          totalValue: 8750,
          products: [
            { id: 1, name: "Espresso", quantity: 45, unitPrice: 60, category: "Beverages", supplier: "Coffee Co.", status: "In Stock" },
            { id: 2, name: "Cappuccino", quantity: 25, unitPrice: 50, category: "Beverages", supplier: "Coffee Co.", status: "In Stock" },
            { id: 3, name: "Croissant", quantity: 15, unitPrice: 50, category: "Bakery", supplier: "Bakery Inc.", status: "Low Stock" },
            { id: 4, name: "Bagel", quantity: 35, unitPrice: 20, category: "Bakery", supplier: "Bakery Inc.", status: "In Stock" },
            { id: 5, name: "Lemonade", quantity: 25, unitPrice: 75, category: "Beverages", supplier: "Beverage Co.", status: "In Stock" }
          ]
        }
      ]
    };
  },
  computed: {
    availableDates() {
      return [...new Set(this.summaries.map(summary => summary.date))].sort().reverse();
    },
    filteredSummaries() {
      let filtered = this.summaries;
      
      // Filter by date if selected
      if (this.selectedDate) {
        filtered = filtered.filter(summary => summary.date === this.selectedDate);
      }

      // Filter by search term
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(summary => 
          summary.products.some(product => 
            product.name.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term) ||
            product.supplier.toLowerCase().includes(term)
          )
        );
      }

      return filtered;
    }
  },
  methods: {
    toggleFilterDropdown() {
      this.showFilterDropdown = !this.showFilterDropdown;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
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

/* Filter Styles */
.filter-container {
  position: relative;
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

.dropdown {
  position: absolute;
  top: 35px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 10;
  width: 200px;
}

.filter-select {
  padding: 8px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

/* Main Content */
.main-content {
  flex-grow: 1; /* Allow the content to take the remaining space */
  transition: margin-left 0.3s ease; /* Smooth transition when sidebar toggles */
  height: calc(100vh - 60px); /* Account for header height */
  overflow-y: auto; /* Enable scrolling if content overflows */
}

.inventory-container {
  position: relative;
  flex-grow: 1;
  background-color: #dfdfdf;
  border-radius: 25px;
  overflow: hidden;
  margin-left: 5px;
  padding: 0;
  display: flex;
  flex-direction: column;
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



/* Summary Specific Styling */
.summary-spacer {
  height: 0px;
}

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

.table-container {
  overflow-y: auto;
  flex-grow: 1;
  max-height: calc(100vh - 150px);
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
  width: 30%;
}

.totals-item span {
  font-weight: bold;
}
</style>
