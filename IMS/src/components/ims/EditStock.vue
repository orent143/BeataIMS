<template>
    <div class="popout-form" v-if="isVisible">
      <div class="form-header">
        <h2>Edit Stock Item</h2>
        <button @click="closeForm" class="close-btn">x</button>
      </div>
      <form @submit.prevent="submitForm" class="form-container">
        <!-- Form fields, same as AddStock but prefilled -->
        <div class="form-group">
          <label for="name">Name:</label>
          <input v-model="editedItem.name" id="name" type="text" placeholder="Item Name" required />
        </div>
        <div class="form-group">
          <label for="quantity">Quantity:</label>
          <input v-model="editedItem.quantity" id="quantity" type="number" placeholder="Quantity" required min="1" />
        </div>
  
        <div class="form-group">
          <label for="costPrice">Cost Price:</label>
          <input v-model="editedItem.costPrice" id="costPrice" type="number" placeholder="Cost Price" required min="0" step="0.01" />
        </div>
        <div class="form-group">
          <label for="supplier">Supplier:</label>
          <input v-model="editedItem.supplier" id="supplier" placeholder="Supplier" required />
        </div>

  
        <div class="form-actions">
          <button type="submit" class="add-item-btn">Update Item</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: Boolean,
      itemToEdit: Object
    },
    data() {
      return {
        editedItem: { ...this.itemToEdit } // Initialize with the item to edit
      };
    },
    methods: {
      closeForm() {
        this.$emit('close');
      },
      submitForm() {
        this.$emit('update', this.editedItem); 
        this.closeForm(); 
      }
    }
  };
  </script>
  
  <style scoped>
  /* Styling similar to the AddStock.vue */
  .popout-form {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.459);
    position: absolute;
    right: 50%;
    top: 50%;
    transform: translate(50%, -50%);
    width: 400px;
    max-width: 100%;
  }
  
  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .form-header h2 {
    font-size: 25px;
    font-family: 'Arial', sans-serif;
    font-weight: 1000;
  }
  
  .close-btn {
    background: transparent;
    border: none;
    font-size: 17px;
    color: #333;
    cursor: pointer;
  }
  
  .form-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  .form-group {
    width: 100%;
  }

  label {
    font-weight: 600;
    font-size: 14px;
  }
  
  input,
  select {
    padding: 10px;
    font-size: 14px;
    border-radius: 12px;
    width: 85%;
    border: 1px solid #ccc;
  }
  .form-actions {
  display: flex;
  justify-content: center; 
  width: 100%;
  margin-top: 10px; 
  grid-column: span 2; 
}
.add-item-btn {
  padding: 10px 20px;
  background-color: #E54F70;
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-item-btn:hover {
  background-color: #a33950;
}

.add-item-btn:focus {
  outline: none;
}

</style>