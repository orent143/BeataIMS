<template>
  <Header :isSidebarCollapsed="isSidebarCollapsed" @toggle-sidebar="handleSidebarToggle" />

  <SideBar :isCollapsed="isSidebarCollapsed" />

  <div class="app-container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <div class="header-container">
      <h1 class="products-header">Dashboard</h1>
      <div class="header-actions">
        <div class="date-display">
          <i class="pi pi-calendar"></i>
          <span>{{ currentDate }}</span>
        </div>
      </div>
    </div>

    <div class="dashboard-container">
      <div class="summary-cards">
        <div class="card total-sales">
          <div class="card-icon">
            <i class="pi pi-chart-line"></i>
          </div>
          <div class="card-content">
            <h3>Total Revenue</h3>
            <p class="amount">₱{{ Math.round(animatedTotalRevenue.toFixed(2)) }}</p>
            <p class="subtitle">Overall Sales</p>
          </div>
        </div>

        <div class="card total-products">
          <div class="card-icon">
            <i class="pi pi-box"></i>
          </div>
          <div class="card-content">
            <h3>Total Products</h3>
            <p class="amount">{{ Math.round(animatedTotalProducts) }}</p>
            <p class="subtitle">In Inventory</p>
          </div>
        </div>

        <div class="card low-stock">
          <div class="card-icon">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <div class="card-content">
            <h3>Low Stock</h3>
            <p class="amount">{{ Math.round(animatedLowStockCount) }}</p>
            <p class="subtitle">Items Need Restock</p>
          </div>
        </div>

        <div class="card top-selling">
          <div class="card-icon">
            <i class="pi pi-shopping-cart"></i>
          </div>
          <div class="card-content">
            <h3>Total Orders</h3>
            <p class="product-name">{{ topSellingProduct }}</p>
            <p class="subtitle">Orders</p>
          </div>
        </div>
      </div>

    <div class="hero-container">
      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-details">
              <p class="activity-title">{{ activity.title }}</p>
              <p class="activity-time">{{ activity.time }}</p>
            </div>
            <div class="activity-status" :class="activity.status.toLowerCase()">
              {{ activity.status }}
            </div>
          </div>
        </div>
      </div>

      <div class="recent-activity">
  <h2>Recent Orders</h2>
  <div class="table-container">
    <table class="orders-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in recentOrders" :key="order.id">
          <td class="order-id">{{ order.id }}</td>
          <td>{{ order.customerName }}</td>
          <td>₱{{ order.total }}</td>
          <td>{{ formatDate(order.date) }}</td>
          <td>
            <span :class="['payment-badge', order.status.toLowerCase()]">
              {{ order.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</div>

    </div>
  </div>
</template>

<script>
import SideBar from '@/components/ims/SideBar.vue';
import Header from '@/components/Header.vue';
import axios from 'axios';

export default {
  components: {
    SideBar,
    Header,
  },
  name: 'Home',
  data() {
    return {
      isSidebarCollapsed: false,
      currentDate: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      totalProducts: 0,
      lowStockCount: 0,
      topSellingProduct: 'Espresso',
      recentActivities: [],
      totalRevenue: 0, // This will store the fetched total revenue
      animatedTotalRevenue: 0,
      animatedTotalProducts: 0,
      animatedLowStockCount: 0,
    };
  },
  methods: {
    handleSidebarToggle(collapsed) {
      this.isSidebarCollapsed = collapsed;
    },
    async fetchTotalRevenue() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/sales/total-sales-revenue");
        this.totalRevenue = parseFloat(response.data.total_sales_revenue); // Correct field from backend
        this.animatedTotalRevenue = this.totalRevenue; // Directly set the total revenue
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    },

  async fetchTotalProducts() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/inventory/total-products");
      this.totalProducts = response.data.total_products;
    } catch (error) {
      console.error("Error fetching total products:", error);
    }
  },
    async fetchTotalLowStocks() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/inventory/low-stock-total");
        this.lowStockCount = parseInt(response.data.total_low_stock);
      } catch (error) {
        console.error("Error fetching total stocks:", error);
      }
    },
    async fetchActivityLogs() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/activity_logs");
        this.recentActivities = response.data;
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      }
    },
        
    async fetchRecentOrders() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/ordersummary/orders/history");
      // Take only the 5 most recent orders
      this.recentOrders = response.data
        .sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate))
        .slice(0, 5)
        .map(order => ({
          id: order.history_id,
          customerName: order.customer_name,
          itemCount: order.total_items || 1,
          total: this.formatPrice(order.total_amount),
          date: new Date(order.created_at),
          status: order.payment_method
        }));
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  },

  formatPrice(value) {
      return Number(value).toFixed(2);
    },

  formatDate(date) {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
    animateValue(property, targetValue) {
      let start = this[property];
      let increment = (targetValue - start) / 50;
      let count = 0;

      const interval = setInterval(() => {
        this[property] += increment;
        count++;
        if (count >= 50) {
          this[property] = targetValue;
          clearInterval(interval);
        }
      }, 20);
    }
  },
  watch: {
    totalRevenue(newVal) {
      this.animateValue('animatedTotalRevenue', newVal); // Animate the total revenue
    },
    totalProducts(newVal) {
      this.animateValue('animatedTotalProducts', newVal);
    },
    lowStockCount(newVal) {
      this.animateValue('animatedLowStockCount', newVal);
    }
  },
  mounted() {
    this.fetchTotalRevenue(); // Fetch total revenue when the component is mounted
    this.fetchTotalProducts();
    this.fetchTotalLowStocks();
    this.fetchActivityLogs();
    this.fetchRecentOrders();
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1; 
  margin-left: 230px; 
  height: 100%; 
  transition: margin-left 0.3s ease;
}

.app-container.sidebar-collapsed {
  margin-left: 70px;
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

.date-display {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #666;
  font-weight: 500;
}


.dashboard-container {
  flex-grow: 1;
  background-color: #EFEFEF;
  border-radius: 25px;
  overflow-y: auto;
  margin-left: 5px;
  padding: 20px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.total-sales .card-icon {
  color: #E54F70;
}

.total-products .card-icon {
  color: #E54F70;
}

.low-stock .card-icon {
  color: #E54F70;
}

.top-selling .card-icon {
  color: #E54F70;
}

.card-content h3 {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.amount {
  margin: 5px 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.product-name {
  margin: 5px 0;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.subtitle {
  margin: 0;
  font-size: 12px;
  color: #888;
}
.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.table-container {
  flex: 1;
  overflow-y: auto;
  margin-top: 10px;
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
}
.orders-table th,
.orders-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.orders-table th {
  background: white;
  padding: 13px;
    color: #333;
    font-weight: bold;
}
.payment-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.payment-badge.cash {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.payment-badge.tally {
  background-color: #FFF3E0;
  color: #F57C00;
}
.order-id {
  font-family: monospace;
  font-size: 14px;
  color: #666;
  font-weight: 500;
  text-align: center;
  align-items: center;
  justify-content: center;
}
.orders-table tr:hover {
  background-color: #f8f9fa;
}
.recent-activity {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 25dvw; 
  display: flex;
  flex-direction: column;
}


.recent-activity h2 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  max-height: 100%; 
  padding-right: 10px; 
}
.activity-list::-webkit-scrollbar {
  width: 6px;
}

.activity-list::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.activity-list::-webkit-scrollbar-track {
  background: transparent;
}
.activity-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background: #f8f9fa;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #e3f2fd;
  color: #E54F70;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.activity-details {
  flex-grow: 1;
  margin-left: 15px;
}

.activity-title {
  margin: 0;
  font-weight: 500;
  color: #333;
}

.activity-time {
  margin: 0;
  font-size: 12px;
  color: #888;
}

.activity-status {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}

.activity-status.success {
  background-color: #E8F5E9;
  color: #43a047;
}

.activity-status.deleted {
  background: #F8D7DA;
  color: #721c24;
}

.activity-status.updated {
  background: #FFF3E0;
  color: #FF9800;
}
</style>