<template>
  <Header />
  <SideBar />
  <div class="app-container">
    <div class="main-container">
      <div class="header-container">
        <h1 class="header">Create Inventory Product</h1>
      </div>
      <div class="content-wrapper">
        <div class="product-details">
          <h2>Product Details</h2>
          <div class="form-group">
            <label>Product Name</label>
            <input v-model="product.ProductName" type="text" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Product Quantity</label>
            <input v-model.number="product.Quantity" type="number" min="1" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Unit Price (₱)</label>
            <input v-model.number="product.UnitPrice" type="number" min="0" step="0.01" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Category</label>
            <select v-model="product.CategoryID" class="form-input">
              <option value="" disabled>Select Category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.CategoryName }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Stocks (Optional, Add Multiple)</label>
            <div v-for="(stockEntry, index) in product.Stocks" :key="index" class="stock-entry">
              <select v-model.number="stockEntry.StockID" class="form-input">
                <option value="" disabled>Select Stock</option>
                <option v-for="stock in stocks" :key="stock.StockID" :value="stock.StockID">
                  {{ stock.StockName }} (Available: {{ stock.Quantity }})
                </option>
              </select>
              <input v-model.number="stockEntry.StockQuantity" type="number" min="1" class="form-input stock-quantity" placeholder="Stock Quantity" />
              <button @click="removeStock(index)" class="remove-btn">Remove</button>
            </div>
            <button @click="addStock" class="add-btn">Add Another Stock</button>
          </div>
        </div>

        <div class="summary-section">
          <h2>Product Summary</h2>
          <div class="summary-details">
            <p><strong>Product Name:</strong> {{ product.ProductName || 'N/A' }}</p>
            <p><strong>Category:</strong> {{ selectedCategoryName }}</p>
            <p><strong>Quantity:</strong> {{ product.Quantity }}</p>
            <p><strong>Unit Price:</strong> ₱{{ product.UnitPrice.toFixed(2) }}</p>
            <p><strong>Stocks:</strong></p>
            <ul>
              <li v-for="(stock, index) in product.Stocks" :key="index">
                {{ getStockName(stock.StockID) }} - {{ stock.StockQuantity }} units
              </li>
            </ul>
            <hr />
            <p><strong>Total Cost:</strong> ₱{{ totalCost.toFixed(2) }}</p>
          </div>

          <div class="form-actions">
            <button type="button" @click="resetForm" class="reset-btn">Reset</button>
            <button type="button" @click="confirmAndSubmit" class="submit-btn">Create Product</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SideBar from '@/components/ims/SideBar.vue';
import Header from '@/components/Header.vue';
import { useToast } from 'vue-toastification';

export default {
  components: { SideBar, Header },
  data() {
    return {
      product: {
        ProductName: "",
        CategoryID: null,
        Quantity: 1,
        UnitPrice: 0,
        Stocks: [],
      },
      categories: [],
      stocks: [],
      loading: false,
      errorMessage: "",
      toast: useToast(), // Initialize Toast
    };
  },
  computed: {
    totalCost() {
      return this.product.Quantity * this.product.UnitPrice;
    },
    selectedCategoryName() {
      const category = this.categories.find(cat => cat.id === this.product.CategoryID);
      return category ? category.CategoryName : 'N/A';
    },
    getStockName() {
      return (stockID) => {
        const stock = this.stocks.find(s => s.StockID === stockID);
        return stock ? stock.StockName : 'N/A';
      };
    }
  },
  mounted() {
    this.fetchPrepopulateData();
  },
  methods: {
    async fetchPrepopulateData() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/products/prepopulate');
        if (response.data.categories && response.data.stocks) {
          this.categories = response.data.categories;
          this.stocks = response.data.stocks;
          console.log("Categories fetched:", this.categories);
          console.log("Stocks fetched:", this.stocks);
          this.toast.success("Categories and Stocks loaded successfully!");
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error('Error fetching prepopulate data:', error.response?.data?.detail || error.message);
        this.errorMessage = "Failed to fetch categories and stocks.";
        this.toast.error("Failed to fetch categories and stocks.");
      } finally {
        this.loading = false;
      }
    },
    addStock() {
      this.product.Stocks.push({ StockID: null, StockQuantity: 1 });
      this.toast.info("New stock entry added.");
    },
    removeStock(index) {
      this.product.Stocks.splice(index, 1);
      this.toast.warning("Stock entry removed.");
    },
    async confirmAndSubmit() {
      if (window.confirm("Are you sure you want to create this product?")) {
        this.submitProduct();
      }
    },
    async submitProduct() {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("ProductName", this.product.ProductName);
        formData.append("CategoryID", this.product.CategoryID);
        formData.append("Quantity", this.product.Quantity);
        formData.append("UnitPrice", this.product.UnitPrice);
        formData.append("Stocks", JSON.stringify(this.product.Stocks));

        console.log("Submitting product:", this.product);

        const response = await axios.post('http://127.0.0.1:8000/api/products/products/', formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        this.toast.success("Product created successfully!");
        console.log("Product created:", response.data);
        this.resetForm();
      } catch (error) {
        console.error("Error creating product:", error.response?.data?.detail || error.message);
        this.toast.error(error.response?.data?.detail || "Failed to create product.");
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.product = {
        ProductName: "",
        CategoryID: null,
        Quantity: 1,
        UnitPrice: 0,
        Stocks: [],
      };
      this.toast.info("Form reset.");
    },
  },
};
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100%;
}

.main-container {
  flex-grow: 1;
  margin-left: 230px;
  padding: 0px 20px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 30px;
}

.product-details {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.summary-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #111111;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  font-size: 1rem;
  color: #333;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #FF32BA; /* Bold focus color */
  box-shadow: 0 0 5px rgba(255, 50, 186, 0.5); /* Focus shadow */
  outline: none;
}

textarea.form-input {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 25px;
}

.submit-btn {
  background: #E54F70;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #c0425d; /* Darker hover color */
}

.reset-btn {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.reset-btn:hover {
  background-color: #5a6268; /* Darker reset button hover */
}

button:focus {
  outline: none;
}

.header-container h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 15px;
}

.product-details h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 20px;
}

.select-category {
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 2px solid #ddd;
  padding: 12px;
  font-size: 1rem;
  color: #333;
  width: 100%;
  transition: all 0.3s ease;
}

.select-category:focus {
  border-color: #FF32BA;
  box-shadow: 0 0 5px rgba(255, 50, 186, 0.5);
  outline: none;
}
.stock-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.stock-quantity {
  width: 80px;
}
.add-stock-btn, .remove-stock-btn {
  margin-top: 5px;
  padding: 5px;
  cursor: pointer;
  border-color: #E54F70;
  box-shadow: 0 0 5px rgba(255, 50, 186, 0.5);
  outline: none;
  color: #f9f9f9;
}
.form-group button{
  display: flex;
  border-radius: 5px;
  color:#ffffff;
  background-color: #E54F70;
}
.product-details select {
  font-size: 1rem;
  color: #333;
  padding: 12px;
  width: 100%;
  border-radius: 6px;
  background-color: #f9f9f9;
  border: 2px solid #ddd;
  transition: all 0.3s ease;
}

.product-details select:focus {
  border-color: #FF32BA;
  box-shadow: 0 0 5px rgba(255, 50, 186, 0.5);
  outline: none;
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .main-container {
    margin-left: 0;
  }
}
</style>