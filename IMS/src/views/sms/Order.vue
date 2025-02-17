<template>
  <Header />
  <Sidebar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="header">Orders</h1>
      <div class="header-actions">
        <div class="filter-container">
          <select v-model="statusFilter" class="filter-select">
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>

    <div class="orders-grid">
      <div v-for="order in filteredOrders" :key="order.order_id" class="order-card">
        <div class="order-header">
          <span class="order-number">#{{ order.order_id }}</span>
          <StatusBadge :status="order.order_status || 'Pending'" />
        </div>

        <div class="order-info">
          <p><strong>Customer:</strong> {{ order.customer_name }}</p>
          <p><strong>Table:</strong> {{ order.table_number }}</p>
          <p><strong>Time:</strong> {{ formatTime(order.order_date) }}</p>
        </div>

        <!-- ✅ Display Ordered Items -->
        <div class="order-items">
          <h4>Items:</h4>
          <ul>
            <li v-for="item in order.items" :key="item.product_id">
              {{ item.name }} (x{{ item.quantity }})
            </li>
          </ul>
        </div>

        <div class="order-footer">
          <p class="total-amount">Total: ₱{{ order.total_amount }}</p>
          <div class="action-buttons">
            <button 
              v-if="order.order_status === 'Pending'" 
              @click="updateOrderStatus(order.order_id, 'Preparing')"
              class="prepare-btn"
            >
              Prepare
            </button>
            <button 
              v-if="order.order_status === 'Preparing'" 
              @click="updateOrderStatus(order.order_id, 'Completed')"
              class="complete-btn"
            >
              Complete
            </button>
            <button 
              v-if="order.order_status === 'Pending'" 
              @click="updateOrderStatus(order.order_id, 'Cancelled')"
              class="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Sidebar from "@/components/sms/Sidebar.vue";
import Header from "@/components/Header.vue";
import StatusBadge from "@/components/sms/StatusBadge.vue";

export default {
  name: "Orders",
  components: {
    Sidebar,
    Header,
    StatusBadge
  },
  data() {
    return {
      orders: [],
      statusFilter: "all",
    };
  },
  computed: {
    filteredOrders() {
      if (this.statusFilter === "all") {
        return this.orders;
      }
      return this.orders.filter(order => order.order_status === this.statusFilter);
    }
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/ordersummary/orders");
        this.orders = response.data.map(order => ({
          ...order,
          order_status: order.order_status || "Pending", // ✅ Ensure status is always set
        }));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },
    async updateOrderStatus(order_id, newStatus) {
      try {
        await axios.put(
          `http://127.0.0.1:8000/api/ordersummary/orders/${order_id}/status`,
          { status: newStatus },
          { headers: { "Content-Type": "application/json" } }
        );

        this.fetchOrders(); // ✅ Refresh orders after updating status
      } catch (error) {
        console.error("Error updating order:", error.response?.data || error);
      }
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
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
    color: #000000;
    font-size: 30px;
    font-family: 'Arial', sans-serif;
    font-weight: 900;
  }
  
  .header-actions {
    display: flex;
    gap: 15px;
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
  
  .filter-select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
  }
  
  .orders-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
  }
  
  .order-card {
    background: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .order-number {
    font-weight: bold;
    font-size: 1.1em;
  }
  
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: 500;
  }
  
  .status-badge.pending {
    background-color: #ff4444;
    color: #ffffff;
  }
  
  .status-badge.preparing {
    background-color: #1e90ff;
    color: white;
  }
  
  .status-badge.completed {
    background-color: #32cd32;
    color: white;
  }
  
  .status-badge.cancelled {
    background-color: #ff4444;
    color: white;
  }
  
  .order-info {
    margin-bottom: 15px;
  }
  
  .order-info p {
    margin: 5px 0;
  }
  
  .order-items {
    margin-bottom: 15px;
  }
  
  .order-items ul {
    list-style: none;
    padding-left: 0;
  }
  
  .order-items li {
    margin: 5px 0;
  }
  
  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }
  
  .total-amount {
    font-weight: bold;
    font-size: 1.1em;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  
  .prepare-btn, .complete-btn, .cancel-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }
  
  .prepare-btn {
    background-color: #1e90ff;
    color: white;
  }
  
  .complete-btn {
    background-color: #32cd32;
    color: white;
  }
  
  .cancel-btn {
    background-color: #ff4444;
    color: white;
  }
  
  button:hover {
    opacity: 0.9;
  }
  </style>