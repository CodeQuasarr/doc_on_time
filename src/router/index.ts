import HomeView from "../views/HomeView.vue";
import {createRouter, createWebHistory} from "vue-router";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import Dashboard from "../views/Dashboard.vue";
import AppointmentBooking from "../views/AppointmentBooking.vue";
import DoctorAvailabilities from "../views/DoctorAvailabilities.vue";
import "vue-router";
import Error404 from "../../Error404.vue";

declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean;
        requiresGuest?: boolean;
        role?: string[];
    }
}
const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView, meta: { requiresGuest: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { requiresGuest: true } },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true, role: ['ROLE_PATIENT', 'ROLE_DOCTOR'] }},
    {
        path: '/doctor/availabilities', name: 'doctor-availabilities', component: DoctorAvailabilities, meta: { requiresAuth: true, role: ['ROLE_DOCTOR'] }
    },
    { path: "/:pathMatch(.*)*", name: "Error404", component: Error404 },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guard
router.beforeEach((to, _from, next) => {
    const isAuthenticated = !!localStorage.getItem('user-token')
    const userRole = JSON.parse(localStorage.getItem('user-roles') || '[]');
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
    if (to.meta.role && !hasRole(to.meta.role, userRole)) {

        next('/');
        return;
    }
    next()
})


function hasRole(toMetaRoles: string[], userRoles: string[]): boolean {
    return toMetaRoles.some(role => userRoles.includes(role));
}
export default router
