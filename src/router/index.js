import { createRouter, createWebHistory } from 'vue-router';
import Products from '../views/Products.vue';
import Customers from '../views/Customers.vue';
import Sales from '../views/Sales.vue';

const routes = [
    { path: '/', redirect: '/products' },
    { path: '/products', component: Products },
    { path: '/customers', component: Customers },
    { path: '/sales', component: Sales },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;