<template>
  <Header :isSidebarCollapsed="isSidebarCollapsed" @toggle-sidebar="handleSidebarToggle" />

  <SideBar :isCollapsed="isSidebarCollapsed" />
  
  <div class="app-container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <div class="header-container">
      <h1 class="header">Create Order</h1>
    </div>

    <div class="content-wrapper">
      <div class="main-content">
        <OrderItemSelector 
          :items="order.items"
          :menuItems="menuItems"
          @update:items="updateOrderItems"
          @update:menuItems="menuItems = $event"
        />
      </div>

      <div class="order-details-section">
        <div class="customer-details">
          <h2>Customer Details</h2>
          <div class="form-group">
            <label>Customer Name</label>
            <input v-model="order.customerName" type="text" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Payment Method</label>
            <select v-model="order.paymentMethod" class="form-input" @change="handlePaymentMethodChange">
              <option value="Cash">Cash</option>
              <option value="Tally">Tally</option>
            </select>
          </div>

          <!-- Cash payment fields -->
          <div v-if="order.paymentMethod === 'Cash'" class="form-group">
            <label>Cash Amount</label>
            <input 
              v-model.number="order.cashOnHand" 
              type="number" 
              min="0" 
              step="0.01" 
              required 
              class="form-input" 
              @input="calculateChange"
            />
            <div v-if="order.change >= 0" class="change-amount">
              Change: ₱{{ order.change.toFixed(2) }}
            </div>
          </div>

          <!-- Tally payment fields -->
          <div v-if="order.paymentMethod === 'Tally'" class="form-group">
            <label>Employee ID</label>
            <input 
              v-model.number="order.employeeId" 
              type="number" 
              required 
              class="form-input"
            />
          </div>
        </div>

        <OrderSummary 
          :items="order.items"
          :paymentMethod="order.paymentMethod"
          :totalAmount="totalAmount"
          :cashOnHand="order.cashOnHand"
          :change="order.change"
        />

        <div class="form-actions">
          <button type="button" @click="resetForm" class="reset-btn">Reset</button>
          <button 
            type="submit" 
            @click.prevent="submitOrder" 
            class="submit-btn" 
            :disabled="loading || !isValidOrder"
          >
            {{ loading ? 'Submitting...' : 'Create Order' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import OrderItemSelector from '@/components/sms/OrderItemSelector.vue';
import OrderSummary from '@/components/sms/OrderSummary.vue';
import SideBar from '@/components/ims/SideBar.vue';
import Header from '@/components/Header.vue';

export default {
  name: 'CreateOrder',
  components: {
    OrderItemSelector,
    OrderSummary,
    SideBar,
    Header
  },
  data() {
    return {
      isSidebarCollapsed: false,
      order: {
        customerName: '',
        items: [],
        paymentMethod: 'Cash',
        cashOnHand: null,
        change: 0,
        employeeId: null
      },
      menuItems: [],
      loading: false,
      errorMessage: ''
    };
  },

  computed: {
    totalAmount() {
      return this.order.items.reduce((sum, item) => {
        const product = this.menuItems.find(menuItem => menuItem.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);
    },

    isValidOrder() {
      const hasValidItems = this.order.items.length > 0;
      const hasCustomerName = !!this.order.customerName;

      if (this.order.paymentMethod === 'Cash') {
        return (
          hasValidItems && 
          hasCustomerName && 
          this.order.cashOnHand !== null &&
          this.order.cashOnHand >= this.totalAmount
        );
      }

      if (this.order.paymentMethod === 'Tally') {
        return hasValidItems && hasCustomerName && !!this.order.employeeId;
      }

      return false;
    }
  },

  methods: {
    handleSidebarToggle(collapsed) {
      this.isSidebarCollapsed = collapsed;
    },

    handlePaymentMethodChange() {
      if (this.order.paymentMethod === 'Cash') {
        this.order.employeeId = null;
      } else {
        this.order.cashOnHand = null;
        this.order.change = 0;
      }
    },

    calculateChange() {
      if (this.order.paymentMethod === 'Cash' && this.order.cashOnHand !== null) {
        this.order.change = Math.max(0, this.order.cashOnHand - this.totalAmount);
      }
    },

    updateOrderItems(updatedItems) {
      this.order.items = [...updatedItems];
    },

    async submitOrder() {
      if (!this.isValidOrder) {
        alert('Please fill all required fields correctly.');
        return;
      }

      this.loading = true;

      try {
        const formattedItems = this.order.items.map(item => ({
          id: Number(item.id),
          quantity: Number(item.quantity)
        }));

        const orderPayload = {
          customer_name: this.order.customerName,
          items: formattedItems,
          total_amount: this.totalAmount,
          payment_method: this.order.paymentMethod,
          ...(this.order.paymentMethod === 'Cash' && { cash_on_hand: this.order.cashOnHand }),
          ...(this.order.paymentMethod === 'Tally' && { employee_id: this.order.employeeId })
        };

        console.log('Submitting order payload:', orderPayload);

        const response = await axios.post(
          'http://127.0.0.1:8000/api/orders/create_order',
          orderPayload
        );

        console.log('Order response:', response.data);

        this.resetForm();
        alert('Order created successfully!');
      } catch (error) {
        console.error('Error details:', error.response?.data);
        const errorMessage = error.response?.data?.detail 
          || 'Failed to create order. Please check all fields and try again.';

        alert(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.order = {
        customerName: '',
        items: [],
        paymentMethod: 'Cash',
        cashOnHand: null,
        change: 0,
        employeeId: null
      };
    }
  }
};
</script>




<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 230px; /* Default margin when sidebar is expanded */
  height: 100vh;
  transition: margin-left 0.3s ease; /* Smooth transition for sidebar toggle */
}

.app-container.sidebar-collapsed {
  margin-left: 70px; /* Adjust margin when sidebar is collapsed */
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 18px;
  width: calc(100% - 40px);
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.main-content {
  background-color: transparent;
  flex-grow: 1;
  overflow-y: auto;
}

.order-details-section {
  border-radius: 8px;
  padding: 0px;
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

h1 {
  color: #333;
  font-size: 30px;
  font-family: 'Arial', sans-serif;
  font-weight: 900;
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

.change-amount {
  margin-top: 8px;
  padding: 8px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
  font-weight: 600;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>