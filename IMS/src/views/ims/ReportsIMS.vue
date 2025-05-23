<template>
  <Header :isSidebarCollapsed="isSidebarCollapsed" @toggle-sidebar="handleSidebarToggle" />

  <SideBar :isCollapsed="isSidebarCollapsed" />
  <div class="app-container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <div class="header-container">
      <h1 class="products-header">Reports</h1>
    </div>

    <div class="report-cards">
      <div class="report-card" @click="goToReport('summary')">
        <div class="report-card-header">
          <i class="fas fa-chart-line report-icon"></i>
          <h3>Product Summary Report</h3>
        </div>
        <div class="report-card-body">
          <p>Overview of all inventory reports and metrics</p>
          <div class="report-stats">
            <span>Total Reports: {{ totalSummaryReports }}</span>
            <span>Total Amount: ₱{{ totalSummaryAmount }}</span>
          </div>
        </div>
      </div>

      <div class="report-card" @click="goToReport('lowStock')">
        <div class="report-card-header">
          <i class="fas fa-box report-icon"></i>
          <h3>Low Stock Report</h3>
        </div>
        <div class="report-card-body">
          <p>Displays items with low stock levels.</p>
          <div class="report-stats">
            <span>Total Reports: {{ totalLowStockReports }}</span>
            <span>Total Amount: ₱{{ totalLowStockAmount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SideBar from '@/components/ims/SideBar.vue';
import Header from '@/components/Header.vue';

export default {
  components: { SideBar, Header },
  data() {
    return {
      isSidebarCollapsed: false,
      totalSummaryReports: 0,
      totalSummaryAmount: 0,
      totalLowStockReports: 0,
      totalLowStockAmount: 0
    };
  },
  methods: {
    handleSidebarToggle(collapsed) {
      this.isSidebarCollapsed = collapsed;
    },
    async fetchReportData() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/reports/inventory_report');
        const report = response.data;

        this.totalSummaryReports = report.total_items;
        this.totalSummaryAmount = parseFloat(report.total_value).toFixed(2);

        const lowStockResponse = await axios.get('http://127.0.0.1:8000/api/reports/low_stock_report');
        const lowStockReport = lowStockResponse.data;
        this.totalLowStockReports = lowStockReport.items.length;
        this.totalLowStockAmount = lowStockReport.items
          .reduce((total, item) => total + parseFloat(item.CostPrice) * item.Quantity, 0)
          .toFixed(2);      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    },
    goToReport(reportType) {
      const reportRoutes = {
        summary: '/reportsims/summary',
        lowStock: '/reportsims/lowStock'
      };
      if (reportRoutes[reportType]) {
        this.$router.push(reportRoutes[reportType]);
      }
    }
  },
  created() {
    this.fetchReportData(); 
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  margin-left: 230px; /* Default margin when sidebar is expanded */
  transition: margin-left 0.3s ease; /* Smooth transition for sidebar toggle */
}

.app-container.sidebar-collapsed {
  margin-left: 70px; /* Adjust margin when sidebar is collapsed */
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
</style>