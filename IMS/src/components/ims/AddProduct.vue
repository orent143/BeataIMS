<template>
  <div class="popout-form" v-if="isVisible">
    <div class="form-header">
      <h2>Add Product</h2>
      <button class="close-btn" @click="closeForm">x</button>
    </div>
    <form @submit.prevent="submit" class="form-container">
      <div class="form-group">
        <label for="name">Item Name</label>
        <input id="name" v-model="name" placeholder="Item Name" required />
      </div>
      <div class="form-group">
        <label for="quantity">Quantity</label>
        <input id="quantity" v-model="quantity" type="number" placeholder="Quantity" required min="1" />
      </div>
      <div class="form-group">
        <label for="unitPrice">Unit Price</label>
        <input id="unitPrice" v-model="unitPrice" type="number" placeholder="Unit Price" required min="0" step="0.01" />
      </div>
      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="categoryId" required>
          <option value="" disabled>Select Category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.CategoryName }}
          </option>
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
      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="status" required>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="submit" class="add-item-btn">Add Product</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    isVisible: Boolean,
  },
  data() {
    return {
      name: "",
      quantity: 1, // Default to 1 to prevent accidental empty submission
      unitPrice: 0,
      categoryId: null,
      supplierId: null,
      status: "In Stock",
      categories: [],
      suppliers: [],
    };
  },
  async created() {
    try {
      const [categoryResponse, supplierResponse] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/categories"),
        axios.get("http://127.0.0.1:8000/api/suppliers"),
      ]);
      this.categories = categoryResponse.data;
      this.suppliers = supplierResponse.data;
    } catch (error) {
      console.error("Error fetching categories or suppliers:", error);
    }
  },
  methods: {
    closeForm() {
      this.resetForm();
      this.$emit("close");
    },
    resetForm() {
      this.name = "";
      this.quantity = 1;
      this.unitPrice = 0;
      this.categoryId = null;
      this.supplierId = null;
      this.status = "In Stock";
    },
    async submit() {
  try {
    console.log("Selected Status:", this.status); // ✅ Debugging to check selected status

    const formData = new URLSearchParams();
    formData.append("ProductName", this.name);
    formData.append("Quantity", this.quantity);
    formData.append("UnitPrice", this.unitPrice);
    formData.append("CategoryID", this.categoryId);
    formData.append("SupplierID", this.supplierId);
    formData.append("Status", this.status); // ✅ Ensure the correct status is being sent

    const response = await axios.post(
      "http://127.0.0.1:8000/api/inventory/inventoryproduct/",
      formData, 
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("Product added:", response.data);
    this.$emit("add", response.data);
    alert('added successfully!');
    setTimeout(() => {
      this.showNotification = false; 
    this.closeForm();
  }, 3000);
  } catch (error) {
    console.error("Error adding product:", error.response?.data || error);
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