<script setup lang="ts">
import SiteName from "@/components/SiteName.vue";
import Footer from "@/components/Footer.vue"
</script>

<template>
  <main>
    <div class="container">
      <div class="sitename-container">
        <SiteName/>
      </div>
      <router-view></router-view>
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
