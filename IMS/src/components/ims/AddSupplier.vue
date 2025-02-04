<template>
    <div class="popout-form" v-if="isVisible">
      <div class="form-header">
        <h2>Add Supplier</h2>
        <button @click="closeForm" class="close-btn">x</button>
      </div>
      <form @submit.prevent="submitForm" class="form-container">
        <!-- First Row -->
        <div class="form-group">
          <label for="name">Name:</label>
          <input v-model="newSupplier.name" id="name" type="text" placeholder="Supplier Name" required />
        </div>
        <div class="form-group">
          <label for="category">Category:</label>
          <input v-model="newSupplier.category" id="category" type="text" placeholder="Category" required />
        </div>
  
        <!-- Second Row -->
        <div class="form-group">
          <label for="contacts">Contacts:</label>
          <input v-model="newSupplier.contacts" id="contacts" type="number" placeholder="Contacts" required min="0" step="0.01" />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input v-model="newSupplier.email" id="email" type="text" placeholder="Email" required />
        </div>
  
  
        <!-- Form Actions (aligned with status) -->
        <div class="form-actions">
          <button type="submit" class="add-item-btn">Add Supplier</button>
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
      newSupplier: {
        name: '',
        category: '',
        contacts: '',
        email: '',
      }
    };
  },
  methods: {
    closeForm() {
      this.$emit('close'); 
    },
    submitForm() {
      this.$emit('add', { ...this.newSupplier }); 
      this.newSupplier = { name: '', category: '', contacts: '', email: ''}; 
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
  