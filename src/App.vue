<script setup lang="ts">
import SiteName from "@/components/SiteName.vue"
import Footer from "@/components/Footer.vue"
import CarpoolFooter from '@/components/CarpoolFooter.vue';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import Advertise from "@/components/Advertise.vue";

const searchTerm = ref('');
function updateSearchTerm(newTerm) {
  searchTerm.value = newTerm;
}

// 현재 경로가 /carpool 또는 /chat일 때만 CarpoolFooter를 렌더링하도록 설정
const route = useRoute();
const showCarpoolFooter = computed(() => route.path === '/carpool' || route.path === '/chat');

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