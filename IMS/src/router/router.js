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
import RecordSalesTransaction from '@/views/ims/RecordSalesTransaction.vue';
import OrdersHistory from '@/views/ims/OrderHistory.vue';
import SummaryReport from '@/views/ims/reports/SummaryReport.vue';
import LowStockReport from '@/views/ims/reports/LowStockReport.vue';

//sms
import HomeSMS from '@/views/sms/HomeSMS.vue';
import ReportsSms from '@/views/sms/ReportsSMS.vue';
import SalesReportSMS from '@/views/sms/reports/salesreport.vue';
import HistoryReportSMS from '@/views/sms/reports/historyreport.vue';

//admin
import Dashboard from '@/views/admin/Dashboard.vue';
import Users from '@/views/admin/Users.vue';

import Welcome from '@/views/Welcome.vue'; // Import the Welcome page
import Login from '@/views/Login.vue'; // Import the Login page
import Profile from '@/views/Profile.vue'; // Import the Profile page

const routes = [
  { path: '/', component: Welcome }, // Set the root path to the Welcome page
  { path: '/login', component: Login }, // Add the login route
  { path: '/profile', component: Profile }, // Add the login route
  { path: '/homeims', component: HomeIMS },
  { path: '/products', component: Products },
  { path: '/viewinventory', component: ViewInventoryVue },
  { path: '/viewdetails/:id', name: 'ViewDetailsVue', component: ViewDetailsVue },
  { path: '/stocks', component: StockVue },
  { path: '/create', component: CreateProductVue },
  { path: '/productsales', component: ProductSales },
  { path: '/record-sales', component: RecordSalesTransaction },
  { path: '/suppliers', component: Suppliers },
  { path: '/category', component: Category },
  { path: '/reportsims', component: ReportsIMS },
  { path: '/reportsims/summary', component: SummaryReport },
  { path: '/reportsims/lowStock', component: LowStockReport },
  { path: '/homesms', component: HomeSMS },
  { path: '/createorder', component: CreateOrder },
  { path: '/ordershistory', component: OrdersHistory },
  { path: '/reportssms', component: ReportsSms },
  { path: '/reportssms/sales', component: SalesReportSMS },
  { path: '/reportssms/history', component: HistoryReportSMS },
  { path: '/dashboard', component: Dashboard },
  { path: '/users', component: Users }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;