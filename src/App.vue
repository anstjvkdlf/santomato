<script setup>
import SiteName from "@/components/SiteName.vue";
</script>

<template>
  <main>
    <div class="container">
      <div class="sitename-container">
        <SiteName/>
      </div>
      <router-view></router-view>
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
