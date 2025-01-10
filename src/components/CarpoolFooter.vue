<template>
  <footer class="carpool-footer">
    <section class="carpool-footer-links d-flex justify-content-center">
      <router-link to="/carpool?step=0" class="footer-link" :class="{ active: selectedMenu === 'carpool' }"
      @click="updateSelectedMenu('carpool')">
        <div class="icon-wrapper">
          <font-awesome-icon icon="car" />
        </div>
        <span class="link-text">동행 생성</span>
      </router-link>
      <router-link to="/carpool/search" class="footer-link" :class="{ active: selectedMenu === 'search' }"
      @click="updateSelectedMenu('search')">
        <div class="icon-wrapper">
          <font-awesome-icon icon="magnifying-glass" />
        </div>
        <span class="link-text">동행 찾기</span>
      </router-link>
      <router-link to="/chat" class="footer-link" :class="{ active: selectedMenu === 'chat' }"
      @click="updateSelectedMenu('chat')">
        <div class="icon-wrapper">
          <font-awesome-icon icon="comments" />
        </div>
        <span class="link-text">채팅</span>
      </router-link>
    </section>
  </footer>
</template>
  
<script>
import { ref } from 'vue';
    
  export default {
    setup() {
      const selectedMenu = ref('carpool');

      const isActive = (menu) => {
        return selectedMenu.value === menu;
      };

      const updateSelectedMenu = (menu) => {
        selectedMenu.value = menu;
      };
  
      return {
        isActive,
        selectedMenu,
        updateSelectedMenu,
      };
    },
  };
  </script>
  
<style scoped>
.carpool-footer {
  background-color: #f8f9fa;
  padding: 15px 0;
  border-top: 1px solid #ddd;
  max-width: 500px;
  width: 100%;
}

.carpool-footer-links {
  display: flex;
  gap: 40px;
  justify-content: center;
}

.footer-link .svg-inline--fa {
  width: 20px; 
  height: 20px;
}

.icon-wrapper {
  position: relative;
  z-index: 1;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  background-color: transparent;
}

.footer-link {
  position: relative;  
  text-decoration: none;
  color: #6c757d;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
}

.footer-link.active .icon-wrapper {
  background-color: rgba(42, 170, 138, 0.2);
}

.footer-link.active .svg-inline--fa {
  color: #2AAA8A;
}

.footer-link:hover .icon-wrapper {
  background-color: #E6FFE6;
}

.link-text {
  font-size: 0.8rem;
  margin-top: 5px;
}
</style>