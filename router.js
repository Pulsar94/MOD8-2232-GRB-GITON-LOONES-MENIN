// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Dashboard from './views/Dashboard.vue';
import About from './views/About.vue';
import Settings from './views/Settings.vue';
import PrivacyPolicy from './privacy/PrivacyPolicy.vue';
import TermsOfService from './privacy/TermsOfService.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard },
    { path: '/about', component: About },
    { path: '/settings', component: Settings },
    { path: '/policy', component: PrivacyPolicy},
    { path: '/terms', component: TermsOfService},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
