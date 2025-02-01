<script setup lang="ts">
import SiteName from "@/components/SiteName.vue"
import Footer from "@/components/Footer.vue"
import CarpoolFooter from '@/components/CarpoolFooter.vue';
import Advertise from "@/components/Advertise.vue";

import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { userStore } from '@/store';

const searchTerm = ref('');
function updateSearchTerm(newTerm) {
  searchTerm.value = newTerm;
}

// 현재 경로가 /carpool 또는 /chat일 때만 CarpoolFooter를 렌더링하도록 설정
const route = useRoute();
const showCarpoolFooter = computed(() => route.path === '/carpool' || route.path === '/carpool/search' || route.path === '/carpool/search/carpool' || route.path === '/carpool/search/companion' || route.path === '/chat');


// 로그인 상태 확인
const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true');

async function checkAuthStatus() {
  const user = userStore();
  try {
    const response = await axios.get('https://backend.santomato.com/user/auth/', {
          withCredentials: true,
        }); // 서버에서 인증 상태 확인
    if (response.status === 200) {
      user.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true'); // 로그인 상태 동기화
    }
  } catch (error) {
    user.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn'); // 로그아웃 상태 동기화
  }
}

onMounted(() => {
  checkAuthStatus(); // 페이지 로드 시 인증 상태 확인
});
</script>

<template>
  <main>
    <div class="container">
      <div class="sitename-container">
        <SiteName :searchTerm="searchTerm" @update-search-term="updateSearchTerm" />
      </div>
      <Advertise></Advertise>
      <!-- <v-header/> -->
        <router-view :searchTerm="searchTerm"></router-view>
      <!-- 특정 페이지에서만 Carpool Footer 렌더링 -->
      <CarpoolFooter v-if="showCarpoolFooter" />
      <!-- <v-footer/> -->
      <Footer></Footer>
    </div>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>