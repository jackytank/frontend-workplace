import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import UserPage from "../pages/user/user-page.vue";
import EmployeePage from "../pages/employee/employee-page.vue";
import NotFound from "../components/NotFound.vue";
import TodoPage from "../pages/todo/todo-page.vue";

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
        path: '/:pathMatch(.*)*',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;