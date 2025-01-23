import HomeView from "../views/HomeView.vue";
import {createRouter, createWebHistory} from "vue-router";


const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('user-token')
    const userRole = localStorage.getItem('user-role')

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (to.meta.role && userRole !== to.meta.role) {
        next('/')
    } else {
        next()
    }
})

export default router
