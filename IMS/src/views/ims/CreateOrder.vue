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
          @increaseQuantity="increaseItemQuantity"
          @decreaseQuantity="decreaseItemQuantity"
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
            <select v-model="order.paymentMethod" class="form-input">
              <option value="Cash">Cash</option>
              <option value="Tally">Tally</option>
            </select>
          </div>
        </div>

        <OrderSummary 
          :items="order.items"
          :paymentMethod="order.paymentMethod"
          :totalAmount="totalAmount"
          @update-items="updateOrderItems"
        />

        <div class="form-actions">
          <button type="button" @click="resetForm" class="reset-btn">Reset</button>
          <button 
            type="button" 
            @click="showConfirmationModal" 
            class="submit-btn" 
            :disabled="loading || !isValidOrder"
          >
            {{ loading ? 'Submitting...' : 'Create Order' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div class="modal-overlay" v-if="showConfirmModal">
      <div class="confirmation-modal">
        <div class="modal-content">
          <h3>Confirm Order Creation</h3>
          <p>Are you sure you want to create this order?</p>
          <div class="modal-actions">
            <button @click="confirmSubmit" class="confirm-btn">Yes</button>
            <button @click="cancelSubmit" class="cancel-btn">No</button>
          </div>
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
import { useToast } from 'vue-toastification';  // Import toast

export default {
  name: 'CreateOrder',
  components: {
    OrderItemSelector,
    OrderSummary,
    SideBar,
    Header
  },
  setup() {
    const toast = useToast();  // Initialize toast
    return { toast };
  },
  data() {
    return {
      isSidebarCollapsed: false,
      order: {
        customerName: '',
        items: [],
        paymentMethod: 'Cash'
      },
      menuItems: [],
      showConfirmModal: false,
      loading: false,
      errorMessage: '',
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
      return this.order.items.length > 0 && !!this.order.customerName;
    }
  },
  methods: {
    handleSidebarToggle(collapsed) {
      this.isSidebarCollapsed = collapsed;
    },

    updateOrderItems(updatedItems) {
      this.order.items = [...updatedItems];
    },

    increaseItemQuantity(item) {
      const updatedItem = this.order.items.find(i => i.id === item.id);
      if (updatedItem) {
        updatedItem.quantity += 1;
      }
      this.updateOrderItems(this.order.items);
    },

    decreaseItemQuantity(item) {
      const updatedItem = this.order.items.find(i => i.id === item.id);
      if (updatedItem && updatedItem.quantity > 1) {
        updatedItem.quantity -= 1;
      }
      this.updateOrderItems(this.order.items);
    },

    showConfirmationModal() {
      this.showConfirmModal = true;
    },

    async confirmSubmit() {
      if (!this.isValidOrder) {
        this.toast.error('Please fill all required fields correctly.');
        return;
      }

      this.loading = true;
      this.showConfirmModal = false;  // Hide modal when confirmed

      try {
        const formattedItems = this.order.items.map(item => ({
          id: Number(item.id),
          quantity: Number(item.quantity),
        }));

        const orderPayload = {
          customer_name: this.order.customerName,
          items: formattedItems,
          total_amount: this.totalAmount,
          payment_method: this.order.paymentMethod,
        };

        const response = await axios.post(
          'http://127.0.0.1:8000/api/orders/create_order',
          orderPayload
        );

        const successMessage = `Order created successfully! Order ID: ${response.data.history_id}`;
        this.toast.success(successMessage);  // ✅ Show success toast after submission

        this.resetForm();  // ✅ Reset the form after submission
      } catch (error) {
        const errorMessage = error.response?.data?.detail || 'Failed to create order. Please try again.';
        this.toast.error(errorMessage);  // ✅ Show error toast if submission fails
      } finally {
        this.loading = false;
      }
    },

    cancelSubmit() {
      this.showConfirmModal = false;
    },

    resetForm() {
      this.order = {
        customerName: '',
        items: [],
        paymentMethod: 'Cash'
      };
      this.toast.info('Form reset successfully');  // ✅ Toast after form reset
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.confirmation-modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}
.modal-content {
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 15px;
  color: #333;
}

.modal-content p {
  margin-bottom: 20px;
  color: #666;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.cancel-btn, .confirm-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.cancel-btn {
  background-color: #f3f3f3;
  color: #666;
}

.confirm-btn {
  background-color: #E54F70;
  color: white;
}

.cancel-btn:hover {
  background-color: #e7e7e7;
}

.confirm-btn:hover {
  background-color: #d84666;
}
</style>