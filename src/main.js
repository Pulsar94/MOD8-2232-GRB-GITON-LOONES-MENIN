import { createApp } from 'vue';
import App from '../views/App.vue';  // adjust the path if App.vue is located elsewhere
import { store } from './store.js';
import router from '../router';  // if you have a router setup, ensure the path is correct

createApp(App).use(store).use(router).mount('#app');
