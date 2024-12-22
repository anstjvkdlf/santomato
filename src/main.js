import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia'
import fetchAndSaveProjectStats from '@/utils/fetchProjectStats.js'
import fetchAndSaveUserLocation from '@/utils/fetchUserLocation.js'
import onlineHandler from '@/utils/onlineHandler.js'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Chart from 'primevue/chart';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMagnifyingGlass, faCar, faComments } from '@fortawesome/free-solid-svg-icons';
import 'primeicons/primeicons.css'; // PrimeIcons
import 'primeflex/primeflex.css'; // PrimeFlex
import ToastService from 'primevue/toastservice';

import App from './App.vue';
import router from './router';

library.add(faMagnifyingGlass, faCar, faComments);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router);
app.use(Chart);
app.use(ToastService);
// app.use(PrimeVue);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false || 'none',
  }
  }
});

app.mount('#app');

fetchAndSaveUserLocation()
fetchAndSaveProjectStats()
onlineHandler()