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
          />
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-container">
          <button class="filter-btn" @click="toggleFilterDropdown">
            <i class="fas fa-filter"></i>
          </button>
          <div v-if="showFilterDropdown" class="dropdown">
            <select v-model="selectedCategory" class="filter-select">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>
        <!-- Checkbox to Toggle Low Stock Report -->
        <div class="checkbox-container">
          <input type="checkbox" v-model="showLowStock" @change="toggleLowStock" />
          <label>Show Low Stock Only</label>
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
              <tr v-for="product in filteredProducts" :key="product.id">
                <td>{{ product.name }}</td>
                <td>{{ product.quantity }}</td>
                <td>₱{{ product.unitPrice }}</td>
                <td>{{ product.category }}</td>
                <td>{{ product.supplier }}</td>
                <td>{{ product.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totals Container Positioned at the Bottom -->
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
  components: { SideBar },
  name: 'LowStockReport',
  data() {
    return {
      searchTerm: '',
      lowStockThreshold: 10, // Configurable threshold
      products: [], // Store all products
      showFilterDropdown: false,
      selectedCategory: '',
      categories: ['All', 'Beverages', 'Bakery', 'Food'],
      showLowStock: false, // This will control whether to show low stock only
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.supplier.toLowerCase().includes(this.searchTerm.toLowerCase());

        const matchesCategory =
          !this.selectedCategory ||
          this.selectedCategory === 'All' ||
          product.category === this.selectedCategory;

        const matchesLowStock = !this.showLowStock || product.quantity <= this.lowStockThreshold;

        return matchesSearch && matchesCategory && matchesLowStock;
      });
    },
    totalLowStockItems() {
      return this.filteredProducts.length;
    },
    totalValue() {
      return this.filteredProducts
        .reduce((sum, product) => sum + product.quantity * product.unitPrice, 0)
        .toFixed(2);
    },
  },
  methods: {
    loadLowStockProducts() {
      const allProducts = [
        {
          id: 1,
          name: 'Espresso Beans',
          quantity: 5,
          unitPrice: 60,
          category: 'Beverages',
          supplier: 'Coffee Co.',
          status: 'Low Stock',
        },
        {
          id: 2,
          name: 'Cheese Sandwich',
          quantity: 3,
          unitPrice: 60,
          category: 'Food',
          supplier: 'Deli Foods',
          status: 'Low Stock',
        },
        {
          id: 3,
          name: 'Milk',
          quantity: 20,
          unitPrice: 50,
          category: 'Food',
          supplier: 'Dairy Corp.',
          status: 'In Stock',
        },
        {
          id: 4,
          name: 'Butter',
          quantity: 8,
          unitPrice: 100,
          category: 'Bakery',
          supplier: 'Bakery Co.',
          status: 'Low Stock',
        },
      ];
      this.products = allProducts; // Load all products initially
    },
    toggleFilterDropdown() {
      this.showFilterDropdown = !this.showFilterDropdown;
    },
    toggleLowStock() {
      this.showLowStock = !this.showLowStock; // Toggle low stock filter
    },
    exportToCSV() {
      const headers = ['Name', 'Quantity', 'Unit Price', 'Category', 'Supplier', 'Status'];
      const data = this.filteredProducts.map((product) => [
        product.name,
        product.quantity,
        product.unitPrice,
        product.category,
        product.supplier,
        product.status,
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
    this.loadLowStockProducts(); // Load the products when the component is created
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
