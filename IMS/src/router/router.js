import { createRouter, createWebHistory } from 'vue-router';

//ims
import HomeIMS from '@/views/ims/HomeIMS.vue';
import Products from '@/views/ims/Products.vue';
import ViewInventoryVue from '@/views/ims/ViewInventory.vue';
import ViewDetailsVue from '@/views/ims/ViewDetails.vue';
import Suppliers from '@/views/ims/Suppliers.vue';
import CreateOrder from '@/views/ims/CreateOrder.vue';
import ReportsIMS from '@/views/ims/ReportsIMS.vue';
import Category from '@/views/ims/Category.vue';
import CreateProductVue from '@/views/ims/CreateProduct.vue';
import ProductSales from '@/views/ims/Sales.vue';
import StockVue from '@/views/ims/Stock.vue';
import OrdersHistory from '@/views/ims/OrderHistory.vue';
import SummaryReport from '@/views/ims/reports/SummaryReport.vue';
import LowStockReport from '@/views/ims/reports/LowStockReport.vue';
import OrderDetailsVue from '@/views/ims/OrderDetails.vue';



//admin
import Dashboard from '@/views/admin/Dashboard.vue';
import Users from '@/views/admin/Users.vue';

import Welcome from '@/views/Welcome.vue'; 
import Login from '@/views/Login.vue'; 
import Profile from '@/views/Profile.vue';

const routes = [
  { path: '/', component: Welcome }, 
  { path: '/login', component: Login }, 
  { path: '/profile', component: Profile }, 
  { path: '/homeims', component: HomeIMS },
  { path: '/products', component: Products },
  { path: '/viewinventory', component: ViewInventoryVue },
  { path: '/viewdetails/:id', name: 'ViewDetailsVue', component: ViewDetailsVue },
  { path: '/stocks', component: StockVue },
  { path: '/create', component: CreateProductVue },
  { path: '/productsales', component: ProductSales },
  { path: '/suppliers', component: Suppliers },
  { path: '/vieworderdetails/:id', name: 'ViewOrderDetails', component: OrderDetailsVue },
  { path: '/category', component: Category },
  { path: '/reportsims', component: ReportsIMS },
  { path: '/reportsims/summary', component: SummaryReport },
  { path: '/reportsims/lowStock', component: LowStockReport },
  { path: '/createorder', component: CreateOrder },
  { path: '/ordershistory', component: OrdersHistory },
  { path: '/dashboard', component: Dashboard },
  { path: '/users', component: Users }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;