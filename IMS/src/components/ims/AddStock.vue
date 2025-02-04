<template>
  <div class="popout-form" v-if="isVisible">
    <div class="form-header">
      <h2>Add Stock</h2>
      <button @click="closeForm" class="close-btn">x</button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <!-- First Row -->
      <div class="form-group">
        <label for="name">Name:</label>
        <input v-model="newItem.name" id="name" type="text" placeholder="Item Name" required />
      </div>
      <div class="form-group">
        <label for="quantity">Quantity:</label>
        <input v-model="newItem.quantity" id="quantity" type="number" placeholder="Quantity" required min="1" />
      </div>

      <!-- Second Row -->
      <div class="form-group">
        <label for="costPrice">Cost Price:</label>
        <input v-model="newItem.costPrice" id="costPrice" type="number" placeholder="Cost Price" required min="0" step="0.01" />
      </div>
      <div class="form-group">
        <label for="supplier">Supplier:</label>
        <input v-model="newItem.supplier" id="supplier" placeholder="Supplier" required />
      </div>

      <!-- Third Row (Centered Status) -->
      <div class="form-group status-group">
        <label for="status">Status:</label>
        <select v-model="newItem.status" id="status" required>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      <!-- Form Actions (aligned with status) -->
      <div class="form-actions">
        <button type="submit" class="add-item-btn">Add Stock</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean 
  },
  data() {
    return {
      newItem: {
        name: '',
        quantity: 0,
        costPrice: 0,
        supplier: '',
        status: 'In Stock'
      }
    };
  },
  methods: {
    closeForm() {
      this.$emit('close');
    },
    submitForm() {
      this.$emit('add', { ...this.newItem }); 
      this.newItem = { name: '', quantity: 0, costPrice: 0, supplier: '', status: 'In Stock' }; 
    }
  }
};
</script>

<style scoped>
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
  color: #000000;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 17px;
  color: #333;
  cursor: pointer;
  font-weight: 1000;
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
}

.form-group {
  width: 100%; 
}

.status-group {
  grid-column: span 2; 
  text-align: center; 
}

label {
  font-weight: 600;
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
  color: #272727;
}

input,
select {
  padding: 10px;
  font-size: 14px;
  border-radius: 12px;
  width: 85%;
  border: 1px solid #ccc;
}

select {
  padding-right: 10px;
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
  background-color: #FF32BA;
  color: #dbdbdb;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-item-btn:hover {
  background-color: #fc62c9;
}

.add-item-btn:focus {
  outline: none;
}

</style>
