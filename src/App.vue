<script setup lang="ts">
import SiteName from "@/components/SiteName.vue"
import Footer from "@/components/Footer.vue"
import { ref } from 'vue';
import Advertise from "@/components/Advertise.vue";
const searchTerm = ref('');
function updateSearchTerm(newTerm) {
  searchTerm.value = newTerm;
}
import vHeader from "@/liveChatcomponents/vHeader.vue"
import VFooter from "@/livechatcomponents/vFooter.vue"

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
