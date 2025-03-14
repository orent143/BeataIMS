<template>
  <div class="menu-item-card">
    <div class="item-image-container">
      <img 
        v-if="item.image" 
        :src="item.image" 
        :alt="item.name" 
        class="menu-image" 
      />
    </div>
    <div class="item-details">
      <h3>{{ item.name }}</h3>
      <p class="price">₱{{ formattedPrice }}</p>
      <p class="stock" :class="{ 'low-stock': item.stock <= 5 }">
        Stock: {{ item.stock }}
      </p>

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
          @click="$emit('add', { ...item, price: Number(item.price) })"
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
  }
};
</script>
  
<style scoped>
.menu-item-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.item-image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.menu-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: transform 0.3s ease;
}

.menu-image:hover {
  transform: scale(1.05);
}

.item-details {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

h3 {
  margin: 0;
  color: #333;
  font-size: 1.2em;
  text-align: center;
}

.price {
  color: #E54F70;
  font-weight: bold;
  font-size: 1.1em;
  margin: 8px 0;
  text-align: center;
}

.stock {
  text-align: center;
  margin: 5px 0;
}

.low-stock {
  color: red;
  font-weight: bold;
}

.item-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
}

.quantity-input {
  width: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.add-btn {
  padding: 8px 15px;
  background-color: #E54F70;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  min-width: 80px;
}

.add-btn.selected {
  background-color: #e67e22;
}

.add-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.menu-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>