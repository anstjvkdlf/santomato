
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
import MyCarpoolRequest from './components/MyCarpoolRequest.vue';
import MyCarpoolAlarm from './components/MyCarpoolAlarm.vue';
import MyCarpoolList from './components/MyCarpoolList.vue';
import MyCarpoolRoom from './components/MyCarpoolRoom.vue';
import ChangePassword from './components/ChangePassword.vue';
import ResetPassword from './components/ResetPassword.vue';

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
    path: '/carpool/search',
    name: 'CarpoolSelect',
    component: CarpoolSelect,
  },
  {
    path: '/carpool/search/carpool',
    name: 'SearchCarpool',
    component: SearchCarpool,
  },
  {
    path: '/carpool/search/companion',
    name: 'SearchCompanion',
    component: SearchCompanion,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/myCarpool',
    name: 'MyCarpoolRoom',
    component: MyCarpoolRoom,
  },
  {
    path: '/profile/changePassword',
    name: 'ChangePassword',
    component: ChangePassword,
  },
  {
    path: '/profile/carpoolRequest',
    name: 'MyCarpoolRequest',
    component: MyCarpoolRequest,
  },
  {
    path: '/profile/carpoolAlarm',
    name: 'MyCarpoolAlarm',
    component: MyCarpoolAlarm,
  },
  {
    path: '/profile/carpoolList',
    name: 'MyCarpoolList',
    component: MyCarpoolList,
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
  },
  {
    path: "/passwordReset",
    name: "ResetPassword",
    component: ResetPassword
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