<template>
    <Sidebar />
    <div class="app-container">
        <div class="header-container">
  <h1 class="sales-header">Sales Report</h1>
  <div class="header-actions">
    <div class="search-container">
      <input type="text" v-model="searchTerm" placeholder="Search" class="search-bar" />
      <i class="fas fa-search search-icon"></i>
    </div>
    <div class="filter-container">
      <button class="filter-btn" @click="toggleFilterDropdown">
        <i class="fas fa-filter"></i>
      </button>
      <div v-if="showFilterDropdown" class="dropdown">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  </div>
</div>
      <div class="main-content">
        <div class="sales-container">
          <div class="sales-table-container">
            <table class="sales-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Items Sold</th>
                  <th>Remitted</th>
                  <th>Item Left</th>
                  <th>Status</th>
                  <th>Date Added</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in filteredReports" :key="report.id">
                  <td>{{ report.name }}</td>
                  <td>{{ report.quantity }}</td>
                  <td>₱{{ report.unitPrice.toFixed(2) }}</td>
                  <td>{{ report.itemsSold }}</td>
                  <td>₱{{ report.remitted.toFixed(2) }}</td>
                  <td>{{ report.itemLeft }}</td>
                  <td>
                    <span :class="['status-badge', report.status.toLowerCase()]">
                      {{ report.status }}
                    </span>
                  </td>
                  <td>{{ formatDateTime(report.dateAdded) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="totals-container">
            <div class="totals-item">
              <span>Total Items Sold:</span>
              <span>{{ totalItemsSold }}</span>
            </div>
            <div class="totals-item">
              <span>Total Sales:</span>
              <span>₱{{ totalSales.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from '@/components/sms/Sidebar.vue';
  
  export default {
    name: 'SalesReportSMS',
    components: {
      Sidebar
    },
    data() {
      return {
        searchTerm: '',
        selectedStatus: '',
        showFilterDropdown: false,
        reports: []
      }
    },
    computed: {
      filteredReports() {
        let filtered = this.reports;
        
        if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          filtered = filtered.filter(report => 
            report.name.toLowerCase().includes(term) ||
            report.status.toLowerCase().includes(term)
          );
        }
  
        if (this.selectedStatus) {
          filtered = filtered.filter(report => 
            report.status.toLowerCase() === this.selectedStatus.toLowerCase()
          );
        }
  
        return filtered;
      },
      totalItemsSold() {
        return this.filteredReports.reduce((sum, report) => sum + report.itemsSold, 0);
      },
      totalSales() {
        return this.filteredReports.reduce((sum, report) => sum + report.remitted, 0);
      }
    },
    methods: {
      formatDateTime(date) {
        if (!date) return '';
        const d = new Date(date);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
      },
      toggleFilterDropdown() {
        this.showFilterDropdown = !this.showFilterDropdown;
      }
    },
    created() {
      // Load reports from localStorage
      const savedReports = localStorage.getItem('salesReports');
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
  
  .sales-header {
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
    flex-grow: 1;
    transition: margin-left 0.3s ease;
    height: calc(100vh - 60px);
    overflow-y: auto;
  }
  
  .sales-container {
    flex-grow: 1;
    background-color: #dfdfdf;
    border-radius: 25px;
    overflow: hidden;
    margin-left: 5px;
    padding: 0;
    display: flex;
    flex-direction: column;
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
    padding: 15px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }
  
  .sales-table th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  
  .sales-table tbody tr:hover {
    background-color: #f5f5f5;
  }
  
  /* Status Badge */
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: 500;
  }
  
  .status-badge.completed {
    background-color: #32cd32;
    color: white;
  }
  
  .status-badge.pending {
    background-color: #ffa500;
    color: white;
  }
  
  .status-badge.cancelled {
    background-color: #ff4444;
    color: white;
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
  
  /* Filter Dropdown */
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
  </style>