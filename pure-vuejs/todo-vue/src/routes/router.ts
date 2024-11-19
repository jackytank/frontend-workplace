import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import UserPage from "../pages/user/user-page.vue";
import EmployeePage from "../pages/employee/employee-page.vue";
import NotFound from "../components/NotFound.vue";
import TodoPage from "../pages/todo/todo-page.vue";
import DemoVeeValidatePage from "../pages/vee-validate/DemoVeeValidatePage.vue";
import TodoIndexedDBPage from "../pages/todo-indexedDB/TodoIndexedDBPage.vue";
import VitePluginApiRoutesPage from "../pages/vite-plugin-api-routes/VitePluginApiRoutesPage.vue";

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
        path: '/vee-validate',
        component: DemoVeeValidatePage
    },
    {
        path: '/todo-indexedDB',
        component: TodoIndexedDBPage
    },
    {
        path: '/vite-plugin-api-routes',
        component: VitePluginApiRoutesPage
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