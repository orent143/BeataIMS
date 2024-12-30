<template>
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Sales Report</h1>
      <div class="header-actions">
        <div class="search-container">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search sales"
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
              <th>Product</th>
              <th>Quantity Sold</th>
              <th>Unit Price</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in filteredSales" :key="sale.id">
              <td>{{ sale.product }}</td>
              <td>{{ sale.quantity }}</td>
              <td>₱{{ sale.unitPrice }}</td>
              <td>₱{{ sale.totalAmount }}</td>
              <td>{{ sale.date }}</td>
              <td>{{ sale.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SalesReport',
  data() {
    return {
      searchTerm: '',
      sales: [
        // This will be populated from your actual data source
      ]
    };
  },
  computed: {
    filteredSales() {
      if (!this.searchTerm) return this.sales;
      const term = this.searchTerm.toLowerCase();
      return this.sales.filter(sale => 
        sale.product.toLowerCase().includes(term) ||
        sale.status.toLowerCase().includes(term)
      );
    }
  },
  created() {
    // Load sales data
    this.loadSalesData();
  },
  methods: {
    loadSalesData() {
      // This will be replaced with actual data loading logic
      this.sales = [
        { 
          id: 1, 
          product: "Espresso",
          quantity: 10,
          unitPrice: 60,
          totalAmount: 600,
          date: "2024-12-29",
          status: "Completed"
        },
        { 
          id: 2, 
          product: "Cappuccino",
          quantity: 5,
          unitPrice: 50,
          totalAmount: 250,
          date: "2024-12-29",
          status: "Completed"
        }
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