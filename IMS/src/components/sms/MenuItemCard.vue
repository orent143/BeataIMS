<template>
  <div class="menu-item-card">
    <div class="item-icon">
      <i :class="getItemIcon(item.name)"></i>
    </div>
    <div class="item-details">
      <h3>{{ item.name }}</h3>
      <p class="price">₱{{ formattedPrice }}</p>
      <p class="stock" :class="{ 'low-stock': item.stock <= 5 }">Stock: {{ item.stock }}</p>

      <div class="item-controls">
        <input 
          type="number"
          min="1"
          :max="item.stock"
          :value="quantity"
          @input="$emit('update:quantity', Math.min(Math.max(1, Number($event.target.value)), item.stock))"
          class="quantity-input"
        />
        <button 
          class="add-btn"
          @click="$emit('add', item)"
          :class="{ 'selected': selected }"
          :disabled="item.stock <= 0"
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
    item: Object,
    quantity: Number,
    selected: Boolean
  },
  computed: {
    formattedPrice() {
      return `${Number(this.item.price || 0).toFixed(2)}`;
    }
  },
  methods: {
    getItemIcon(name) {
      const iconMap = {
        'Cappuccino': 'pi pi-coffee',
        'Latte': 'pi pi-coffee',
        'Espresso': 'pi pi-coffee',
        'Mocha': 'pi pi-coffee',
        'Croissant': 'pi pi-bread',
        'Muffin': 'pi pi-cookie'
      };
      return iconMap[name] || 'pi pi-utensils';
    }
  }
};
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
  .low-stock {
  color: red;
  font-weight: bold;
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
    background-color: #E54F70;
    border-radius: 50%;
    color: white;
    font-size: 24px;
  }
  .item-icon i {
  font-size: 2rem;
  color: white;

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
    color: #E54F70;
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
    background: #E54F70;
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
  