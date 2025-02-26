<template>
  <div class="popout-form" v-if="category">
    <div class="form-header">
      <h2>Edit Category</h2>
      <button @click="closeForm" class="close-btn">x</button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label for="categoryName">Category Name:</label>
        <input v-model="editedCategory.CategoryName" id="categoryName" type="text" placeholder="Category Name" required />
      </div>
      <div class="form-actions">
        <button type="submit" class="save-category-btn">Save Category</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  props: {
    category: Object
  },
  data() {
    return {
      editedCategory: { ...this.category }
    };
  },
  methods: {
    async submitForm() {
      const toast = useToast();
      try {
        await axios.put(`http://127.0.0.1:8000/api/categories/categories/${this.category.id}`,  
          new URLSearchParams({
            CategoryName: this.editedCategory.CategoryName
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }
        );

        toast.success('Category updated successfully!');
        this.$emit("save", this.editedCategory); // Emit event to update UI
        this.closeForm();
      } catch (error) {
        toast.error('Error updating category.');
        console.error("Error updating category:", error.response?.data || error.message);
      }
    },
    closeForm() {
      this.$emit("close");
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

.save-category-btn {
  padding: 10px 20px;
  background-color: #E54F70;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-category-btn:hover {
  background-color: #a33950;
}

.save-category-btn:focus {
  outline: none;
}
</style>