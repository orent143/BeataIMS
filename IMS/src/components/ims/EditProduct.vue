<template>
  <div class="popout-form" v-if="isVisible">
    <div class="form-header">
      <h2>Edit Product</h2>
      <button class="close-btn" @click="closeForm">x</button>
    </div>
    <form @submit.prevent="updateProduct" class="form-container">
      <!-- Form content -->
      <div class="form-group">
        <label for="name">Item Name</label>
        <input id="name" v-model="product.ProductName" placeholder="Item Name" required />
      </div>
      <div class="form-group">
        <label for="quantity">Quantity</label>
        <input id="quantity" v-model="product.Quantity" type="number" placeholder="Quantity" required min="1" />
      </div>

      <div class="form-group">
        <label for="unitPrice">Unit Price</label>
        <input id="unitPrice" v-model="product.UnitPrice" type="number" placeholder="Unit Price" required min="0" step="0.01" />
      </div>
      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="product.CategoryID" required>
          <option value="" disabled>Select Category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.CategoryName }}</option>
        </select>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="submit" class="add-item-btn">Update Product</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  props: {
    isVisible: Boolean,
    itemToEdit: Object
  },
  data() {
    return {
      product: { ...this.itemToEdit }, // Initialize with product data
      categories: []  // List of categories
    };
  },
  methods: {
    closeForm() {
      this.$emit('close');
    },
    async updateProduct() {
      const toast = useToast();
      try {
        console.log("Updating product:", this.product);

        if (!this.product.id) {
          throw new Error("Product ID is missing!");
        }

        await axios.put(
          `http://127.0.0.1:8000/api/inventory/inventoryproduct/${this.product.id}`,
          this.product
        );

        this.$emit("update", { ...this.product }); // Emit updated product
        toast.success("Product updated successfully!");
        this.closeForm();
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update product");
      }
    }
  },
  created() {
    // Fetch categories data
    axios.get('http://127.0.0.1:8000/api/categories').then(response => {
      this.categories = response.data;
    });
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
  color: #ffffff;
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

.notification {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  margin-top: 10px;
}
</style>