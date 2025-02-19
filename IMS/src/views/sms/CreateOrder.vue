<template>
  <Header />
  <Sidebar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="header">Create Order</h1>
    </div>

    <div class="content-wrapper">
      <div class="main-content">
        <!-- Menu Items -->
        <OrderItemSelector 
  :items="order.items"
  :menuItems="menuItems"
  @update:items="updateOrderItems"
  @update:menuItems="menuItems = $event"
/>


      </div>

      <!-- Customer Details and Order Summary -->
      <div class="order-details-section">
        <div class="customer-details">
          <h2>Customer Details</h2>
          <div class="form-group">
            <label>Customer Name</label>
            <input v-model="order.customerName" type="text" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Table Number</label>
            <input v-model.number="order.tableNumber" type="number" required class="form-input" />
          </div>

          <!-- Payment Method Selection -->
          <div class="form-group">
            <label>Payment Method</label>
            <select v-model="order.paymentMethod" class="form-input">
              <option value="CASH">Cash</option>
              <option value="TALLY">Tally</option>
            </select>
          </div>
        </div>

        <!-- Order Summary -->
        <OrderSummary 
          :items="order.items"
          :paymentMethod="order.paymentMethod"
        />

        <div class="form-actions">
          <button type="button" @click="resetForm" class="reset-btn">Reset</button>
          <button type="submit" @click.prevent="submitOrder" class="submit-btn">Create Order</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import OrderItemSelector from '@/components/sms/OrderItemSelector.vue';
import OrderSummary from '@/components/sms/OrderSummary.vue';
import Sidebar from '@/components/sms/Sidebar.vue';
import Header from '@/components/Header.vue';

export default {
  name: 'CreateOrder',
  components: {
    OrderItemSelector,
    OrderSummary,
    Sidebar,
    Header
  },
  data() {
  return {
    order: {
      customerName: '',
      tableNumber: null,
      items: [],
      status: 'pending',
      paymentMethod: 'CASH'
    },
    menuItems: [], // 🔹 Add this to store menu items
    loading: false,
    errorMessage: ''
  };
},

  methods: {
    updateOrderItems(updatedItems) {
      console.log("Updating order items:", updatedItems);
      this.order.items = [...updatedItems]; // Ensure reactivity
    },

    async submitOrder() {
    if (!this.order.customerName || !this.order.tableNumber) {
      alert('Please enter customer details.');
      return;
    }

    if (this.order.items.length === 0) {
      alert('Please add items to the order.');
      return;
    }

    if (this.loading) {
      alert("Menu items are still loading. Please wait a moment and try again.");
      return;
    }

    if (!this.menuItems || this.menuItems.length === 0) {
      alert("Failed to load menu items. Please refresh and try again.");
      return;
    }

    const sanitizedItems = this.order.items
      .map(item => ({
        id: item.id ? Number(item.id) : null,
        quantity: Number(item.quantity) || 0
      }))
      .filter(item => typeof item.id === 'number' && item.id > 0 && item.quantity > 0);

    if (sanitizedItems.length === 0) {
      alert('Invalid items in the order.');
      return;
    }

    // 🛑 Check for stock availability before submitting
    for (const item of sanitizedItems) {
      const product = this.menuItems.find(menuItem => menuItem.id === item.id);
      if (product && item.quantity > product.stock) {
        alert(`"${product.name}" only has ${product.stock} left in stock. Please adjust the quantity.`);
        return;
      }
    }

    const totalAmount = sanitizedItems.reduce((sum, item) => {
      const product = this.menuItems.find(menuItem => menuItem.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    if (totalAmount <= 0) {
      alert('Total amount must be greater than zero.');
      return;
    }

    const orderPayload = {
      customer_name: this.order.customerName,
      table_number: Number(this.order.tableNumber),
      items: sanitizedItems,
      total_amount: parseFloat(totalAmount.toFixed(2))
    };

    console.log("Submitting Order:", JSON.stringify(orderPayload, null, 2));

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/createorder/create_order', orderPayload);
      console.log('Order Created:', response.data);
      alert('Order created successfully!');
      this.resetForm();
    } catch (error) {
      console.error('Error creating order:', error.response?.data?.detail || error.message);
      alert('Failed to create order.');
    }
  },

    resetForm() {
      this.order = {
        customerName: '',
        tableNumber: null,
        items: [],
        status: 'pending',
        paymentMethod: 'CASH'
      };
    }
  },
  watch: {
    order: {
      deep: true,
      handler(newOrder) {
        console.log("Order updated:", newOrder);
      }
    }
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
h1 {
    color: #333;
    font-size: 30px;
    font-family: 'Arial', sans-serif;
    font-weight: 900;
  }
  .content-wrapper {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 20px;
    
  }
  
  .main-content {
  background-color: transparent;
  flex-grow: 1; /* Allow the content to take the remaining space */
  transition: margin-left 0.3s ease; /* Smooth transition when sidebar toggles */
  height: calc(100vh - 60px); /* Account for header height */
  overflow-y: auto; /* Enable scrolling if content overflows */
}
  
  .order-details-section {
    border-radius: 8px;
    padding: 0px;
    top: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .customer-details {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    color: #333;
    margin-bottom: 10px;
    font-size: 1.5em;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  
  .form-input {
    width: 95%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  .form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 30px;
  }
  
  .submit-btn {
    background: #E54F70;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .reset-btn {
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    cursor: pointer;
  }
  
  button:hover {
    opacity: 0.9;
  }
  </style>