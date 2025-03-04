<template>
  <Header />
  <SideBar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Summary Reports</h1>
      <div class="header-actions">
        <input 
          type="date" 
          v-model="selectedDate" 
          class="date-picker" 
          @change="fetchInventoryReport"
          :max="currentDate"
        />
        <button class="export-btn" @click="exportSummary">Export CSV</button>
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
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredInventory" :key="product.ProductID">
              <td>{{ product.ProductName }}</td>
              <td>{{ product.Quantity }}</td>
              <td>₱{{ parseFloat(product.UnitPrice).toFixed(2) }}</td>
              <td>
                <span :class="'status status-' + product.Status.toLowerCase().replace(' ', '-')">
                  {{ product.Status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Wrap totals in a separate div -->
      <div class="totals-container">
        <div class="totals-item">
          <span>Report Date: </span>
          <span>{{ formatDate(reportData.date) }}</span>
        </div>
        <div class="totals-item">
          <span>Total Items: </span>
          <span>{{ reportData.total_items }}</span>
        </div>
        <div class="totals-item">
          <span>Total Value: </span>
          <span>₱{{ parseFloat(reportData.total_value).toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import SideBar from "@/components/ims/SideBar.vue";
import Header from "@/components/Header.vue";
import axios from "axios";

export default {
  components: {
    SideBar,
    Header,
  },
  name: "SummaryReport",
  data() {
    return {
      reportData: {
        date: "",
        total_items: 0,
        total_value: 0,
      },
      inventoryProducts: [],
      selectedDate: new Date().toISOString().split("T")[0], // Default to today
      currentDate: new Date().toISOString().split("T")[0], // Used to limit max date
    };
  },
  computed: {
    filteredInventory() {
      return this.inventoryProducts;
    },
  },
  methods: {
    async fetchInventoryReport() {
      try {
        if (this.selectedDate > this.currentDate) {
          alert("Future dates are not allowed.");
          this.selectedDate = this.currentDate;
          return;
        }

        const response = await axios.get(`http://127.0.0.1:8000/api/reports/inventory_report?date=${this.selectedDate}`);
        
        this.reportData = {
          date: response.data.date,
          total_items: response.data.total_items,
          total_value: parseFloat(response.data.total_value),
        };
        this.inventoryProducts = response.data.items;
      } catch (error) {
        console.error("Error fetching inventory report:", error);
        alert("Error fetching inventory report. Please try again.");
      }
    },
    formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Ensures AM/PM format
  });
}
,
    exportSummary() {
      if (!this.inventoryProducts.length) return;

      const headers = ["Name", "Quantity", "Unit Price", "Status"];
      const data = this.inventoryProducts.map((product) => [
        product.ProductName,
        product.Quantity,
        parseFloat(product.UnitPrice).toFixed(2),
        product.Status,
      ]);

      const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inventory-summary-${this.selectedDate || "all"}.csv`;
      a.click();
    },
  },
  created() {
    this.fetchInventoryReport();
  },
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
  position: sticky;
  bottom: 0;
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
