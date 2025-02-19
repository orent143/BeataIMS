<template>
  <div class="popout-form" v-if="isVisible">
    <div class="form-header">
      <h2>Edit Supplier</h2>
      <button @click="closeForm" class="close-btn">x</button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label for="suppliername">Name:</label>
        <input v-model="editedSupplier.suppliername" id="suppliername" type="text" required />
      </div>
      <div class="form-group">
        <label for="contactinfo">Contacts:</label>
        <input v-model="editedSupplier.contactinfo" id="contactinfo" type="text" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="editedSupplier.email" id="email" type="email" required />
      </div>
      <div class="form-actions">
        <button type="submit" class="update-btn">Update Supplier</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    isVisible: Boolean,
    supplierToEdit: Object
  },
  data() {
    return {
      editedSupplier: { ...this.supplierToEdit }
    };
  },
  watch: {
    supplierToEdit: {
      handler(newVal) {
        this.editedSupplier = { ...newVal };
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    closeForm() {
      this.$emit('close');
    },
    async submitForm() {
      try {
        await axios.put(`http://127.0.0.1:8000/api/suppliers/suppliers/   ${this.editedSupplier.id}`, this.editedSupplier, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        this.$emit('save', this.editedSupplier);
      } catch (error) {
        console.error('Error updating supplier:', error);
      }
    },
  }
};
</script>

  
  
  <style scoped>
  /* Styling similar to the AddStock.vue */
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
.update-btn {
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

.update-btn:hover {
  background-color: #a33950;
}

.add-item-btn:focus {
  outline: none;
}

</style>