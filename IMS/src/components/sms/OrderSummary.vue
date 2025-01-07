<template>
    <div class="order-summary">
      <h2>Order Summary</h2>
      <div class="summary-content">
        <div class="summary-items">
          <h3>Selected Items</h3>
          <div v-if="hasItems">
            <ul>
              <li v-for="(item, index) in validItems" :key="index">
                {{ item.quantity }}x {{ item.name }}
                <span class="item-price">₱{{ getItemPrice(item) }}</span>
              </li>
            </ul>
          </div>
          <div v-else class="empty-message">
            No items selected
          </div>
        </div>
        
        <div class="summary-totals">
          <div class="total-line">
            <span>Total Items:</span>
            <span>{{ totalItems }}</span>
          </div>
          <div class="total-line">
            <span>Total Amount:</span>
            <span>₱{{ totalAmount }}</span>
          </div>
        </div>
  
        <!-- Payment Method Section -->
        <div class="payment-method">
          <span><strong>Payment Method:</strong> {{ paymentMethod }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'OrderSummary',
    props: {
      items: {
        type: Array,
        required: true,
        default: () => []
      },
      menuItems: {
        type: Array,
        required: true,
        default: () => []
      },
      paymentMethod: {
        type: String,
        required: true,
      }
    },
    computed: {
      validItems() {
        return this.items.filter(item => item && item.name && item.quantity > 0)
      },
      hasItems() {
        return this.validItems.length > 0
      },
      totalItems() {
        return this.validItems.reduce((sum, item) => {
          return sum + (item.quantity || 0)
        }, 0)
      },
      totalAmount() {
        return this.validItems.reduce((sum, item) => {
          const menuItem = this.menuItems.find(m => m.name === item.name)
          return sum + ((menuItem?.price || 0) * (item.quantity || 0))
        }, 0).toFixed(2)
      }
    },
    methods: {
      getItemPrice(item) {
        if (!item || !item.name) return '0.00'
        const menuItem = this.menuItems.find(m => m.name === item.name)
        return ((menuItem?.price || 0) * (item.quantity || 1)).toFixed(2)
      }
    }
  }
  </script>
  
  <style scoped>
  .order-summary {
    margin-top: 30px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .summary-content {
    margin-top: 15px;
  }
  
  .summary-items {
    margin-bottom: 20px;
  }
  
  h2 {
    color: #333;
    margin-bottom: 20px;
    font-size: 1.5em;
  }
  
  h3 {
    font-size: 1.1em;
    color: #555;
    margin-bottom: 10px;
  }
  
  .summary-items ul {
    list-style: none;
    padding: 0;
  }
  
  .summary-items li {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }
  
  .empty-message {
    color: #666;
    font-style: italic;
    padding: 10px 0;
  }
  
  .item-price {
    color: #FF32BA;
    font-weight: bold;
  }
  
  .total-line {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-weight: bold;
  }
  
  .payment-method {
    margin-top: 20px;
    font-weight: bold;
    color: #333;
  }
  </style>
  