import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
    {
        path: '/',
        name: 'landing',
        component: LandingView
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminView,
        // Simple simulated auth check
        beforeEnter: (to, from, next) => {
            const isAuthenticated = localStorage.getItem('is_auth') === 'true'
            if (to.name === 'admin' && !isAuthenticated) {
                // We'll handle showing a login form inside AdminView if not auth
                // but this is just a placeholder for logic
                next()
            } else {
                next()
            }
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router
