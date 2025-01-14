import { createRouter, createWebHistory } from 'vue-router';

//ims
import HomeIMS from '@/views/ims/HomeIMS.vue';
import InventoryIMS from '@/views/ims/InventoryIMS.vue';
import Suppliers from '@/views/ims/Suppliers.vue';
import ReportsIMS from '@/views/ims/ReportsIMS.vue';
import Category from '@/views/ims/Category.vue';
import SummaryReport from '@/views/ims/reports/SummaryReport.vue';
import LowStockReport from '@/views/ims/reports/LowStockReport.vue';
import SalesReport from '@/views/ims/reports/SalesReport.vue';

//sms
import CreateOrder from '@/views/sms/CreateOrder.vue';
import HomeSMS from '@/views/sms/HomeSMS.vue';
import InventorySMS from '@/views/sms/InventorySMS.vue';
import Order from '@/views/sms/Order.vue';
import Sales from '@/views/sms/Sales.vue';
import ReportsSMS from '@/views/sms/ReportsSMS.vue';

import Welcome from '@/views/Welcome.vue'; // Import the Welcome page

const routes = [
  { path: '/', component: Welcome }, // Set the root path to the Welcome page
  { path: '/homeims', component: HomeIMS },
  { path: '/inventoryims', component: InventoryIMS },
  { path: '/sales', component: Sales },
  { path: '/suppliers', component: Suppliers },
  { path: '/category', component: Category },
  { path: '/reportsims', component: ReportsIMS },
  { path: '/reportsims/summary', component: SummaryReport },
  { path: '/reportsims/lowStock', component: LowStockReport },
  { path: '/reportsims/sales', component: SalesReport },
  { path: '/homesms', component: HomeSMS },
  { path: '/inventorysms', component: InventorySMS },
  { path: '/createorder', component: CreateOrder },
  { path: '/order', component: Order },
  { path: '/reportssms', component: ReportsSMS },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
