<template>
  <div class="popout-form" v-if="isVisible">
    <div class="form-header">
      <h2>Add Product</h2>
      <button class="close-btn" @click="closeForm">x</button>
    </div>
    <form @submit.prevent="confirmAndSubmit" class="form-container">
      <div class="form-group">
        <label for="name">Product Name:</label>
        <input id="name" v-model="name" placeholder="Product Name" required />
      </div>
      <div class="form-group">
        <label for="quantity">Quantity:</label>
        <input id="quantity" v-model="quantity" type="number" placeholder="Quantity" required min="1" />
      </div>
      <div class="form-group">
        <label for="unitPrice">Unit Price:</label>
        <input id="unitPrice" v-model="unitPrice" type="number" placeholder="Unit Price" required min="0" step="0.01" />
      </div>
      <div class="form-group">
        <label for="category">Category:</label>
        <select id="category" v-model="categoryId" class="form-control" required>
          
          <option value="" disabled>Select Category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.CategoryName }}
          </option>
        </select>
      </div>
      <div class="form-group">
    <label for="processType">Process Type:</label>
    <select id="processType" v-model="processType" class="form-control" required>
      <option value="" disabled>Select Process Type</option>
      <option value="Ready-Made">Ready Made</option>
      <option value="To Be Made">To Be Made</option>
    </select>
  </div>
      <div class="form-group image-section">
      <label for="image">Product Image</label>
      <div class="image-upload-container">
      <label for="image" class="image-upload">
        <input type="file" id="image" @change="handleImageUpload" />
        <img v-if="imagePreview" :src="imagePreview" class="preview-image" />
        <span v-if="!imagePreview" class="upload-text">Upload New Image</span>
      </label>
    </div>
  </div>
      <div class="form-actions">
        <button type="submit" class="add-item-btn">Add Product</button>
      </div>
    </form>
  </div>

  <div class="modal-overlay" v-if="showConfirmModal">
    <div class="confirmation-modal">
      <div class="modal-content">
        <h3>Confirm Addition</h3>
        <p>Are you sure you want to add this product?</p>
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
  },
  data() {
    return {
      name: "",
      quantity: 1,
      unitPrice: 0,
      categoryId: null,
      categories: [],
      processType: "",
      imageFile: null, 
      imagePreview: null, 
      showConfirmModal: false,
      toast: useToast(), 
    };
  },
  async created() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories");
      this.categories = response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
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
      this.processType = "";
    },
    async confirmAndSubmit() {
      this.showConfirmModal = true;
    },
    cancelSubmit() {
      this.showConfirmModal = false;
    },
    confirmSubmit() {
      this.showConfirmModal = false;
      this.submit();
    },
    handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    this.imageFile = file;
    this.imagePreview = URL.createObjectURL(file); 
  }
},
    async submit() {
      try {
        const formData = new FormData();
        formData.append("ProductName", this.name);
        formData.append("Quantity", this.quantity);
        formData.append("UnitPrice", this.unitPrice);
        formData.append("ProcessType", this.processType);
        if (this.categoryId) {
          formData.append("CategoryID", this.categoryId);
        }
        if (this.imageFile) {
          formData.append("Image", this.imageFile); 
        }

        const response = await axios.post(
          `http://127.0.0.1:8000/api/inventory/inventoryproduct/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("Product added:", response.data);
        this.$emit("add", response.data);

        this.toast.success("Product added successfully!", {
          timeout: 3000,
        });

        this.closeForm();
      } catch (error) {
        console.error("Error adding product:", error.response?.data || error);
        this.toast.error("Failed to add product!", {
          timeout: 3000,
        });
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
select.form-control {
  padding: 10px;
  font-size: 14px;
  border-radius: 12px;
  width: 85%;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}

select.form-control:focus {
  border-color: #E54F70;
  outline: none;
}
</style>