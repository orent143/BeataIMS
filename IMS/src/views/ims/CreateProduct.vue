<template>
  <div class="app-container">
    <SideBar />
    <div class="main-container">
      <div class="header-container">
        <h1 class="header">Create Product</h1>
      </div>

      <div class="content-wrapper">
        <div class="main-content">
          <!-- Product Details -->
          <div class="product-details">
            <h2>Product Details</h2>
            <div class="form-group">
              <label>Product Name</label>
              <input v-model="product.name" type="text" required class="form-input" />
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

            <div class="form-group">
              <label>Labor Cost</label>
              <input v-model.number="product.laborCost" type="number" min="0" step="0.01" class="form-input" />
            </div>
          </div>

          <!-- Raw Materials/Stocks Selection -->
          <ProductItemSelector 
            :items="product.materials"
            :stockItems="stockItems"
            @update:items="updateMaterials"
          />
        </div>

        <!-- Product Summary -->
        <div class="summary-section">
          <ProductSummary 
            :productItems="product.materials"
            :stockItems="stockItems"
            :laborCost="product.laborCost"
          />

          <div class="form-actions">
            <button type="button" @click="resetForm" class="reset-btn">Reset</button>
            <button type="submit" @click.prevent="submitProduct" class="submit-btn">Create Product</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/ims/SideBar.vue';
import ProductItemSelector from '@/components/ims/ProductItemSelector.vue'
import ProductSummary from '@/components/ims/ProductSummary.vue'

export default {
  name: 'CreateProduct',
  components: {
    ProductItemSelector,
    ProductSummary,
    SideBar
  },
  data() {
    return {
      product: {
        name: '',
        description: '',
        category: '',
        laborCost: 0,
        materials: [{ stockId: '', quantity: 1 }]
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
    }
  },
  methods: {
    updateMaterials(newMaterials) {
      this.product.materials = newMaterials.length > 0 ? newMaterials : [{ stockId: '', quantity: 1 }]
    },
    submitProduct() {
      // Validate product details
      if (!this.product.name) {
        alert('Please enter product name')
        return
      }
      if (!this.product.category) {
        alert('Please select product category')
        return
      }

      // Validate materials
      const validMaterials = this.product.materials.filter(item => item.stockId)
      if (validMaterials.length === 0) {
        alert('Please add at least one raw material')
        return
      }

      // Create a clean product object
      const productToSubmit = {
        ...this.product,
        materials: validMaterials
      }

      // TODO: Implement product submission to backend
      console.log('Product submitted:', productToSubmit)
      this.$router.push('/inventoryims')
    },
    resetForm() {
      this.product = {
        name: '',
        description: '',
        category: '',
        laborCost: 0,
        materials: [{ stockId: '', quantity: 1 }]
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.main-container {
  flex-grow: 1;
  margin-left: 250px;
  padding: 20px;
  background: #f5f5f5;
}

.header-container {
  margin-bottom: 30px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-details {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea.form-input {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.submit-btn {
  background: #FF32BA;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
}

.reset-btn {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}
</style>
