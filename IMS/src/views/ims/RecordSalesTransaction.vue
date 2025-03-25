<template>
  <Header :isSidebarCollapsed="isSidebarCollapsed" @toggle-sidebar="handleSidebarToggle" />
  <SideBar :isCollapsed="isSidebarCollapsed" />

  <div class="app-container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <div class="header-container">
      <h1 class="header">Record Sales Transaction</h1>
    </div>

    <div class="sales-container">
      <table class="sales-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total Items</th>
            <th>Cash on Hand</th>
            <th>Total Amount</th>
            <th>Change</th>
            <th>Payment Method</th>
            <th>Employee ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.order_id">
            <td>#{{ order.order_id }}</td>
            <td>{{ order.customer_name }}</td>
            <td>{{ order.total_items }}</td>
            <td>₱{{ order.cash_on_hand.toFixed(2) }}</td>
            <td>₱{{ order.total_amount.toFixed(2) }}</td>
            <td>₱{{ order.change.toFixed(2) }}</td>
            <td>{{ order.payment_method }}</td>
            
            <!-- Display N/A for Cash payments -->
            <td>{{ order.payment_method === 'Cash' ? 'N/A' : (order.employee_id ?? 'N/A') }}</td>

            <td>
              <button 
                class="record-btn" 
                @click="recordSale(order)"
                :disabled="order.recorded"
              >
                {{ order.recorded ? 'Recorded' : 'Record Sale' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import SideBar from '@/components/ims/SideBar.vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  name: 'RecordSalesTransaction',
  components: {
    Header,
    SideBar
  },
  data() {
    return {
      isSidebarCollapsed: false,
      orders: []  // Store orders from the API
    };
  },
  methods: {
    handleSidebarToggle(collapsed) {
      this.isSidebarCollapsed = collapsed;
    },

    // ✅ Fetch all orders from FastAPI
    async fetchOrders() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/ordersummary/orders');
        this.orders = response.data.map(order => ({
          ...order,
          recorded: false  // Track if the order has been recorded
        }));
      } catch (error) {
        console.error('Error fetching orders:', error);
        useToast().error('Failed to load orders');
      }
    },

    // ✅ Trigger POST request to record the sale
    async recordSale(order) {
      try {
        const payload = {};  // No longer need to ask for employee_id

        const response = await axios.post(
          `http://127.0.0.1:8000/api/ordersummary/orders/${order.order_id}/complete`,
          payload
        );

        useToast().success(`Order #${order.order_id} recorded successfully`);

        // Mark the order as recorded
        order.recorded = true;

      } catch (error) {
        console.error('Error recording sale:', error);
        
        if (error.response && error.response.data && error.response.data.detail) {
          useToast().error(`Failed to record order: ${error.response.data.detail}`);
        } else {
          useToast().error(`Failed to record order #${order.order_id}`);
        }
      }
    }
  },

  // ✅ Fetch orders on component mount
  async mounted() {
    await this.fetchOrders();
  }
};
</script>

  
  <style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  margin-left: 230px;
  height: 100%;

  transition: all 0.3s ease;
}

.app-container.sidebar-collapsed {
  margin-left: 70px;
  padding-left: 20px;
  
}
  
.sales-container {
  position: relative;
    flex-grow: 1;
    height: 37dvw;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    border-radius: 15px;
    overflow-y: auto;
    margin-left: 5px;
    padding: 0;
}

.sales-table {
  width: 100%;
  border-collapse: collapse;
}

/* Add sticky header */
.sales-table thead {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.sales-table th, td {
  padding: 10px;
    text-align: center;
    border-bottom: 1px solid #eee;
}
.sales-table tbody {
    font-size: 15px;
  }
  
  .sales-table th {
    background-color: #f4f4f4;
    padding: 13px;
    color: #333;
    font-weight: bold;
  }

.sales-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.sales-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.sales-container::-webkit-scrollbar-thumb {
  background: #E54F70;
  border-radius: 4px;
}

.sales-container::-webkit-scrollbar-thumb:hover {
  background: #d63d5e;
}
  .items-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .items-list li {
    font-size: 0.9em;
    color: #666;
  }
  
  .record-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    background-color: #E54F70;
    color: white;
  }

  .record-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(229, 79, 112, 0.2);
  }

  .record-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
  }

  .header {
    color: #333;
    font-size: 30px;
    font-family: 'Arial', sans-serif;
    font-weight: 900;
    margin: 0;
  }
  </style>