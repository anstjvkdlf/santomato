<template>
    <footer class="carpool-footer">
      <section class="carpool-footer-links d-flex justify-content-center">
        <!-- 카풀 생성 링크 -->
        <router-link to="/carpool" class="footer-link" :class="{ active: isActive('/carpool') }">
          <span class="material-icons">directions_car</span>
          <span class="link-text">카풀 생성</span>
        </router-link>
        <!-- 카풀 찾기 링크 -->
        <router-link to="/carpool-find" class="footer-link" :class="{ active: isActive('/carpool-find') }">
          <span class="material-icons">search</span>
          <span class="link-text">카풀 찾기</span>
        </router-link>
        <!-- 채팅 링크 -->
        <router-link to="/chat" class="footer-link" :class="{ active: isActive('/chat') }">
          <span class="material-icons">forum</span>
          <span class="link-text">채팅</span>
        </router-link>
      </section>
    </footer>
  </template>
  
  <script>
  
  export default {
    setup() {
      const isActive = (path) => window.location.pathname === path;
  
      return {
        isActive,
      };
    },
  };
  </script>
  
  <style scoped>
  .carpool-footer {
    background-color: #f8f9fa; /* 전체 페이지 Footer와 동일한 색상 */
    padding: 15px 0;
    border-top: 1px solid #ddd;
    max-width: 300px;
    width: 100%;
  }
  
  .carpool-footer-links {
    display: flex;
    gap: 40px; /* 링크 간 간격 설정 */
    justify-content: center;
  }
  
  .footer-link {
    font-size: 1.5rem; /* 아이콘의 크기를 키움 */
    text-decoration: none;
    color: #6c757d; /* 링크 텍스트를 회색으로 설정 */
    font-weight: 500;
    transition: color 0.3s ease-in-out, transform 0.2s ease-in-out;
    display: flex;
    flex-direction: column; /* 아이콘과 텍스트를 세로로 배치 */
    align-items: center;
  }
  
  .footer-link i {
    font-size: 2rem; /* 아이콘 크기 설정 */
    color: #6c757d; /* 아이콘 색상을 회색으로 설정 */
  }
  
  .link-text {
    font-size: 0.8rem; /* 아이콘 아래에 표시되는 텍스트의 크기 */
    margin-top: 5px; /* 아이콘과 텍스트 사이의 간격 */
    color: #6c757d; /* 텍스트 색상 */
  }
  
  .footer-link.active {
    font-weight: bold;
    color: #0056b3;
  }
  
  .footer-link:hover {
    color: #0056b3;
    transform: scale(1.05); /* 호버 시 살짝 확대 */
  }

.material-icons {
  font-size: 30px;
  color: gray; 
}
  </style>
  