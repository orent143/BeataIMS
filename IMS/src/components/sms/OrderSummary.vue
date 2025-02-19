<template>
  <div class="order-summary">
    <h2>Order Summary</h2>
    <div v-if="items.length > 0" class="summary-items">
      <ul>
        <li v-for="(item, index) in items" :key="index">
          {{ item.quantity }}x {{ item.name }}
          <span class="item-price">₱{{ getItemPrice(item) }}</span>
        </li>
      </ul>
    </div>
    <div v-else class="empty-message">No items selected</div>
    <div class="summary-totals">
      <p><strong>Total Items:</strong> {{ totalItems }}</p>
      <p><strong>Total Amount:</strong> ₱{{ totalAmount }}</p>
    </div>
    <p><strong>Payment Method:</strong> {{ paymentMethod }}</p>
  </div>
</template>

<script>
export default {
  name: 'OrderSummary',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    paymentMethod: {
      type: String,
      default: 'CASH'
    }
  },
  computed: {
    totalItems() {
      return this.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    },
    totalAmount() {
      return this.items
        .map(item => item.quantity * (item.price || 0))
        .reduce((sum, price) => sum + price, 0)
        .toFixed(2);
    }
  },
  methods: {
    getItemPrice(item) {
      return (item.quantity * (item.price || 0)).toFixed(2);
    }
  },
  watch: {
    items: {
      handler() {
        this.$forceUpdate(); // Ensure Vue re-renders when `items` changes
      },
      deep: true // Watch for changes within array objects
    }
  }
};
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
    color: #E54F70;
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
  