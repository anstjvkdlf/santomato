<template>
  <div class="site-name">
    <div class="header-container">
      <div class="title-container">
        <router-link to="/">
          <img src="@/assets/logo.png" class="logo">
        </router-link>
      </div>
      <input v-if="!isMobileView" class="searchTab" type="text" :value="searchTerm" placeholder="산 이름으로 검색하기" @input="updateTerm">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <input
            class="searchTab"
            type="text"
            :value="searchTerm"
            placeholder="산 이름으로 검색하기"
            @input="updateTerm"
          />
          <div class="button-container">
            <button @click="closeSearchModal">검색</button>
          </div>
        </div>
      </div>

      <div class="rank">
        <Rank/>
      </div>
      <router-link to="/carpool" class="carpool">
        <img src="@/assets/카풀로고.png" class="carpool-logo">
      </router-link>
      <div class="auth-container">
        <Button v-if="!isLoggedIn" class="auth-button login-button"><router-link to="/login">로그인</router-link></Button>
        <Button v-if="isLoggedIn" class="auth-button logout-button" @click="logout">로그아웃</Button>
      </div>
      <div v-if="isMobileView" class="search-icon" @click="openSearchModal">
        <font-awesome-icon icon="magnifying-glass" />
      </div>
    </div>
  </div>
</template>

<script>
import Rank from '@/components/Rank.vue';
import { userStore } from '@/store';
import axios from 'axios';
import router from '@/router';
import Button from 'primevue/button';
export default {
  props: {
    searchTerm: String,
  },
  components: {
    Rank,
    Button,
  },
  data() {
    return {
      isMobileView: window.innerWidth <= 767,
      showModal: false,
    };
  },
  methods: {
    updateTerm(event) {
      this.$emit('update-search-term', event.target.value);
    },
    openSearchModal() {
      this.showModal = true; // 모달 열기
      console.log(this.showModal);
    },
    closeSearchModal() {
      this.showModal = false; // 모달 닫기
      console.log(this.showModal);
    },
    checkMobileView() {
      this.isMobileView = window.innerWidth <= 767;
      console.log(this.isMobileView);
    },
    kakaoLogout() {
    axios.delete('http://localhost:8000/user/kakao/callback/', 
        { access_token : this.$route.query.code })
        .then(response => {
          console.log('Django 서버로부터의 응답:', response.data);
          // 이후의 로직 수행
        })
        .catch(error => {
          console.error('오류 발생:', error);
        });
    },
    logout() {
      axios.delete('http://localhost:8000/user/auth/')
      .then(response => {
        console.log('Django 로 부터 응답:',response.data);
        const store = userStore();
        store.isLoggedIn = false;
        router.push('/');
      })
      .catch(error => {
        console.error('오류 발생:',error)
      })
    }
  },
  mounted() {
    window.addEventListener("resize", this.checkMobileView);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkMobileView);
  },
  computed: {
    isLoggedIn() {
      const user = userStore();
      console.log(user.isLoggedIn)
      return user.isLoggedIn;
    },
  },
};
</script>

<style scoped>

.search-icon {
  font-size: 24px;
  cursor: pointer;
  margin-right: 1rem;
}


/* 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px; /* 둥근 모서리 */
  width: 80%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15); /* 그림자 효과 */
  animation: fadeIn 0.3s ease; /* 페이드 인 애니메이션 */
}

.button-container {
  justify-content: center;
}


/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 10px;
  outline: none;
  transition: border-color 0.3s;
}

.modal-content input:focus {
  border-color: #007BFF; /* 포커스 시 테두리 색상 */
}

.modal-content button {
  margin-top: 15px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #007BFF; /* 버튼 배경색 */
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-content button:hover {
  background-color: #0056b3; /* 호버 시 색상 */
}

.site-name {
  display: flex;
  flex-direction: column;
  align-items: left;
}

.header-container {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  position: relative;
  justify-content: flex-start;
}

.title-container {
  display: flex;
  align-items: center;
  margin-right: auto; /* Pushes other elements to the right */
}

.carpool {
  display: flex;
  align-items: center;
  margin-right: 100px;
}

.rank {
  display: flex;
  align-items: center;
  transform: scale(0.8); /* Reduces size */
}

.logo {
  width: 200px;
}

.carpool-logo {
  width: 100px;
}
input{
  width: 25%;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid #ccc;
  text-align: center;
  margin-bottom: 1rem;
  margin: 2%;
  outline: none;
  transition: border-color 0.3s;
}

/* input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none; /* 포커스를 받을 때의 기본 outline 제거 */
  /* transition: border-color 0.3s;  */
  /* 테두리 색상 변경 시 부드럽게 */
/* }  */

/* 포커스 상태에서 테두리 색상 변경 */
input:focus {
  border-color: var(--text-blue); /* 포커스 시 색상 변경 */
}

/* 커서 모양 설정 */
input::placeholder {
  color: #aaa; /* 플레이스홀더 색상 */
}

/* 전체 효과 */
input:focus::placeholder {
  opacity: 0; /* 포커스 시 플레이스홀더 숨기기 */
}

.auth-container {
  margin-left: auto;
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-right: 10px;
}

.auth-button {
  transition: background-color 0.3s;
  width: 100px;
  font-size: 12px;
}

.login-button {
  background-color: #4CAF50 !important; /* 초록색 */
  border-color: #4CAF50 !important;
  color: white !important;
}

.login-button:hover {
  background-color: #45a049 !important; /* 약간 더 어두운 초록색 */
  border-color: #45a049 !important;
}

.login-button :deep(a) {
  color: white !important;
  text-decoration: none;
}

.logout-button {
  background-color: #808080 !important; /* 회색 */
  border-color: #808080 !important;
  color: white !important;
}

.logout-button:hover {
  background-color: #707070 !important; /* 약간 더 어두운 회색 */
  border-color: #707070 !important;
}

/* Adjustments for mobile screens */
@media only screen and (max-width: 767px) {
  .header-container {
    padding: 0 5px; /* Minimize padding */
    justify-content: space-between; /* Center elements closely */
  }

  .searchTab {
    width: 100%; /* Make searchTab take full width */
    margin-top: 1rem;
  }

  .title-container,
  .rank
  .carpool {
    width: 100%;
    margin: 0; /* Remove excess margins */
  }
  .carpool {
    margin-right: 5px;
  }

  .logo,
  .carpool-logo {
    width: 80px; /* Reduce size of logos for a tighter fit */
  }
  .ranking-container {
    width: 100px;
    margin: 0px;
  }
  .rank {
    transform: scale(0.5); /* Scale down rank further */
    margin: -5px -15px;
  }
  .auth-container{
    margin-right: 5px;
  }
  .auth-button {
    font-size: 10px;
    width: 60px;
    padding: 0.2rem 0.4rem;
  }
}
</style>
