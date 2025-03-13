<template>
  <div class="popout-form" v-if="isVisible">
    <div class="form-header">
      <h2>Edit Stock</h2>
      <button @click="closeForm" class="close-btn">x</button>
    </div>
    <form @submit.prevent="confirmAndSubmit" class="form-container">
      <div class="form-group">
        <label for="name">Name:</label>
        <input v-model="editedItem.StockName" id="name" type="text" placeholder="Item Name" required />
      </div>
      <div class="form-group">
        <label for="quantity">Quantity:</label>
        <input v-model="editedItem.Quantity" id="quantity" type="number" placeholder="Quantity" required min="1" />
      </div>
      <div class="form-group">
        <label for="costPrice">Cost Price:</label>
        <input v-model="editedItem.CostPrice" id="costPrice" type="number" placeholder="Cost Price" required min="0" step="0.01" />
      </div>
      <div class="form-group">
        <label for="supplier">Supplier:</label>
        <select v-model="editedItem.SupplierID" id="supplier" class="form-control" required>
          <option value="" disabled>Select Supplier</option>
          <option v-for="supplier in suppliers" :key="supplier.SupplierID" :value="supplier.SupplierID">
            {{ supplier.SupplierName }}
          </option>
        </select>
      </div>

      <div class="form-group image-section">
    <label for="image">Stock Image:</label>
    <div class="image-upload-container">
      <label for="image" class="image-upload">
        <input type="file" id="image" @change="handleImageUpload" accept="image/*" />
        <img v-if="imagePreview" :src="imagePreview" class="preview-image" />
        <span v-if="!imagePreview" class="upload-text">Upload New Image</span>
      </label>
    </div>
  </div>
      <div class="form-actions">
        <button type="submit" class="add-item-btn">Update Stock</button>
      </div>
    </form>
  </div>

  <div class="modal-overlay" v-if="showConfirmModal">
    <div class="confirmation-modal">
      <div class="modal-content">
        <h3>Confirm Addition</h3>
        <p>Are you sure you want to edit this stock?</p>
        <div class="modal-actions">
          <button @click="cancelSubmit" class="cancel-btn">Cancel</button>
          <button @click="confirmSubmit" class="confirm-btn">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  props: {
    isVisible: Boolean,
    itemToEdit: Object
  },
  data() {
    return {
      editedItem: {},
      suppliers: [],
      showConfirmModal: false,
      imagePreview: null, // Add this

    };
  },
  watch: {
    itemToEdit: {
      handler(newValue) {
        if (newValue) {
          this.editedItem = { ...newValue };
          this.imagePreview = newValue.Image; // Add this

        }
      },
      immediate: true
    }
  },
  methods: {
    async fetchSuppliers() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/suppliers/');
        this.suppliers = response.data.map((supplier) => ({
          SupplierID: supplier.id,
          SupplierName: supplier.suppliername
        }));
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.editedItem.Image = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    closeForm() {
      this.$emit("close");
    },
    async confirmAndSubmit() {
      this.showConfirmModal = true;
    },
    cancelSubmit() {
      this.showConfirmModal = false;
    },
    confirmSubmit() {
      this.showConfirmModal = false;
      this.submitForm();
    },
    async submitForm() {
      const toast = useToast();
      try {
        const formData = new FormData();
        formData.append('StockName', this.editedItem.StockName);
        formData.append('Quantity', this.editedItem.Quantity);
        formData.append('CostPrice', this.editedItem.CostPrice);
        formData.append('SupplierID', this.editedItem.SupplierID);
        
        if (this.editedItem.Image instanceof File) {
          formData.append('Image', this.editedItem.Image);
        }

        await axios.put(
          `http://127.0.0.1:8000/api/stock/stocks/${this.editedItem.StockID}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        toast.success("Stock item updated successfully!");
        this.$emit("update-parent", this.editedItem);
        this.closeForm();
      } catch (error) {
        toast.error("Error updating stock item.");
        console.error("Error updating stock:", error.response?.data || error.message);
      }
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


label {
  font-weight: 600;
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirmation-modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content {
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 15px;
  color: #333;
}

.modal-content p {
  margin-bottom: 20px;
  color: #666;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.cancel-btn, .confirm-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.cancel-btn {
  background-color: #f3f3f3;
  color: #666;
}

.confirm-btn {
  background-color: #E54F70;
  color: white;
}

.cancel-btn:hover {
  background-color: #e7e7e7;
}

.confirm-btn:hover {
  background-color: #d84666;
}
.image-section {
  display: flex;
  flex-direction: column;
  grid-column: span 2;
  gap: 10px;
  width: 100%;
}

.image-upload-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 15px;
}
.image-upload {
  position: relative;
  width: 100%;
  max-width: 210%; /* Adjust width as needed */
  height: 120px; /* Increased height */
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  background-color: #f9f9f9;
}

.image-upload:hover {
  border-color: #E54F70;
  background: #fff5f7;
}
.image-upload input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.upload-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 14px;
  text-align: center;
  width: 100%;
}
.upload-text::before {
  content: '+';
  display: block;
  font-size: 24px;
  margin-bottom: 5px;
  color: #E54F70;
}

</style>