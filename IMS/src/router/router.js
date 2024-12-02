import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Inventory from '@/views/Inventory.vue';
import Stock from '@/views/Stock.vue';
import Sales from '@/views/Sales.vue';
import Suppliers from '@/views/Suppliers.vue';
import Reports from '@/views/Reports.vue';
import Category from '@/views/Category.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/inventory', component: Inventory },
  { path: '/stock', component: Stock },
  { path: '/sales', component: Sales },
  { path: '/suppliers', component: Suppliers },
  { path: '/category', component: Category },
  { path: '/reports', component: Reports }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
