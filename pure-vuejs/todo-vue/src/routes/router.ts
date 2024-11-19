import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import UserPage from "../pages/user/user-page.vue";
import EmployeePage from "../pages/employee/employee-page.vue";
import NotFound from "../components/NotFound.vue";
import TodoPage from "../pages/todo/todo-page.vue";
import SsrPage from "../pages/ssr/VitePluginApiRoutes.vue";
import TodoIndexedDBPage from "../pages/todo-idb/TodoIndexedDBPage.vue";
import VitePluginApiRoutes from "../pages/ssr/VitePluginApiRoutes.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: "/user"
    },
    {
        path: "/user",
        component: UserPage
    },
    {
        path: '/employee',
        component: EmployeePage
    },
    {
        path: '/todo',
        component: TodoPage
    },
    {
        path: '/todo-indexedDB',
        component: TodoIndexedDBPage
    },
    {
        path: '/vite-plugin-api-routes',
        component: VitePluginApiRoutes
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound
    }
];

export const menuItems = routes.filter(route => route.path !== '/:pathMatch(.*)*');

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;