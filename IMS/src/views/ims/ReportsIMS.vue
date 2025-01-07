<template>
        <SideBar />

  <div class="app-container">
    <div class="header-container">
      <h1 class="products-header">Reports List</h1>
      <div class="header-actions">
        <div class="search-container">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search"
            class="search-bar"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
        <button @click="toggleAddForm" class="add-product-btn">Add</button>
      </div>
    </div>

    <div class="main-content">
      <div class="report-cards">
        <div 
          class="report-card"
          @click="goToReport('summary')"
        >
          <div class="report-card-header">
            <h3>Summary Report</h3>
          </div>
          <div class="report-card-body">
            <p>Overview of all reports and metrics.</p>
          </div>
        </div>

        <div 
          class="report-card"
          @click="goToReport('lowStock')"
        >
          <div class="report-card-header">
            <h3>Low Stock Report</h3>
          </div>
          <div class="report-card-body">
            <p>Displays items with low stock levels.</p>
          </div>
        </div>

        <div 
          class="report-card"
          @click="goToReport('sales')"
        >
          <div class="report-card-header">
            <h3>Sales Report</h3>
          </div>
          <div class="report-card-body">
            <p>Summary of sales activities and figures.</p>
          </div>
        </div>
      </div>

      <AddItem v-if="showAddForm" @add="addItem" :isVisible="showAddForm" @close="toggleAddForm" />
      <InventoryList
        :items="filteredItems"
        @edit="setEditItem"
        @remove="removeItem"
      />
      <EditItem v-if="editingItem" :item="editingItem" @save="saveItem" />
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/ims/SideBar.vue';

export default {
  components: {
    SideBar
  },
  data() {
    return {
      searchTerm: '',
      showAddForm: false,
      editingItem: null,
      filteredItems: [], // Assuming you have the items to filter
    };
  },
  methods: {
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
    },
    goToReport(reportType) {
    this.$router.push(`/reportsims/${reportType}`);
    },
    addItem(item) {
      // Handle adding the item
    },
    setEditItem(item) {
      this.editingItem = item;
    },
    removeItem(itemId) {
      // Handle item removal
    },
    saveItem(updatedItem) {
      // Handle saving the updated item
    }
  },
};
</script>


<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Allow the container to take remaining space */
  margin-left: 250px; /* Make space for sidebar, adjust as needed */
  height: 100vh; /* Full height of the page */
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
  flex-grow: 1; /* Allow the content to take the remaining space */
  transition: margin-left 0.3s ease; /* Smooth transition when sidebar toggles */
  height: calc(100vh - 60px); /* Account for header height */
  overflow-y: auto; /* Enable scrolling if content overflows */
}

.report-cards {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 10px;
  margin-top: 40px;
  align-items: center;
  width: 100%;
}

.report-card {
  background-color: #D9D9D9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 70%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer; /* Makes the card visually clickable */
}

.report-card:hover {
  background-color: #f0f0f0; /* Adds hover effect */
}

.report-card-header {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.report-card-body {
  font-size: 14px;
  color: #555;
  text-align: center;
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
  background-color: #D9D9D9;
}

.add-product-btn {
  padding: 8px 12px;
  background-color: #01A501;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 10px;
  width: 70px;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  text-align: center;
}

.add-product-btn:hover {
  background-color: #00b32dad;
}
</style>
