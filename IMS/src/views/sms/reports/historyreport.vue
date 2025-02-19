<template>
  <!-- Import Header component -->
  <Header />

  <Sidebar />
    <div class="app-container">
      <div class="header-container">
        <h1 class="sales-header">Order History Reports</h1>
        <div class="header-actions">
          
          <div class="filter-container">
            <button class="filter-btn" @click="toggleFilterDropdown">
              <i class="fas fa-filter"></i>
            </button>
            <div v-if="showFilterDropdown" class="dropdown">
              <select v-model="selectedStatus" class="filter-select" @change="filterReports">
                <option value="">All Orders</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div class="date-filter">
                <input 
                  type="date" 
                  v-model="dateFilter"
                  class="date-input"
                  @change="filterReports"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
        <div class="sales-container">
          <div class="sales-table-container">
            <table class="sales-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Date Added</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredReports" :key="order.id">
                  <td>#{{ order.id }}</td>
                  <td>{{ order.customerName }}</td>
                  <td>{{ order.tableNumber }}</td>
                  <td>
                    <ul>
                      <li v-for="(item, index) in order.items" :key="index">
                        {{ item.quantity }}x {{ item.name }}
                      </li>
                    </ul>
                  </td>
                  <td>₱{{ order.totalAmount }}</td>
                  <td>{{ formatTime(order.timestamp) }}</td>
                  <td>
                    <span :class="'status status-' + order.status.toLowerCase().replace(/ /g, '-')">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>{{ formatDate(order.dateAdded) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="totals-container">
            <div class="totals-item">
              <span>Total Orders:</span>
              <span>{{ filteredReports.length }}</span>
            </div>
            <div class="totals-item">
              <span>Total Amount:</span>
              <span>₱{{ totalAmount }}</span>
            </div>
          </div>
        </div>
    </div>
  </template>
  
  <script>
  import Sidebar from '@/components/sms/Sidebar.vue';
  import Header from '@/components/Header.vue';

  export default {
    name: 'HistoryReportSMS',
    components: { Sidebar, Header },
    data() {
      return {
        searchTerm: '',
        selectedStatus: '',
        dateFilter: '',
        showFilterDropdown: false,
        reports: []
      };
    },
    computed: {
      filteredReports() {
        return this.reports.filter(report => {
          const searchLower = this.searchTerm.toLowerCase();
          const matchesSearch = 
            report.id.toString().includes(searchLower) ||
            (report.customerName && report.customerName.toLowerCase().includes(searchLower));
          
          const matchesStatus = 
            !this.selectedStatus || 
            report.status.toLowerCase() === this.selectedStatus.toLowerCase();
          
          const matchesDate = 
            !this.dateFilter || 
            this.formatDate(report.dateAdded).includes(this.formatDate(this.dateFilter));
  
          return matchesSearch && matchesStatus && matchesDate;
        });
      },
      totalAmount() {
        return this.filteredReports
          .reduce((sum, report) => sum + parseFloat(report.totalAmount || 0), 0)
          .toFixed(2);
      }
    },
    methods: {
      formatDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
      },
      formatTime(timestamp) {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString();
      },
      toggleFilterDropdown() {
        this.showFilterDropdown = !this.showFilterDropdown;
      },
      filterReports() {
        // Method kept for input/change handlers
      }
    },
    created() {
      const savedReports = localStorage.getItem('orderReports');
      if (savedReports) {
        this.reports = JSON.parse(savedReports);
      }
    }
  };
  </script>
  


<style scoped>
/* General Layout */
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

/* Main Content */
.main-content {
  flex-grow: 1;
  transition: margin-left 0.3s ease;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.sales-container {
  position: relative;
  flex-grow: 1;
  height: auto;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  background-color: #ffffff;
  border-radius: 25px;
  overflow-y: auto;
  margin-left: 5px;
  padding: 0;
}

/* Table Styling */
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
  border-bottom: 1px solid #eee;
}

.sales-table tbody {
  font-family: 'Arial', sans-serif;
  font-size: 15px;
}

.sales-table th {
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

/* Status Badge */
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

/* Items List */
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 2px 0;
}

/* Totals Container */
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
  justify-content: flex-start;
  align-items: center;
  width: 45%;
  margin-right: 15px;
}

.totals-item span {
  font-weight: bold;
  margin-right: 5px;
}

/* Table Cell Specific */
.sales-table td:first-child {
  font-weight: bold;
}

/* Hover Effects */
.sales-table tbody tr:hover {
  background-color: #f5f5f5;
}
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
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.date-filter {
  margin-top: 10px;
}

.date-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

/* Add hover effect for filter button */
.filter-btn:hover {
  color: #4CAF50;
}
/* Responsive Table */
@media screen and (max-width: 1024px) {
  .sales-table {
    font-size: 14px;
  }
  
  .sales-table th,
  .sales-table td {
    padding: 8px;
  }
}
</style>