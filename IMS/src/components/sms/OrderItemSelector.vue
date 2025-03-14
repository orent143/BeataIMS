<template>
  <div class="menu-section">
    <h2>Menu Items</h2>
    <div v-if="loading">Loading menu items...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="menuItems.length > 0" class="items-grid">
      <MenuItemCard
  v-for="menuItem in menuItems"
  :key="menuItem.id"
  :item="menuItem"
  :quantity="getItemQuantity(menuItem)"
  :selected="isItemSelected(menuItem)"
  @add="addOrUpdateItem(menuItem)"
  @update:quantity="updateQuantity(menuItem, $event)"
/>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MenuItemCard from './MenuItemCard.vue';

export default {
  name: 'OrderItemSelector',
  components: { MenuItemCard },
  props: {
    items: Array,
    menuItems: Array // ✅ Comes from parent `CreateOrder.vue`
  },
  data() {
    return {
      loading: false,
      errorMessage: ''
    };
  },
  mounted() {
    this.fetchMenuItems();
  },
  methods: {
    async fetchMenuItems() {
      try {
        this.loading = true;
        console.log("Fetching menu items...");
        
        const response = await axios.get('http://127.0.0.1:8000/api/orders/menu_items');
        
        console.log("Menu items received:", response.data);
        
        // ✅ Emit to parent to update `menuItems`
        this.$emit('update:menuItems', response.data);

        if (!response.data.length) {
          this.errorMessage = "No menu items found.";
        }
      } catch (error) {
        console.error("Error fetching menu:", error.response?.data?.detail || error.message);
        this.errorMessage = "Failed to load menu items.";
      } finally {
        this.loading = false;
      }
    },
    getItemQuantity(menuItem) {
      return this.items.find(item => item.id === menuItem.id)?.quantity || 1;
    },
    isItemSelected(menuItem) {
      return this.items.some(item => item.id === menuItem.id);
    },
    addOrUpdateItem(menuItem) {
  const updatedItems = [...this.items];
  const existingItem = updatedItems.find(item => item.id === menuItem.id);

  if (existingItem) {
    existingItem.quantity = this.getItemQuantity(menuItem);
  } else {
    updatedItems.push({ 
      id: menuItem.id, 
      name: menuItem.name, 
      price: Number(menuItem.price),  // ✅ Ensure price is added as a number
      quantity: 1 
    });
  }

  this.$emit('update:items', updatedItems);
},
    updateQuantity(menuItem, quantity) {
      const updatedItems = this.items.map(item =>
        item.id === menuItem.id ? { ...item, quantity } : item
      );
      this.$emit('update:items', updatedItems);
    }
  }
};
</script>


  <style scoped>
  .menu-section {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
  }
  
  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  h2 {
    color: #333;
    margin-bottom: 20px;
    font-size: 1.5em;
  }
  </style>
  