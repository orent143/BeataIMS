<template>
  <Header />
  <SideBar />
  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Categories</h1>
      <div class="header-actions">
        <button @click="toggleAddForm" class="add-product-btn">Add</button>
      </div>
    </div>

    <AddCategory 
      v-if="showAddForm" 
      @add="addCategory" 
      :isVisible="showAddForm" 
      @close="toggleAddForm"
      class="add-category-form" 
    />
    <div class="category-container">
    <div class="category-list">
      <div v-for="category in filteredCategories" :key="category.id" class="category-card">
        <h3>{{ category.CategoryName }}</h3> 
        <div class="category-actions">
          <button @click="setEditCategory(category)" class="action-btn edit-btn">
            <i class="pi pi-pencil"></i>
          </button>
          <button @click="removeCategory(category.id)" class="action-btn remove-btn">
            <i class="pi pi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

    <EditCategory 
  v-if="editingCategory" 
  :category="editingCategory" 
  @save="saveCategory" 
  @close="toggleEditForm"
/>
  </div>
</template>

<script>
import axios from 'axios';
import AddCategory from '@/components/ims/AddCategory.vue';
import EditCategory from '@/components/ims/EditCategory.vue';
import SideBar from '@/components/ims/SideBar.vue';
import Header from '@/components/Header.vue';

export default {
  components: {
    AddCategory,
    EditCategory,
    SideBar,
    Header
  },
  data() {
    return {
      categories: [],  
      showAddForm: false,
      editingCategory: null,
      searchTerm: ''
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category =>
        category.CategoryName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  },
  created() {
    this.fetchCategories(); 
  },
  methods: {
    toggleEditForm() {
    this.editingCategory = null;
  },
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
    },
    async fetchCategories() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories/');
      this.categories = response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  },
  async addCategory(newCategory) {
    await this.fetchCategories(); 
    this.toggleAddForm();
  },
  setEditCategory(category) {
    this.editingCategory = { ...category };
  },
  async saveCategory(updatedCategory) {
    const index = this.categories.findIndex(cat => cat.id === updatedCategory.id);
    if (index !== -1) {
      this.categories[index] = updatedCategory;
    }
    this.editingCategory = null; 
  },
  
  async removeCategory(categoryId) {
  try {
    console.log("Deleting category with ID:", categoryId); 

    const response = await axios.delete(`http://127.0.0.1:8000/api/categories/categories/${categoryId}`);
    
    console.log(response.data);
    this.categories = this.categories.filter(cat => cat.id !== categoryId);
  } catch (error) {
    console.error("Error deleting category:", error.response?.data || error.message);
  }
}

},
};
</script>


<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 230px;
  height: 100%; 
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 18px;
  width: 95%;
}
.category-container {
  flex-grow: 1;
  background-color: #EFEFEF;
  border-radius: 25px;
  overflow-y: auto; 
  margin-left: 5px;
  padding: 20px;
  height: calc(100vh - 120px); 
  max-height: 40dvw;
}
.category-container::-webkit-scrollbar {
  width: 6px;
}

.category-container::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.category-container::-webkit-scrollbar-track {
  background: transparent;
}
.products-header {
  color: #333;
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
  flex-grow: 1; 
  transition: margin-left 0.3s ease; 
  height: calc(100vh - 60px); 
  overflow-y: auto; 
}

.category-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  overflow-y: auto; 
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
  font-size: 15px;
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
  background-color: #E54F70;
  color: #dbdbdb;
  border: none;
  border-radius: 10px;
  width: 100px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.add-product-btn:hover {
  background-color: #ed9598;
}



</style>
