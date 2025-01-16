<!-- ProductSummary.vue -->
<template>
    <div class="product-summary">
      <h2>Product Summary</h2>
      
      <div class="summary-content">
        <div class="cost-breakdown">
          <h3>Cost Breakdown</h3>
          <div v-for="item in productItems" :key="item.stockId" class="cost-item">
            <span>{{ getStockName(item.stockId) }}</span>
            <span>{{ item.quantity }} × ₱{{ getStockPrice(item.stockId) }}</span>
            <span class="cost">₱{{ calculateItemCost(item) }}</span>
          </div>
        </div>
  
        <div class="total-section">
          <div class="total-row">
            <span>Raw Materials Cost:</span>
            <span class="amount">₱{{ totalMaterialsCost }}</span>
          </div>
          <div class="total-row">
            <span>Labor Cost:</span>
            <span class="amount">₱{{ laborCost }}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total Production Cost:</span>
            <span class="amount">₱{{ totalProductionCost }}</span>
          </div>
          <div class="total-row suggested-price">
            <span>Suggested Selling Price:</span>
            <span class="amount">₱{{ suggestedPrice }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProductSummary',
    props: {
      productItems: {
        type: Array,
        required: true
      },
      stockItems: {
        type: Array,
        required: true
      },
      laborCost: {
        type: Number,
        default: 0
      }
    },
    computed: {
      totalMaterialsCost() {
        return this.productItems.reduce((total, item) => {
          return total + this.calculateItemCost(item)
        }, 0)
      },
      totalProductionCost() {
        return this.totalMaterialsCost + this.laborCost
      },
      suggestedPrice() {
        // Add 30% markup for suggested selling price
        return (this.totalProductionCost * 1.3).toFixed(2)
      }
    },
    methods: {
      getStockName(stockId) {
        const stock = this.stockItems.find(s => s.id === stockId)
        return stock ? stock.name : ''
      },
      getStockPrice(stockId) {
        const stock = this.stockItems.find(s => s.id === stockId)
        return stock ? stock.price : 0
      },
      calculateItemCost(item) {
        const stock = this.stockItems.find(s => s.id === item.stockId)
        return stock ? (stock.price * item.quantity).toFixed(2) : 0
      }
    }
  }
  </script>
  
  <style scoped>
  .product-summary {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .summary-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .cost-breakdown {
    margin-bottom: 20px;
  }
  
  .cost-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    color: #666;
  }
  
  .cost {
    font-weight: bold;
  }
  
  .total-section {
    border-top: 2px solid #ddd;
    padding-top: 15px;
  }
  
  .total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-weight: bold;
  }
  
  .amount {
    color: #28a745;
  }
  
  .grand-total {
    border-top: 1px solid #ddd;
    padding-top: 10px;
    margin-top: 10px;
    font-size: 1.1em;
  }
  
  .suggested-price {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 2px dashed #ddd;
    color: #FF32BA;
    font-size: 1.2em;
  }
  </style>
  