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

      <!-- Second Row -->
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
      <div class="form-group">
        <label for="supplier">Supplier</label>
        <select id="supplier" v-model="product.SupplierID" required>
          <option value="" disabled>Select Supplier</option>
          <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
            {{ supplier.suppliername }}
          </option>
        </select>
      </div>

      <!-- Third Row -->
      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="product.Status" required>
          <option value="" disabled>Select Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
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

export default {
  props: {
    isVisible: Boolean,
    itemToEdit: Object
  },
  data() {
    return {
      product: { ...this.itemToEdit }, // Initialize with product data
      categories: [],  // List of categories
      suppliers: [],    // List of suppliers
      showNotification: false // Notification visibility
    };
  },
  methods: {
    closeForm() {
      this.$emit('close');
    },
    async updateProduct() {
      try {
        const productId = parseInt(this.product.id); // Ensure ID is valid

        if (isNaN(productId)) {
          throw new Error("Invalid product ID");
        }

        const response = await axios.put(
          `http://127.0.0.1:8000/api/inventory/inventoryproduct/${productId}`,
          {
            ProductName: this.product.ProductName,
            Quantity: this.product.Quantity,
            UnitPrice: this.product.UnitPrice,
            CategoryID: this.product.CategoryID,
            SupplierID: this.product.SupplierID,
            Status: this.product.Status
          },
          { headers: { "Content-Type": "application/json" } }
        );

        this.$emit("update", response.data); // Emit updated product
        alert('updated successfully!');
        setTimeout(() => {
          this.showNotification = false; // Hide notification after 3 seconds
          this.closeForm(); // Close the form
        }, 3000);
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product");
      }
    }
  },
  created() {
    // Fetch categories and suppliers data (you should have these in your backend API)
    axios.get('http://127.0.0.1:8000/api/categories').then(response => {
      this.categories = response.data;
    });

    axios.get('http://127.0.0.1:8000/api/suppliers').then(response => {
      this.suppliers = response.data;
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

.notification {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  margin-top: 10px;
}
</style>