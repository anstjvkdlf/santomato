
import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import MountainDetail from './components/MountainDetail.vue';
import Carpool from './components/Carpool.vue';
import CarpoolSelect from './components/CarpoolSelect.vue';
import LiveChat from './views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/carpool',
    name: 'CarpoolSelect',
    component: CarpoolSelect,
  },
  {
    path: '/carpool/:type',
    name: 'Carpool',
    component: Carpool,
    props: true
  },
  {
    path: "/chat",
    name: "LiveChat",
    component: LiveChat,
  },
  {
    path: '/detail/:id',
    name: 'MountainDetail',
    component: MountainDetail,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.path.startsWith('/detail')) {
      return { top: 0 };
    }
    return savedPosition ; 
  },
});

export default router;