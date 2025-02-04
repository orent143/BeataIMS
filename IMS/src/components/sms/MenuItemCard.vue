<template>
    <div class="menu-item-card">
      <div class="item-icon">
        <i :class="getItemIcon(item.name)"></i>
      </div>
      <div class="item-details">
        <h3>{{ item.name }}</h3>
        <p class="price">₱{{ item.price.toFixed(2) }}</p>
        <div class="item-controls">
          <input 
            :value="quantity"
            @input="$emit('update:quantity', Number($event.target.value) || 1)"
            type="number" 
            min="1" 
            class="quantity-input" 
          />
          <button 
            class="add-btn"
            @click="$emit('add')"
            :class="{ 'selected': selected }"
          >
            {{ selected ? 'Update' : 'Add' }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MenuItemCard',
    props: {
      item: {
        type: Object,
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      },
      selected: {
        type: Boolean,
        default: false
      }
    },
    emits: ['add', 'update:quantity'],
    methods: {
      getItemIcon(name) {
        // Map item names to Font Awesome icons
        const iconMap = {
          'Cappuccino': ['fas', 'fa-mug-hot'],
          'Latte': ['fas', 'fa-mug-hot'],
          'Espresso': ['fas', 'fa-mug-hot'],
          'Mocha': ['fas', 'fa-mug-hot'],
          'Croissant': ['fas', 'fa-bread-slice'],
          'Muffin': ['fas', 'fa-cookie']
        }
        return iconMap[name] || ['fas', 'fa-utensils']
      }
    }
  }
  </script>
  
  <style scoped>
  .menu-item-card {
    background: #ff32bb2d;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    padding: 20px;
  }
  
  .menu-item-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .item-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FF32BA;
    border-radius: 50%;
    color: white;
    font-size: 24px;
  }
  
  .item-details {
    text-align: center;
  }
  
  h3 {
    margin: 0;
    color: #333;
    font-size: 1.2em;
  }
  
  .price {
    color: #FF32BA;
    font-weight: bold;
    font-size: 1.1em;
    margin: 8px 0;
  }
  
  .item-controls {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }
  
  .quantity-input {
    width: 60px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
  }
  
  .add-btn {
    flex: 1;
    background: #FF32BA;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
  }
  
  .add-btn.selected {
    background: #FF32BA;
  }
  
  .add-btn:hover {
    opacity: 0.9;
  }
  </style>
  