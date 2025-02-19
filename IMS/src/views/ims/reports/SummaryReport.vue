<template>
  <!-- Import Header component -->
  <Header />

  <SideBar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Summary Reports</h1>
      <div class="header-actions">
        <button class="export-btn" @click="exportSummary">Export CSV</button>
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
                  <td>
                    <span :class="'status status-' + product.status.toLowerCase().replace(/ /g, '-')">
                      {{ product.status }}
                    </span>
                  </td>                
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
            <span>{{ formatDate(selectedDate) || 'All Dates' }}</span>
          </div>
          <div class="totals-item">
            <span>Total Items:</span>
            <span>{{ totalItems }}</span>
          </div>
          <div class="totals-item">
            <span>Total Value:</span>
            <span>₱{{ totalValue.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import SideBar from '@/components/ims/SideBar.vue'; // Import Sidebar component
import Header from '@/components/Header.vue'; // Import Header component

export default {
  components: {
    SideBar,
    Header
  },
  name: 'SummaryReport',
  data() {
    return {
      searchTerm: '',
      selectedDate: '', // Empty by default for 'All Dates'
      showFilterDropdown: false,
      summaries: [
        // Sample summaries data here
        // { id: 1, date: '2025-01-01', totalItems: 100, totalValue: 5000, products: [...] },
        // Add real data or make an API call to fetch it
      ]
    };
  },
  computed: {
    availableDates() {
      return [...new Set(this.summaries.map(summary => summary.date))].sort().reverse();
    },
    filteredSummaries() {
      return this.summaries.filter(summary => {
        const matchesDate = this.selectedDate ? summary.date === this.selectedDate : true;
        const matchesSearchTerm = this.searchTerm ? summary.products.some(product => 
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.supplier.toLowerCase().includes(this.searchTerm.toLowerCase())
        ) : true;
        return matchesDate && matchesSearchTerm;
      });
    },
    totalItems() {
      return this.filteredSummaries.reduce((sum, summary) => sum + summary.totalItems, 0);
    },
    totalValue() {
      return this.filteredSummaries.reduce((sum, summary) => sum + summary.totalValue, 0);
    }
  },
  methods: {
    toggleFilterDropdown() {
      this.showFilterDropdown = !this.showFilterDropdown;
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    exportSummary() {
      if (!this.filteredSummaries.length) return;
      
      const headers = ['Name', 'Quantity', 'Unit Price', 'Category', 'Supplier', 'Status'];
      const data = this.filteredSummaries.flatMap(summary => 
        summary.products.map(product => [
          product.name,
          product.quantity,
          product.unitPrice,
          product.category,
          product.supplier,
          product.status
        ])
      );
      
      const csvContent = [
        headers.join(','),
        ...data.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-summary-${this.selectedDate || 'all'}.csv`;
      a.click();
    }
  },
  created() {
    const savedSummaries = localStorage.getItem('inventorySummaries');
    if (savedSummaries) {
      this.summaries = JSON.parse(savedSummaries);
    }
  }
};
</script>

<style scoped>
/* General Styling */
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
  margin-top: auto; /* Pushes it to the bottom */
  border-bottom-right-radius: 25px;
  border-bottom-left-radius: 25px;

}

.totals-item {
  width: 30%;
  font-weight: bold;
}

/* Button Styles */
.export-btn {
  background-color: #E54F70;
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
  background-color: #D9D9D9;
}

.summary-spacer {
  height: 5px;
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
