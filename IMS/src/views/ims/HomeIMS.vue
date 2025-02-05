<template>
  <!-- Import Header component -->
  <Header />

  <SideBar />

  <div class="app-container">
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
        <!-- Summary Cards -->
        <div class="summary-cards">
          <div class="card total-sales">
    <div class="card-icon">
      <i class="pi pi-chart-line"></i>
    </div>
            <div class="card-content">
              <h3>Total Sales</h3>
              <p class="amount">₱{{ totalSales.toFixed(2) }}</p>
              <p class="subtitle">Today's Revenue</p>
            </div>
          </div>

          <div class="card total-products">
    <div class="card-icon">
      <i class="pi pi-box"></i>
    </div>
            <div class="card-content">
              <h3>Total Products</h3>
              <p class="amount">{{ totalProducts }}</p>
              <p class="subtitle">In Inventory</p>
            </div>
          </div>

          <div class="card low-stock">
    <div class="card-icon">
      <i class="pi pi-exclamation-triangle"></i>
    </div>
            <div class="card-content">
              <h3>Low Stock</h3>
              <p class="amount">{{ lowStockCount }}</p>
              <p class="subtitle">Items Need Restock</p>
            </div>
          </div>

          <div class="card top-selling">
    <div class="card-icon">
      <i class="pi pi-star-fill"></i>
    </div>
            <div class="card-content">
              <h3>Top Selling</h3>
              <p class="product-name">{{ topSellingProduct }}</p>
              <p class="subtitle">Most Popular Item</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
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
      </div>
  </div>
</template>

<script>
// Import Header and Sidebar components
import SideBar from '@/components/ims/SideBar.vue'; // Import Sidebar component
import Header from '@/components/Header.vue'; // Import Header component

export default {
  components: {
    SideBar,
    Header, // Register Header component
  },
  name: 'Home',
  data() {
    return {
      currentDate: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      totalSales: 25850.75,
      totalProducts: 156,
      lowStockCount: 8,
      topSellingProduct: 'Espresso',
      recentActivities: [
      {
          id: 1,
          icon: 'pi pi-shopping-cart',
          title: 'New sale recorded',
          time: '5 minutes ago',
          status: 'Completed'
        },
        {
          id: 2,
          icon: 'pi pi-box',
          title: 'Inventory updated',
          time: '15 minutes ago',
          status: 'Success'
        },
        {
          id: 3,
          icon: 'pi pi-exclamation-circle',
          title: 'Low stock alert',
          time: '1 hour ago',
          status: 'Warning'
        },
        {
          id: 4,
          icon: 'pi pi-truck',
          title: 'New supplier order',
          time: '2 hours ago',
          status: 'Pending'
        }
      ]
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

.products-header {
  color: #000000;
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

/* Summary Cards */
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
  background-color: #e3f2fd;
  color: #FF32BA;
}

.total-products .card-icon {
  background-color: #e8f5e9;
  color: #FF32BA;
}

.low-stock .card-icon {
  background-color: #fff3e0;
  color: #FF32BA;
}

.top-selling .card-icon {
  background-color: #f3e5f5;
  color: #FF32BA;
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

/* Recent Activity */
.recent-activity {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  color: #FF32BA;
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

.activity-status.completed {
  background-color: #e8f5e9;
  color: #43a047;
}

.activity-status.success {
  background-color: #e3f2fd;
  color: #1976d2;
}

.activity-status.warning {
  background-color: #fff3e0;
  color: #ef6c00;
}

.activity-status.pending {
  background-color: #f3e5f5;
  color: #8e24aa;
}
</style>
