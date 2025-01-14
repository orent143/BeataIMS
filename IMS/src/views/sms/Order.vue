<template>
<Sidebar />
    <div class="app-container">
      <div class="header-container">
        <h1 class="header">Orders</h1>
        <div class="header-actions">
          <div class="search-container">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search orders..."
              class="search-bar"
            />
            <i class="fas fa-search search-icon"></i>
          </div>
          <div class="filter-container">
            <select v-model="statusFilter" class="filter-select">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
  
      <div class="main-content">
        <div class="orders-grid">
          <div v-for="order in filteredOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <span class="order-number">#{{ order.id }}</span>
              <span :class="['status-badge', order.status]">{{ order.status }}</span>
            </div>
            
            <div class="order-info">
              <p><strong>Customer:</strong> {{ order.customerName }}</p>
              <p><strong>Table:</strong> {{ order.tableNumber }}</p>
              <p><strong>Time:</strong> {{ formatTime(order.timestamp) }}</p>
            </div>
  
            <div class="order-items">
              <h4>Items:</h4>
              <ul>
                <li v-for="(item, index) in order.items" :key="index">
                  {{ item.quantity }}x {{ item.name }}
                </li>
              </ul>
            </div>
  
            <div class="order-footer">
              <p class="total-amount">Total: ₱{{ order.totalAmount }}</p>
              <div class="action-buttons">
                <button 
                  v-if="order.status === 'pending'" 
                  @click="updateStatus(order.id, 'preparing')"
                  class="prepare-btn"
                >
                  Prepare
                </button>
                <button 
                  v-if="order.status === 'preparing'" 
                  @click="updateStatus(order.id, 'completed')"
                  class="complete-btn"
                >
                  Complete
                </button>
                <button 
                  v-if="order.status === 'pending'" 
                  @click="updateStatus(order.id, 'cancelled')"
                  class="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import Sidebar from '@/components/sms/Sidebar.vue';

  export default {
    components: {
    Sidebar
  },
    data() {
      return {
        searchTerm: '',
        statusFilter: 'all',
        orders: [
          {
            id: 1001,
            customerName: 'John Doe',
            tableNumber: 5,
            timestamp: new Date(),
            status: 'pending',
            items: [
              { name: 'Cappuccino', quantity: 2 },
              { name: 'Croissant', quantity: 1 }
            ],
            totalAmount: '12.50'
          },
          {
            id: 1002,
            customerName: 'Jane Smith',
            tableNumber: 3,
            timestamp: new Date(),
            status: 'preparing',
            items: [
              { name: 'Latte', quantity: 1 },
              { name: 'Muffin', quantity: 2 }
            ],
            totalAmount: '9.00'
          },
          {
            id: 1003,
            customerName: 'John Soi',
            tableNumber: 6,
            timestamp: new Date(),
            status: 'pending',
            items: [
              { name: 'Cappuccino', quantity: 2 },
              { name: 'Croissant', quantity: 1 }
            ],
            totalAmount: '12.50'
          },
          {
            id: 1004,
            customerName: 'Patrick Smith',
            tableNumber: 1,
            timestamp: new Date(),
            status: 'preparing',
            items: [
              { name: 'Latte', quantity: 1 },
              { name: 'Muffin', quantity: 2 }
            ],
            totalAmount: '9.00'
          },
          {
            id: 1005,
            customerName: 'John Doe',
            tableNumber: 7,
            timestamp: new Date(),
            status: 'pending',
            items: [
              { name: 'Cappuccino', quantity: 2 },
              { name: 'Croissant', quantity: 1 }
            ],
            totalAmount: '12.50'
          },
          {
            id: 1006,
            customerName: 'Jane Smith',
            tableNumber: 8,
            timestamp: new Date(),
            status: 'preparing',
            items: [
              { name: 'Latte', quantity: 1 },
              { name: 'Muffin', quantity: 2 }
            ],
            totalAmount: '9.00'
          }
        ]
      }
    },
    computed: {
      filteredOrders() {
        return this.orders.filter(order => {
          const matchesSearch = order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                              order.id.toString().includes(this.searchTerm)
          const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter
          return matchesSearch && matchesStatus
        })
      }
    },
    methods: {
      formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString()
      },
      updateStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.id === orderId)
        if (order) {
          order.status = newStatus
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .app-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Allow the container to take remaining space */
  margin-left: 250px; /* Make space for sidebar, adjust as needed */
  height: 100vh; /* Full height of the page */
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