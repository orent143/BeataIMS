<template>
  <!-- Import Header component -->
  <Header />

  <Sidebar />
    <div class="app-container">
      <div class="header-container">
        <h1 class="products-header">Reports</h1>
        <div class="header-actions">
         
        </div>
      </div>
      
        <div class="report-cards">
          <!-- Sales Reports Card -->
          <div class="report-card" @click="goToReport('sales')">
            <div class="report-card-header">
              <i class="fas fa-chart-line report-icon"></i>
              <h3>Sales Reports</h3>
            </div>
            <div class="report-card-body">
              <p>View all sales reports and analysis</p>
              <div class="report-stats">
                <span>Total Reports: {{ salesReports.length }}</span>
                <span>Total Amount: ₱{{ calculateTotalSales() }}</span>
              </div>
            </div>
          </div>
  
          <!-- Order History Reports Card -->
          <div class="report-card" @click="goToReport('orders')">
            <div class="report-card-header">
              <i class="fas fa-history report-icon"></i>
              <h3>Order History Reports</h3>
            </div>
            <div class="report-card-body">
              <p>View completed and cancelled orders</p>
              <div class="report-stats">
                <span>Total Orders: {{ orderReports.length }}</span>
                <span>Total Amount: ₱{{ calculateTotalOrders() }}</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  </template>
  
  <script>
  import Sidebar from '@/components/sms/Sidebar.vue';
  import Header from '@/components/Header.vue';

  export default {
    components: {
      Sidebar,
      Header
    },
    data() {
      return {
        searchTerm: '',
        salesReports: [], // Will store sales reports
        orderReports: [] // Will store order reports
      }
    },
    methods: {
  goToReport(type) {
    if (type === 'sales') {
      this.$router.push('/reportssms/sales');
    } else if (type === 'orders') {
      this.$router.push('/reportssms/history');
        }
      },
      calculateTotalSales() {
        return this.salesReports.reduce((sum, report) => sum + parseFloat(report.amount), 0).toFixed(2);
      },
      calculateTotalOrders() {
        return this.orderReports.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0).toFixed(2);
      }
    },
    created() {
      // Load reports from localStorage
      const savedSalesReports = localStorage.getItem('salesReports');
      const savedOrderReports = localStorage.getItem('orderReports');
      
      if (savedSalesReports) {
        this.salesReports = JSON.parse(savedSalesReports);
      }
      if (savedOrderReports) {
        this.orderReports = JSON.parse(savedOrderReports);
      }
    }
  }
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