<template>
  <!-- Import Header component -->
  <Header />

  <Sidebar />

    <div class="app-container">
      <div class="header-container">
        <h1 class="header">Dashboard</h1>
        <div class="header-actions">
          <div class="date-range">
            <input type="date" v-model="startDate" class="date-input" />
            <span>to</span>
            <input type="date" v-model="endDate" class="date-input" />
          </div>
          <button @click="generateReport" class="generate-btn">
            Generate Report
          </button>
        </div>
      </div>
  
        <div class="stats-grid">
          <div class="stat-card">
            <i class="pi pi-shopping-cart"></i>
            <div class="stat-info">
              <h3>Total Orders</h3>
              <p class="stat-value">{{ totalOrders }}</p>
            </div>
          </div>
  
          <div class="stat-card">
            <i class="pi pi-dollar"></i>
            <div class="stat-info">
              <h3>Total Revenue</h3>
              <p class="stat-value">₱{{ totalRevenue }}</p>
            </div>
          </div>
  
          <div class="stat-card">
            <i class="pi pi-star-fil"></i>
            <div class="stat-info">
              <h3>Top Selling Item</h3>
              <p class="stat-value">{{ topSellingItem }}</p>
            </div>
          </div>
  
          <div class="stat-card">
            <i class="pi pi-user profile-icon"></i>
            <div class="stat-info">
              <h3>Total Customers</h3>
              <p class="stat-value">{{ totalCustomers }}</p>
            </div>
          </div>
        </div>
  
        <div class="charts-container">
          <div class="chart-card">
            <h3>Daily Sales</h3>
            <div class="chart-placeholder">
              <!-- Add Chart.js implementation here -->
              <p class="placeholder-text">Sales Chart</p>
            </div>
          </div>
  
          <div class="chart-card">
            <h3>Popular Items</h3>
            <div class="chart-placeholder">
              <!-- Add Chart.js implementation here -->
              <p class="placeholder-text">Items Chart</p>
            </div>
          </div>
        </div>
  
        <div class="table-container">
          <h3>Recent Orders</h3>
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td>#{{ order.id }}</td>
                <td>{{ order.customerName }}</td>
                <td>{{ order.itemCount }} items</td>
                <td>₱{{ order.total }}</td>
                <td>{{ formatDate(order.date) }}</td>
                <td>
                  <span :class="['status-badge', order.status]">
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
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
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        totalOrders: 156,
        totalRevenue: '1,234.50',
        topSellingItem: 'Cappuccino',
        totalCustomers: 89,
        recentOrders: [
          {
            id: 1001,
            customerName: 'John Doe',
            itemCount: 3,
            total: '15.50',
            date: new Date(),
            status: 'completed'
          },
          {
            id: 1002,
            customerName: 'Jane Smith',
            itemCount: 2,
            total: '9.00',
            date: new Date(),
            status: 'pending'
          }
        ]
      }
    },
    methods: {
      generateReport() {
        // TODO: Implement report generation logic
        console.log('Generating report for:', this.startDate, 'to', this.endDate)
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString()
      }
    }
  }
  </script>
  
  <style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Allow the container to take remaining space */
  margin-left: 230px; /* Make space for sidebar, adjust as needed */
  height: 100%; /* Full height of the page */
}
  
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 18px;
  width: 95%;
}
  
  .header {
    color: #333;
    font-size: 30px;
    font-family: 'Arial', sans-serif;
    font-weight: 900;
  }
  
  .header-actions {
    display: flex;
    gap: 15px;
    align-items: center;
  }
  
  .date-range {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .date-input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .generate-btn {
    padding: 8px 16px;
    background-color: #FF32BA;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 24px;
    color: #E54F70;

  }
  
  
  .stat-info h3 {
    margin: 0;
    font-size: 14px;
    color: #666;
  }
  
  .stat-value {
    margin: 5px 0 0;
    font-size: 24px;
    font-weight: bold;
    color: #000;
  }
  
  .charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .chart-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .chart-card h3 {
    margin: 0 0 15px;
    color: #333;
  }
  
  .chart-placeholder {
    height: 300px;
    background: #f8f9fa;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .placeholder-text {
    color: #666;
    font-style: italic;
  }
  
  .table-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .orders-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }
  
  .orders-table th,
  .orders-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  .orders-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #333;
  }
  
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
  }
  
  .status-badge.completed {
    background-color: #32cd32;
    color: white;
  }
  
  .status-badge.pending {
    background-color: #ffd700;
    color: #000;
  }
  
  button:hover {
    opacity: 0.9;
  }
  
  </style>