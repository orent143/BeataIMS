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
              <th>Table</th>
              <th>Total Items</th>
              <th>Cash on Hand</th>
              <th>Total Amount</th>
              <th>Date & Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.order_id">
              <td>#{{ order.order_id }}</td>
              <td>{{ order.customer_name }}</td>
              <td>{{ order.table_number }}</td>
              <td>
                <ul class="items-list">
                  <li v-for="(item, idx) in order.items" :key="idx">
                    {{ item.quantity }}x {{ item.name }}
                  </li>
                </ul>
              </td>
              <td>₱{{ order.total_amount.toFixed(2) }}</td>
              <td>{{ order.date_time }}</td>
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
        orders: [
          {
            order_id: 1,
            customer_name: 'John Doe',
            table_number: 5,
            items: [
              { name: 'Burger', quantity: 2 },
              { name: 'Fries', quantity: 1 }
            ],
            total_amount: 250.0,
            date_time: '2025-03-22 12:30 PM',
            recorded: false
          },
          {
            order_id: 2,
            customer_name: 'Jane Smith',
            table_number: 3,
            items: [
              { name: 'Pizza', quantity: 1 },
              { name: 'Soda', quantity: 2 }
            ],
            total_amount: 400.0,
            date_time: '2025-03-22 01:15 PM'
          },
          {
            order_id: 3,
            customer_name: 'Alice Johnson',
            table_number: 8,
            items: [
              { name: 'Pasta', quantity: 1 },
              { name: 'Garlic Bread', quantity: 1 }
            ],
            total_amount: 300.0,
            date_time: '2025-03-22 02:00 PM'
          }
        ]
      };
    },
    methods: {
      handleSidebarToggle(collapsed) {
        this.isSidebarCollapsed = collapsed;
      },
      async recordSale(order) {
        try {
          // Here you would typically make an API call to record the sale
          // For demo purposes, we'll just mark it as recorded
          order.recorded = true;
          
          // Store the order in localStorage for order history
          const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
          orderHistory.push({
            ...order,
            recorded_date: new Date().toISOString()
          });
          localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
          
          // Show success message
          useToast().success('Sale recorded successfully!');
          
          // Optional: Remove the order from the list after a delay
          setTimeout(() => {
            this.orders = this.orders.filter(o => o.order_id !== order.order_id);
          }, 1000);
          
        } catch (error) {
          useToast().error('Failed to record sale');
          console.error('Error recording sale:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  margin-left: 230px;
  transition: all 0.3s ease;
}

.app-container.sidebar-collapsed {
  margin-left: 70px;
  padding-left: 20px;
}
  
  .sales-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .sales-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .sales-table th,
  .sales-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
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