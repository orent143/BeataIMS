<template>
  <div class="popout-form" v-if="isVisible">
    <div class="form-header">
      <h2>Add Product</h2>
      <button class="close-btn" @click="closeForm">x</button>
    </div>
    <form @submit.prevent="submit" class="form-container">
      <!-- First Row -->
      <div class="form-group">
        <label for="name">Item Name</label>
        <input id="name" v-model="name" placeholder="Item Name" required />
      </div>
      <div class="form-group">
        <label for="quantity">Quantity</label>
        <input id="quantity" v-model="quantity" type="number" placeholder="Quantity" required min="1" />
      </div>

      <!-- Second Row -->
      <div class="form-group">
        <label for="costPrice">Cost Price</label>
        <input id="costPrice" v-model="costPrice" type="number" placeholder="Cost Price" required min="0" step="0.01" />
      </div>
      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="category" required>
          <option value="" disabled>Select Category</option>
          <option value="Beverages">Beverages</option>
          <option value="Bakery">Bakery</option>
          <option value="Food">Food</option>
        </select>
      </div>
      <div class="form-group">
        <label for="supplier">Supplier</label>
        <input id="supplier" v-model="supplier" placeholder="Supplier" required />
      </div>

      <!-- Third Row -->
      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="status" required>
          <option value="" disabled>Select Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="submit" class="add-item-btn">Add Product</button>
      </div>
    </form>
  </div>
</template>



<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      name: '',
      quantity: 0,
      costPrice: 0,
      category: '',
      supplier: '',
      status: 'In Stock' // Default status
    };
  },
  methods: {
    closeForm() {
      this.resetForm();
      this.$emit('close');
    },
    resetForm() {
      this.name = '';
      this.quantity = 0;
      this.costPrice = 0;
      this.category = '';
      this.supplier = '';
      this.status = 'In Stock';
    },
    submit() {
      const newItem = {
        id: Date.now(),
        name: this.name,
        quantity: this.quantity,
        costPrice: this.costPrice,
        category: this.category,
        supplier: this.supplier,
        status: this.status
      };
      this.$emit('add', newItem); // Emit the new item to parent component
      this.closeForm(); // Close the form after submission
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
  width: 400px; /* Fixed width for the form */
  max-width: 100%; /* Ensure it doesn't overflow the screen */
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
  grid-template-columns: 1fr 1fr; /* Two columns */
  gap: 15px; /* Space between fields */
  width: 100%;
}

.form-group {
  width: 100%; /* Ensure form elements fill the available space */
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
  justify-content: flex-end; /* Align the button to the right */
  width: 100%;
  margin-top: 20px;
  margin-left: 50px;
}

.add-item-btn {
  padding: 10px 10px;
  background-color: #01a501f8;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-item-btn:hover {
  background-color: #00b32d;
}

.add-item-btn:focus {
  outline: none;
}

</style>
