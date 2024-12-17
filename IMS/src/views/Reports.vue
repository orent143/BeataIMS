<template>
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
      <!-- Add the Report Cards here -->
      <div class="report-cards">
        <div class="report-card">
          <div class="report-card-header">
            <h3>Summary Report</h3>
          </div>
          <div class="report-card-body">
            <p>Overview of all reports and metrics.</p>
          </div>
        </div>

        <div class="report-card">
          <div class="report-card-header">
            <h3>Low Stock Report</h3>
          </div>
          <div class="report-card-body">
            <p>Displays items with low stock levels.</p>
          </div>
        </div>

        <div class="report-card">
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
// Your script section remains the same
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  width: 80dvw;
  max-width: 80dvw;
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
  gap: 10px; /* Add space between header actions */
}

.main-content {
  display: flex; /* Use flexbox for layout */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 100vh; /* Full viewport height */
  padding: 4px; /* Padding around the main content */
}

.report-cards {
  display: flex;
  flex-direction: column; /* Stack the cards vertically */
  gap: 40px; /* Add space between cards */
  margin-bottom: 10px; /* Space below the cards */
  margin-top: 40px; /* Space below the cards */
  align-items: center; /* Center the cards horizontally */
  width: 100%;
}

.report-card {
  background-color: #D9D9D9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 70%; /* Make the cards full-width */
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  justify-content: center; /* Center content vertically */
  text-align: center; /* Center the text inside */
}

.report-card-header {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center; /* Center header text */
}

.report-card-body {
  font-size: 14px;
  color: #555;
  text-align: center; /* Center body text */
}

.search-container {
  position: relative; /* Set position relative for the icon */
  margin-right: 3px; /* Space between search and button */
}

.search-icon {
  position: absolute; /* Position absolute to place it inside the input */
  right: 10px; /* Position it on the right */
  top: 50%; /* Center vertically */
  transform: translateY(-50%); /* Adjust for vertical centering */
  color: #333; /* Icon color */
  pointer-events: none; /* Prevent clicks on the icon */
}

.search-bar {
  padding: 8px 30px 8px 8px; /* Add right padding for icon space */
  border: 1px solid #94949400;
  border-radius: 10px;
  width: 130px;
  font-size: 14px; /* Adjust font size */
  font-weight: bold; /* Adjust font weight */
  color: #333; /* Change font color */
  background-color: #D9D9D9; /* Change background color */
}

.add-product-btn {
  padding: 8px 12px;
  background-color: #01A501; /* Button background */
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 10px;
  width: 70px;
  cursor: pointer;
  font-size: 14px; /* Adjust font size */
  font-family: 'Arial', sans-serif; /* Change font family */
  font-weight: bold; /* Make font bold */
  text-align: center; /* Center the text */
}

.add-product-btn:hover {
  background-color: #00b32dad; /* Darker on hover */
}
</style>
