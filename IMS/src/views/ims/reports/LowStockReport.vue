<template>
  <Header />
  <SideBar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Low Stock Report</h1>
      <div class="header-actions">
        <input 
          type="date" 
          v-model="selectedDate" 
          class="date-picker" 
          @change="fetchLowStockReport"
          :max="currentDate"
        />
        <button class="export-btn" @click="exportLowStockReport">Export CSV</button>
      </div>
    </div>

    <div class="inventory-container">
      <div class="table-container">
        <table class="stock-table">
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Quantity</th>
              <th>Cost Price</th>
              <th>Supplier ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in lowStockItems" :key="item.ReportID">
              <td>
                <div class="stock-info">
                  <img 
                    :src="getImageUrl(item.Image)" 
                    :alt="item.StockName"
                    @error="handleImageError"
                    class="stock-image"
                  />
                  <span class="stock-name">{{ item.StockName }}</span>
                </div>
              </td>
              <td>{{ item.Quantity }}</td>
              <td>₱{{ parseFloat(item.CostPrice).toFixed(2) }}</td>
              <td>{{ item.SupplierID }}</td>
              <td>
                <span :class="'status status-' + getStatus(item.Quantity).toLowerCase().replace(' ', '-')">
                  {{ getStatus(item.Quantity) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
  name: "LowStockReport",
  data() {
    return {
      reportData: {
        date: "",
        total_items: 0,
        total_value: 0,
      },
      lowStockItems: [],
      selectedDate: new Date().toISOString().split("T")[0], 
      currentDate: new Date().toISOString().split("T")[0], 
      apiBaseUrl: "http://127.0.0.1:8000", // API Base URL
      fallbackImage: "/default-placeholder.png", // Default Image
    };
  },
  methods: {
    async fetchLowStockReport() {
      try {
        if (this.selectedDate > this.currentDate) {
          alert("Future dates are not allowed.");
          this.selectedDate = this.currentDate;
          return;
        }

        const response = await axios.get(`http://127.0.0.1:8000/api/reports/low_stock_report?date=${this.selectedDate}`, {
          params: { date: this.selectedDate }
        });

        this.reportData = {
          date: response.data.date || "N/A",
          total_items: response.data.total_items || 0,
          total_value: parseFloat(response.data.total_value) || 0,
        };

        this.lowStockItems = response.data.items.map(item => ({
          ...item,
          Image: item.Image ? `${this.apiBaseUrl}${item.Image}` : this.fallbackImage,
        }));
      } catch (error) {
        console.error("Error fetching low stock report:", error);
        alert("Error fetching low stock report. Please try again.");
      }
    },
    getImageUrl(imagePath) {
      return imagePath && imagePath.startsWith("http") ? imagePath : this.fallbackImage;
    },
    handleImageError(event) {
      event.target.src = this.fallbackImage;
    },
    getStatus(quantity) {
      return quantity <= 0 ? "Out of Stock" : "Low Stock";
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
        hour12: true,
      });
    },
    exportLowStockReport() {
      if (!this.lowStockItems.length) return;

      const headers = ["Stock Name", "Quantity", "Cost Price", "Supplier ID", "Status"];
      const data = this.lowStockItems.map((item) => [
        item.StockName,
        item.Quantity,
        parseFloat(item.CostPrice).toFixed(2),
        item.SupplierID,
        this.getStatus(item.Quantity),
      ]);

      const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `low-stock-report-${this.selectedDate || "all"}.csv`;
      a.click();
    },
  },
  created() {
    this.fetchLowStockReport();
  },
};
</script>

<style scoped>
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
  font-size: 15px;
}

.stock-table th {
  background-color: #f4f4f4;
  padding: 13px;
  color: #333;
  font-weight: bold;
}
.stock-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
.stock-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stock-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}
.inventory-container {
  position: relative;
  flex-grow: 1;
  height: 37dvw;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  background-color: #ffffff;
  border-radius: 15px;
  overflow-y: auto;
  margin-left: 5px;
  padding: 0;
}

.table-container {
  flex-grow: 1;
  overflow-y: auto;
  border-radius: 15px;
}

.totals-container {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: #f4f4f4;
  margin-top: auto; 
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
  position: sticky;
  bottom: 0;

}

.totals-item {
  width: 30%;
  font-weight: bold;
}

.export-btn {
  background-color: #E54F70;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

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
.status {
  padding: 4px 8px;
  border-radius: 15px;
  font-size: 12px;
  display: inline-block;
}

.status-in-stock {
  background: #E8F5E9; 
  color: #4CAF50; 
}

.status-low-stock {
  background: #FFF3E0; 
  color: #FF9800;
}

.status-out-of-stock {
  background: #F8D7DA; 
  color: #721c24; 
}
</style>
