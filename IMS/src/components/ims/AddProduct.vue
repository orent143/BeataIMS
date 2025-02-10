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
        <label for="unitPrice">Unit Price</label>
        <input id="unitPrice" v-model="unitPrice" type="number" placeholder="Unit Price" required min="0" step="0.01" />
      </div>
      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="categoryId" required>
          <option value="" disabled>Select Category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.CategoryName }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="supplier">Supplier</label>
        <select id="supplier" v-model="supplierId" required>
          <option value="" disabled>Select Supplier</option>
          <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
  {{ supplier.suppliername }}
</option>
        </select>
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
import { createInventoryProduct } from "@/api/inventory";
import { fetchCategories, fetchSuppliers } from "@/api/utils"; // API functions to fetch categories and suppliers

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      name: "",
      quantity: 0,
      unitPrice: 0,
      categoryId: null, // Category foreign key (id)
      supplierId: null, // Supplier foreign key (id)
      status: "In Stock",
      categories: [],  // List of available categories
      suppliers: [],  // List of available suppliers
    };
  },
  async created() {
    // Fetch available categories and suppliers when component is created
    this.categories = await fetchCategories();
    this.suppliers = await fetchSuppliers();
  },
  
  methods: {
    closeForm() {
      this.resetForm();
      this.$emit("close");
    },
    resetForm() {
      this.name = "";
      this.quantity = 0;
      this.unitPrice = 0;
      this.categoryId = null;
      this.supplierId = null;
      this.status = "In Stock";
    },
    async submit() {
      try {
        const formData = new FormData();
        formData.append("ProductName", this.name);
        formData.append("Quantity", this.quantity);
        formData.append("UnitPrice", this.unitPrice);
        formData.append("CategoryID", this.categoryId); // Use category ID
        formData.append("SupplierID", this.supplierId); // Use supplier ID
        formData.append("Status", this.status);

        const response = await createInventoryProduct(formData);
        console.log("Product added:", response.data);

        this.$emit("add", response.data); // Emit event to parent component
        this.closeForm(); // Close form after submission
      } catch (error) {
        console.error("Error adding product:", error);
      }
    },
  },
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
  font-family: "Arial", sans-serif;
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

label {
  font-weight: 600;
  font-family: "Arial", sans-serif;
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
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
  margin-left: 50px;
}

.add-item-btn {
  padding: 10px 10px;
  background-color: #ff32ba;
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