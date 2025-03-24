<template>
  <div class="menu-section">
    <h2>Menu Items</h2>
    <div v-if="loading">Loading menu items...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="menuItems.length > 0" class="items-grid">
      <MenuItemCard
        v-for="menuItem in menuItems"
        :key="menuItem.id"
        :item="{
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          stock: menuItem.stock,
          processType: menuItem.process_type,
          image: menuItem.image,
          category: menuItem.category,
          status: menuItem.status
        }"
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
    menuItems: Array 
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
        
        const response = await axios.get('http://127.0.0.1:8000/api/orders/menu_items/all');
        
        console.log("Menu items received:", response.data);

        // Map the menu items and enforce infinite stock for "To Be Made" products
        const mappedMenuItems = response.data.map(item => ({
          ...item,
          stock: item.process_type === 'To Be Made' ? '∞' : item.stock,
          status: item.process_type === 'To Be Made' ? 'Available' : item.status
        }));

        this.$emit('update:menuItems', mappedMenuItems);

        if (!mappedMenuItems.length) {
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
          price: menuItem.price,
          quantity: 1,
          processType: menuItem.process_type,
          status: menuItem.status,
          category: menuItem.category
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
  