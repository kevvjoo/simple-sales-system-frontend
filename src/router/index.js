import { createRouter, createWebHistory } from 'vue-router';
import Customers from '../views/Customers.vue';
import Products from '../views/Products.vue';

const routes = [
    { path: '/', redirect: '/products' },
    { path: '/customers', component: Customers },
    { path: '/products', component: Products },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;