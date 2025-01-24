import HomeView from "../views/HomeView.vue";
import {createRouter, createWebHistory} from "vue-router";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";


const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
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
