<template>
  <div class="popout-form" v-if="isVisible">
    <div class="form-header">
      <h2>Add Category</h2>
      <button @click="closeForm" class="close-btn">x</button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label for="categoryName">Category Name:</label>
        <input v-model="newCategory.CategoryName" id="categoryName" type="text" placeholder="Category Name" required />
      </div>
      
      <div class="form-actions">
        <button type="submit" class="add-category-btn">Add Category</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    isVisible: Boolean 
  },
  data() {
    return {
      newCategory: {
        CategoryName: '' // Match API field
      }
    };
  },
  methods: {
    closeForm() {
      this.$emit('close'); 
    },
    async submitForm() {
  if (!this.newCategory.CategoryName) {
    alert("Category Name is required!");
    return;
  }

  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/categories/categories/',  // ✅ Check this URL
      new URLSearchParams({ CategoryName: this.newCategory.CategoryName }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } } // ✅ Fix content type
    );

    this.$emit('add', response.data); 
    this.closeForm();
  } catch (error) {
    console.error("Error adding category:", error.response?.data || error);
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
  position: fixed; 
  right: 50%;
  top: 50%;
  transform: translate(50%, -50%);
  width: 400px;
  max-width: 100%;
  z-index: 1000; 
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
  grid-template-columns: 1fr;
  gap: 15px;
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

input {
  padding: 10px;
  font-size: 14px;
  border-radius: 12px;
  width: 100%;
  border: 1px solid #ccc;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.add-category-btn {
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

.add-category-btn:hover {
  background-color: #a33950;
}

.add-category-btn:focus {
  outline: none;
}
</style>
