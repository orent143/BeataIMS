<template>
    <div class="menu-section">
      <h2>Menu Items</h2>
      <div class="items-grid">
        <div v-for="menuItem in menuItems" :key="menuItem.id" class="menu-item">
          <MenuItemCard
            :item="menuItem"
            :quantity="getItemQuantity(menuItem)"
            :selected="isItemSelected(menuItem)"
            @add="addOrUpdateItem(menuItem)"
            @update:quantity="updateQuantity(menuItem, $event)"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import MenuItemCard from './MenuItemCard.vue'
  
  export default {
    name: 'OrderItemSelector',
    components: {
      MenuItemCard
    },
    props: {
      items: {
        type: Array,
        required: true
      },
      menuItems: {
        type: Array,
        required: true
      }
    },
    emits: ['update:items'],
    methods: {
      getItemQuantity(menuItem) {
        const existingItem = this.items.find(item => item.name === menuItem.name)
        return existingItem?.quantity || 1
      },
      isItemSelected(menuItem) {
        return this.items.some(item => item.name === menuItem.name)
      },
      addOrUpdateItem(menuItem) {
        const existingIndex = this.items.findIndex(item => item.name === menuItem.name)
        const quantity = this.getItemQuantity(menuItem)
  
        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...this.items]
          updatedItems[existingIndex] = { ...updatedItems[existingIndex], quantity }
          this.$emit('update:items', updatedItems)
        } else {
          // Add new item
          const updatedItems = [
            ...this.items.filter(item => item.name !== ''), // Keep non-empty items
            { name: menuItem.name, quantity }
          ]
          this.$emit('update:items', updatedItems)
        }
      },
      updateQuantity(menuItem, quantity) {
        const existingIndex = this.items.findIndex(item => item.name === menuItem.name)
        if (existingIndex >= 0) {
          const updatedItems = [...this.items]
          updatedItems[existingIndex] = { ...updatedItems[existingIndex], quantity }
          this.$emit('update:items', updatedItems)
        }
      }
    }
  }
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
  