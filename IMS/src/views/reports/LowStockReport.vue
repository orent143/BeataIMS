<template>
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Low Stock Report</h1>
      <div class="header-actions">
        <div class="search-container">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search products"
            class="search-bar"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="inventory-container">
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'LowStockReport',
  data() {
    return {
      searchTerm: '',
      products: [
        // This will be populated from your actual data source
      ]
    };
  },
  computed: {
    filteredProducts() {
      if (!this.searchTerm) return this.products;
      const term = this.searchTerm.toLowerCase();
      return this.products.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.supplier.toLowerCase().includes(term)
      );
    }
  },
  created() {
    // Load low stock products
    this.loadLowStockProducts();
  },
  methods: {
    loadLowStockProducts() {
      // This will be replaced with actual data loading logic
      this.products = [
        { id: 1, name: "Croissant", quantity: 5, unitPrice: 50, category: "Bakery", supplier: "Bakery Inc.", status: "Low Stock" },
        { id: 2, name: "Cheese Sandwich", quantity: 3, unitPrice: 60, category: "Food", supplier: "Deli Foods", status: "Low Stock" }
      ];
    }
  }
};
</script>

<style scoped>
/* General Styling */
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

/* Main Content */
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
</style>
