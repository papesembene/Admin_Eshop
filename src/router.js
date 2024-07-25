import Index from "./Pages/Index.vue";
import ProductForm from "./Pages/Products/Form.vue";
import ProductIndex from "./Pages/Products/Index.vue";
import CategorieForm from "./Pages/Categories/Form.vue";
import CategorieIndex from "./Pages/Categories/Index.vue";
import CustomerForm from "./Pages/Customers/Form.vue";
import CustomerIndex from "./Pages/Customers/Index.vue";
import OrderIndex from "./Pages/Orders/Index.vue";
import Dashboard from "./Pages/Dashboard.vue";
import {createRouter, createWebHistory} from "vue-router";


const routes = [
    {
        path: '/',
        component: Index
    },
    {
        path: '/products/create',
        component: ProductForm
    },
    ,
    {
        path: '/products/index',
        component: ProductIndex
    },
    ,
    {
        path: '/categories/create',
        component: CategorieForm
    },
    {
        path: '/categories/index',
        component: CategorieIndex
    },
    ,
    {
        path: '/customers/create',
        component: CustomerForm
    },
    {
        path: '/customers/index',
        component: CustomerIndex
    },
    ,
    {
        path: '/orders/index',
        component: OrderIndex
    },
    ,
    {
        path: '/dashboard',
        component: Dashboard
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});




export default router;