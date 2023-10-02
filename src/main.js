import { createApp } from 'vue';
import App from '../views/App.vue';  // adjust the path if App.vue is located elsewhere
import { store } from './store.js';
import router from '../router';  // if you have a router setup, ensure the path is correct


import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App);
app.component('VueDatePicker', VueDatePicker);

app.use(store).use(router).mount('#app');
