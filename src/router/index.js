import { createRouter, createWebHistory } from 'vue-router';
import Customers from '../views/Customers.vue';

const routes = [
    { path: '/', redirect: '/products' },
    { path: '/customers', component: Customers },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;