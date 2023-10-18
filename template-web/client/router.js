// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "./src/views/Home.vue";
import Login from "./src/views/Login.vue";
import Dashboard from "./src/views/Dashboard.vue";
import About from "./src/views/About.vue";
import Settings from "./src/views/Settings.vue";
import PrivacyPolicy from "./src/views/privacy/PrivacyPolicy.vue";
import TermsOfService from "./src/views/privacy/TermsOfService.vue";
import Signup from "./src/views/SignUp.vue";
import { useStore } from "vuex";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login, meta: { requiresAuth: false }},
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/about", component: About },
  { path: "/settings", component: Settings, meta: { requiresAuth: true } },
  { path: "/policy", component: PrivacyPolicy },
  { path: "/terms", component: TermsOfService },
  { path: "/signup", component: Signup, meta: { requiresAuth: false } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// router.beforeEach((to, from, next) => {
//       const store = useStore();
//       const loggedIn = store.state.authenticated;

//       if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
//         next("/login");
//       }
//       next();
//     }
// );

export default router;