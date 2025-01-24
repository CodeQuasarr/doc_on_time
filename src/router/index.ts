import HomeView from "../views/HomeView.vue";
import {createRouter, createWebHistory} from "vue-router";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import Dashboard from "../views/Dashboard.vue";


const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView, meta: { requiresGuest: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { requiresGuest: true } },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true, role: 'ROLE_PATIENT' }},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('user-token')
    const userRole = localStorage.getItem('user-roles')

    console.log('to.meta.role', to.meta.role)
    console.log('userRole', userRole)
    console.log('erere', to.meta.role && userRole !== to.meta.role)

    // au cas l'utilisateur est déja connecter
    if (to.meta.requiresGuest && isAuthenticated) {
        next('/dashboard');
        return;
    }
    // au cas l'utilisateur n'est pas connecter
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
        return;
    }
// Si la route a un rôle requis et que le rôle de l'utilisateur ne correspond pas
    if (to.meta.role && !userRole.includes(to.meta.role)) {
        next('/');
        return;
    }
    next()
})

export default router
