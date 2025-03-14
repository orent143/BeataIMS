<template>
  <Header />
  <Sidebar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="sales-header">Order History</h1>
      <div class="header-actions">
        <div class="filter-container">
          <button class="filter-btn" @click="toggleFilterDropdown">
            <i class="fas fa-filter"></i>
          </button>
          <div v-if="showFilterDropdown" class="dropdown">
            <select v-model="selectedStatus" class="filter-select" @change="filterOrders">
              <option value="">All Orders</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.order_id">
              <td>#{{ order.order_id }}</td>
              <td>{{ order.customer_name }}</td>
              <td>{{ order.table_number }}</td>
              <td>
                <ul>
                  <li v-for="(item, index) in order.items" :key="index">
                    {{ item.quantity }}x {{ item.name }}
                  </li>
                </ul>
              </td>
              <td>₱{{ order.total_amount }}</td>
              <td>{{ formatTime(order.order_date) }}</td>
              <td>
                <span :class="'status status-' + order.order_status.toLowerCase().replace(/ /g, '-')">
                  {{ order.order_status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="totals-container">
        <div class="totals-item">
          <span>Total Orders:</span>
          <span>{{ filteredOrders.length }}</span>
        </div>
        <div class="totals-item">
          <span>Total Sales:</span>
          <span>₱{{ totalSales }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Sidebar from '@/components/sms/Sidebar.vue';
  import Header from '@/components/Header.vue';

  export default {
    components: {
      Sidebar,
      Header
    },
  data() {
    return {
      orders: [],
      selectedStatus: '',
      showFilterDropdown: false,
    };
  },
  computed: {
    filteredOrders() {
      if (!this.selectedStatus) return this.orders;
      return this.orders.filter(order => order.order_status === this.selectedStatus);
    },
    totalSales() {
      return this.filteredOrders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2);
    },
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/ordersummary/orders/history');
        this.orders = response.data;
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    formatTime(datetime) {
      return new Date(datetime).toLocaleString();
    },
    toggleFilterDropdown() {
      this.showFilterDropdown = !this.showFilterDropdown;
    },
    filterOrders() {
      // No need for extra logic; computed property handles filtering
    },
  },
  mounted() {
    this.fetchOrders();
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

.filter-btn {
  padding: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 19px;
  color: #333;
  transition: color 0.3s;
}

.filter-container {
  position: relative;
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

.totals-container {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding: 15px;
  background-color: #f4f4f4;
  border-bottom: 10px;
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
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 2px 0;
}
.selected {
  background-color: #e3f2fd;
}

tr {
  cursor: pointer;
}

input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.add-to-reports-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 35px;
  height: 35px;
  background-color: #4CAF50;
  color: #0000009d;
  border: none;
  border-radius: 50%;
  font-size: 19px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.add-to-reports-btn:hover {
  background-color: #218838;
}
</style>