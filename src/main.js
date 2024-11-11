import './assets/main.css';
import '@/index.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia'
import fetchAndSaveProjectStats from '@/utils/fetchProjectStats.js'
import fetchAndSaveUserLocation from '@/utils/fetchUserLocation.js'
import onlineHandler from '@/utils/onlineHandler.js'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Chart from 'primevue/chart';

import 'primeicons/primeicons.css'; // PrimeIcons
import 'primeflex/primeflex.css'; // PrimeFlex

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia())
app.use(router);
app.use(Chart);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});

app.mount('#app');

fetchAndSaveUserLocation()
fetchAndSaveProjectStats()
onlineHandler()