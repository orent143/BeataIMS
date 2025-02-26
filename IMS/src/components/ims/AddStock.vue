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
        <input v-model="newItem.StockName" id="name" type="text" placeholder="Item Name" required />
      </div>
      <div class="form-group">
        <label for="quantity">Quantity:</label>
        <input v-model="newItem.Quantity" id="quantity" type="number" placeholder="Quantity" required min="1" />
      </div>

      <!-- Second Row -->
      <div class="form-group">
        <label for="costPrice">Cost Price:</label>
        <input v-model="newItem.CostPrice" id="costPrice" type="number" placeholder="Cost Price" required min="0" step="0.01" />
      </div>
      <div class="form-group">
        <label for="supplier">Supplier:</label>
        <select v-model="newItem.SupplierID" id="supplier" class="form-control" required>
          <option value="" disabled>Select Supplier</option>
          <option v-for="supplier in suppliers" :key="supplier.SupplierID" :value="supplier.SupplierID">
            {{ supplier.SupplierName }}
          </option>
        </select>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="submit" class="add-item-btn" :disabled="loading">
          {{ loading ? "Adding..." : "Add Stock" }}
        </button>
      </div>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from 'vue-toastification';

export default {
  props: ["isVisible"],
  data() {
    return {
      newItem: {
        StockName: "",
        Quantity: null,
        CostPrice: null,
        SupplierID: ""
      },
      suppliers: [], // 🆕 Store suppliers here
      loading: false,
      errorMessage: "",
      successMessage: ""
    };
  },
  methods: {
    async fetchSuppliers() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/suppliers/');
        this.suppliers = response.data.map(supplier => ({
          SupplierID: supplier.id,  // Ensure the key names match
          SupplierName: supplier.suppliername
        }));
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    },
    async submitForm() {
      const toast = useToast();
      this.loading = true;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        await axios.post('http://127.0.0.1:8000/api/stock/stocks/', new URLSearchParams({
          StockName: this.newItem.StockName,
          Quantity: this.newItem.Quantity,
          CostPrice: this.newItem.CostPrice,
          SupplierID: this.newItem.SupplierID
        }));

        this.successMessage = "Stock added successfully!";
        toast.success(this.successMessage);
        this.$emit("update-parent");
        this.$emit("close");
      } catch (error) {
        this.errorMessage = "Error adding stock.";
        toast.error(this.errorMessage);
        console.error("Error adding stock:", error);
      } finally {
        this.loading = false;
      }
    },
    closeForm() {
      this.$emit("close");
    }
  },
  mounted() {
    this.fetchSuppliers();
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
  background-color: #E54F70;
  color: #dbdbdb;
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