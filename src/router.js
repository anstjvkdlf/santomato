
import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import MountainDetail from './components/MountainDetail.vue';
import LiveChat from './views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/carpool',
    name: 'livechat',
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
  routes
});

export default router;