import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Inventory from '@/views/Inventory.vue';
import Stock from '@/views/Stock.vue';
import Sales from '@/views/Sales.vue';
import Suppliers from '@/views/Suppliers.vue';
import Reports from '@/views/Reports.vue';
import Category from '@/views/Category.vue';
import SummaryReport from '@/views/reports/SummaryReport.vue';
import LowStockReport from '@/views/reports/LowStockReport.vue';
import SalesReport from '@/views/reports/SalesReport.vue';
import Welcome from '@/views/Welcome.vue'; // Import the Welcome page

const routes = [
  { path: '/', component: Welcome }, // Set the root path to the Welcome page
  { path: '/home', component: Home },
  { path: '/inventory', component: Inventory },
  { path: '/stock', component: Stock },
  { path: '/sales', component: Sales },
  { path: '/suppliers', component: Suppliers },
  { path: '/category', component: Category },
  { path: '/reports', component: Reports },
  { path: '/reports/summary', component: SummaryReport },
  { path: '/reports/lowStock', component: LowStockReport },
  { path: '/reports/sales', component: SalesReport },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
