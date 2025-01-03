<template>
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Categories</h1>
      <div class="header-actions">
        <!-- Search Bar -->
        <div class="search-container">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search"
            class="search-bar"
          />
          <i class="fas fa-search search-icon"></i>
        </div>

        <!-- Add Category Button -->
        <button @click="toggleAddForm" class="add-product-btn">Add</button>
      </div>
    </div>

    <div class="main-content">
      <!-- Add Category Form -->
      <AddCategory 
        v-if="showAddForm" 
        @add="addCategory" 
        :isVisible="showAddForm" 
        @close="toggleAddForm"
        class="add-category-form" 
      />

      <div class="category-list">
        <!-- Categories Grid -->
        <div v-for="category in filteredCategories" :key="category.id" class="category-card">
          <h3>{{ category.name }}</h3>
          
          <!-- Action Buttons -->
          <div class="category-actions">
            <button @click="setEditCategory(category)" class="action-btn edit-btn">
              <i class="fas fa-pencil-alt"></i> <!-- Pencil icon for edit -->
            </button>
            <button @click="removeCategory(category.id)" class="action-btn remove-btn">
              <i class="fas fa-trash"></i> <!-- Trash icon for remove -->
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Category Form -->
      <EditCategory v-if="editingCategory" :category="editingCategory" @save="saveCategory" @close="toggleEditForm" />
    </div>
  </div>
</template>

<script>
import AddCategory from '@/components/AddCategory.vue';
import EditCategory from '@/components/EditCategory.vue';

export default {
  components: {
    AddCategory,
    EditCategory
  },
  data() {
    return {
      categories: [
        { id: 1, name: 'Hot Coffee' },
        { id: 2, name: 'Ice Coffee' },
        { id: 3, name: 'Juice' },
        { id: 4, name: 'Milk Tea' },
        { id: 5, name: 'Frappe' },
        { id: 6, name: 'Choco Drink' }
      ],
      showAddForm: false,
      editingCategory: null,
      searchTerm: ''
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  },
  methods: {
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
    },
    addCategory(newCategory) {
      this.categories.push(newCategory);
      this.toggleAddForm(); // Close the form
    },
    setEditCategory(category) {
      this.editingCategory = { ...category };
    },
    saveCategory(updatedCategory) {
      const index = this.categories.findIndex(cat => cat.id === updatedCategory.id);
      if (index !== -1) {
        this.categories.splice(index, 1, updatedCategory);
      }
      this.editingCategory = null;
    },
    removeCategory(categoryId) {
      this.categories = this.categories.filter(cat => cat.id !== categoryId);
    }
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  width: 80vw;
  max-width: 80vw;
  margin-left: 40px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 18px;
  width: 95%;
}

.products-header {
  color: #000000;
  font-size: 30px;
  font-family: 'Arial', sans-serif;
  font-weight: 900;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.main-content {
  display: flex;
  flex-direction: column;
  padding: 4px;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columns layout */
  gap: 20px;
}

.category-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color:#dfdfdf;
  padding: 15px;
  height: 230px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
}

.category-card h3 {
  font-size: 18px;
  margin-bottom: 20px;
}

.category-actions {
  position: absolute;
  top: 10px;
  right: 10px;
}

.action-btn {
  padding: 8px;
  background-color: transparent;
  color: #333;
  border: none;
  cursor: pointer;
  font-size: 18px;
  margin: 0 5px;
}

.action-btn:hover {
  color: #FF32BA;
}

.edit-btn i, .remove-btn i {
  font-size: 20px;
}

.search-container {
  position: relative;
  margin-right: 3px;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #333;
  pointer-events: none;
}

.search-bar {
  padding: 8px 30px 8px 8px;
  border: 1px solid #94949400;
  border-radius: 10px;
  width: 130px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  background-color: #d9d9d9;
}

.add-product-btn {
  padding: 8px 12px;
  background-color: #01a501;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 10px;
  width: 100px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.add-product-btn:hover {
  background-color: #00b32dad;
}



</style>
