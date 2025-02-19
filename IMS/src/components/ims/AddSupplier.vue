<template>
  <div class="popout-form" v-if="isVisible">
    <div class="form-header">
      <h2>Add Supplier</h2>
      <button @click="closeForm" class="close-btn">x</button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <!-- First Row -->
      <div class="form-group">
        <label for="suppliername">Name:</label>
        <input v-model="newSupplier.suppliername" id="suppliername" type="text" placeholder="Supplier Name" required />
      </div>

      <div class="form-group">
        <label for="contactinfo">Contacts:</label>
        <input v-model="newSupplier.contactinfo" id="contactinfo" type="text" placeholder="Contacts" required />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="newSupplier.email" id="email" type="email" placeholder="Email" required />
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="submit" class="add-item-btn">Add Supplier</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    isVisible: Boolean,
  },
  data() {
    return {
      newSupplier: {
        suppliername: '',
        contactinfo: '',
        email: ''
      }
    };
  },
  methods: {
    closeForm() {
      this.$emit('close');
    },
    async submitForm() {
      try {
        if (!this.newSupplier.suppliername || !this.newSupplier.contactinfo || !this.newSupplier.email) {
          alert("All fields are required!");
          return;
        }

        const response = await axios.post(
          'http://127.0.0.1:8000/api/suppliers/suppliers/',  // Removed extra "/suppliers/"
          new URLSearchParams({
            suppliername: this.newSupplier.suppliername.trim(),
            contactinfo: this.newSupplier.contactinfo.trim(),
            email: this.newSupplier.email.trim()
          })
        );

        this.$emit('add', response.data);
        this.closeForm();
      } catch (error) {
        console.error("Error adding supplier:", error.response?.data || error.message);
      }
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
  