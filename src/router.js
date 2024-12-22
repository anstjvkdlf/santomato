
import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import MountainDetail from './components/MountainDetail.vue';
import Carpool from './components/Carpool.vue';
import SearchCarpool from './components/SearchCarpool.vue';
import SearchCompanion from './components/SearchCompanion.vue';
import CarpoolSelect from './components/CarpoolSelect.vue';
import LiveChat from './views/HomeView.vue';
import Login from './components/Login.vue';
import SignUp from './components/SignUp.vue';
import Profile from './components/Profile.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/carpool',
    name: 'Carpool',
    component: Carpool,
  },
  {
    path: '/search_carpool',
    name: 'CarpoolSelect',
    component: CarpoolSelect,
  },
  {
    path: '/search_carpool/carpool',
    name: 'SearchCarpool',
    component: SearchCarpool,
  },
  {
    path: '/search_carpool/companion',
    name: 'SearchCompanion',
    component: SearchCompanion,
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
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile
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