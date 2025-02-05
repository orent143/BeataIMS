<template>
  <!-- Import Header component -->
  <Header />

  <SideBar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Reports</h1>
      <div class="header-actions">
        <div class="search-container">
          <input type="text" v-model="searchTerm" placeholder="Search" class="search-bar" />
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>
    </div>
    
      <div class="report-cards">
        <!-- Summary Report Card -->
        <div class="report-card" @click="goToReport('summary')">
          <div class="report-card-header">
            <i class="fas fa-chart-line report-icon"></i>
            <h3>Summary Report</h3>
          </div>
          <div class="report-card-body">
            <p>Overview of all inventory reports and metrics</p>
            <div class="report-stats">
              <span>Total Reports: {{ summaryReports.length }}</span>
              <span>Total Amount: ₱{{ calculateTotalSummary() }}</span>
            </div>
          </div>
        </div>
  
        <!-- Low Stock Report Card -->
        <div class="report-card" @click="goToReport('lowStock')">
          <div class="report-card-header">
            <i class="fas fa-box report-icon"></i>
            <h3>Low Stock Report</h3>
          </div>
          <div class="report-card-body">
            <p>Displays items with low stock levels.</p>
            <div class="report-stats">
              <span>Total Reports: {{ lowStockReports.length }}</span>
              <span>Total Amount: ₱{{ calculateTotalLowStock() }}</span>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import SideBar from '@/components/ims/SideBar.vue';
import Header from '@/components/Header.vue'; // Import Header component

export default {
  components: { SideBar, Header },
  data() {
    return {
      searchTerm: '',
      summaryReports: [], // Will store summary reports
      lowStockReports: [] // Will store low stock reports
    };
  },
  methods: {
    goToReport(reportType) {
      this.$router.push(`/reportsims/${reportType}`);
    },
    calculateTotalSummary() {
      return this.summaryReports.reduce((sum, report) => sum + parseFloat(report.amount), 0).toFixed(2);
    },
    calculateTotalLowStock() {
      return this.lowStockReports.reduce((sum, report) => sum + parseFloat(report.value), 0).toFixed(2);
    }
  },
  created() {
    // Load reports from localStorage or API (example placeholder)
    const savedSummaryReports = localStorage.getItem('summaryReports');
    const savedLowStockReports = localStorage.getItem('lowStockReports');

    if (savedSummaryReports) {
      this.summaryReports = JSON.parse(savedSummaryReports);
    }
    if (savedLowStockReports) {
      this.lowStockReports = JSON.parse(savedLowStockReports);
    }
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 230px;
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

.main-content {
  flex-grow: 1;
  transition: margin-left 0.3s ease;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.report-cards {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 10px;
  margin-top: 40px;
  align-items: center;
  width: 100%;
}

.report-card {
  background-color: #D9D9D9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 70%;
  padding: 25px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.report-card:hover {
  background-color: #f0f0f0;
  transform: translateY(-5px);
}

.report-card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.report-icon {
  font-size: 24px;
  color: #333;
}

.report-card-header h3 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.report-card-body {
  color: #555;
}

.report-card-body p {
  margin-bottom: 15px;
}

.report-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ccc;
}

.report-stats span {
  font-weight: bold;
  color: #333;
}

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
