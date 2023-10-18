import axios from 'axios';
import router from '../../router';
import { ref } from 'vue';

const authenticatedUser = ref(null);
initializeUser();

function initializeUser() {
    axios.get('http://localhost:8081/api/sessions')
        .then(response => {
            if (response.data.length > 0) {
                authenticatedUser.value = response.data[response.data.length - 1];
            }
        })
        .catch(error => {
            console.error(error);
        });
}

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth) && !authenticatedUser.value) {
        next('/login');
    }
    next();
});

export default {
    authenticatedUser,
    initializeUser
};