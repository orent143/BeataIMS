<template>  <!-- Import Header component -->
  <Header />

  <SideBar />
  <div class="app-container">

    
    <div class="main-container">
      <div class="header-container">
        <h1 class="header">Create Inventory Product</h1>
      </div>

      <div class="content-wrapper">
          <!-- Product Details -->
          <div class="product-details">
            <h2>Product Details</h2>
            <div class="form-group">
              <label>Product Name</label>
              <input v-model="product.name" type="text" required class="form-input" />
            </div>

            <div class="form-group">
              <label>Product Quantity</label>
              <input v-model.number="product.quantity" type="number" min="1" class="form-input" />
            </div>

            <div class="form-group">
              <label>Unit Price (₱)</label>
              <input v-model.number="product.unitPrice" type="number" min="0" step="0.01" class="form-input" />
            </div>

            <div class="form-group">
              <label>Category</label>
              <select v-model="product.category" class="form-input">
                <option value="">Select Category</option>
                <option value="BEVERAGE">Beverage</option>
                <option value="PASTRY">Pastry</option>
                <option value="DESSERT">Dessert</option>
              </select>
            </div>

          <!-- Raw Materials / Stock Selector -->
          <ProductItemSelector 
            :items="product.items"
            :stockItems="stockItems"
            @update:items="updateItems"
          />
        </div>

        <!-- Product Summary -->
        <div class="summary-section">
          <ProductSummary 
            :productItems="product.items"
            :stockItems="stockItems"
            :laborCost="product.unitPrice * product.quantity"
          />

          <div class="form-actions">
            <button type="button" @click="resetForm" class="reset-btn">Reset</button>
            <button type="button" @click="submitProduct" class="submit-btn">Create Product</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/ims/SideBar.vue';
import ProductSummary from '@/components/ims/ProductSummary.vue';
import ProductItemSelector from '@/components/ims/ProductItemSelector.vue';
import Header from '@/components/Header.vue'; // Import Header component

export default {
  name: 'CreateProduct',
  components: {
    ProductSummary,
    SideBar,
    ProductItemSelector,
    Header
  },
  data() {
    return {
      product: {
        name: '',
        quantity: 1,
        unitPrice: 0,
        category: '',
        items: [{ stockId: '', quantity: 1 }]  // Default to one empty item
      },
      stockItems: [
        { id: 1, name: 'Coffee Beans', price: 500.00, quantity: 1000 },
        { id: 2, name: 'Milk', price: 80.00, quantity: 500 },
        { id: 3, name: 'Sugar', price: 50.00, quantity: 1000 },
        { id: 4, name: 'Chocolate Powder', price: 300.00, quantity: 500 },
        { id: 5, name: 'Flour', price: 45.00, quantity: 1000 },
        { id: 6, name: 'Butter', price: 120.00, quantity: 200 },
        { id: 7, name: 'Eggs', price: 8.00, quantity: 300 },
        { id: 8, name: 'Vanilla Extract', price: 150.00, quantity: 100 }
      ]
    };
  },
  methods: {
    updateItems(updatedItems) {
      this.product.items = updatedItems;
    },

    submitProduct() {
      // Validate product details
      if (!this.product.name) {
        alert('Please enter product name');
        return;
      }
      if (!this.product.category) {
        alert('Please select product category');
        return;
      }

      // Validate that all items have a valid stockId and quantity
      const invalidItem = this.product.items.find(item => !item.stockId || item.quantity < 1);
      if (invalidItem) {
        alert('Please ensure all stock items have been selected with valid quantities');
        return;
      }

      // Calculate total price
      const totalPrice = this.product.unitPrice * this.product.quantity;

      // Prepare the product object for submission
      const productToSubmit = {
        ...this.product,
        totalPrice
      };

      // Simulate product submission (e.g., API call)
      console.log('Product submitted:', productToSubmit);

      // Reset form after submission
      this.resetForm();

      // Optionally navigate to another page or display a success message
      this.$router.push('/inventoryims');
    },

    resetForm() {
      this.product = {
        name: '',
        quantity: 1,
        unitPrice: 0,
        category: '',
        items: [{ stockId: '', quantity: 1 }]  // Reset items
      };
    }
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100%;
  background-color: #f8f9fa; /* Light background for the whole container */
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
  color: #333;
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
  background: #FF32BA;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #e02c9b; /* Darker hover color */
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
