<template>
  <div class="login-page">
    <form class="login" @submit.prevent="login">
      <div class="mb-3">
        <IftaLabel>
          <input type="username" class="form-control" v-model="username" id="username" aria-describedby="usernameHelp">
          <label for="username">아이디</label>
        </IftaLabel>
      </div>
      <div class="mb-3">
        <IftaLabel>
          <input type="password" class="form-control" v-model="password" id="password">
          <label for="password">비밀번호</label>
        </IftaLabel>
      </div>

      <div class="mb-3 form-check remember-me-container">
        <input type="checkbox" class="form-check-input remember-me-checkbox" id="rememberMe" v-model="rememberMe">
        <label class="form-check-label remember-me-label" for="rememberMe">로그인 상태 저장</label>
      </div>

      <button type="submit" class="btn btn-primary login-button">로그인</button>
    </form>

    <div class="bottom">
      <button class="storeLoginBtn" @click="togglePassWordReset">비밀번호찾기</button>
      <span class="divider">|</span>
      <button class="storeLoginBtn" @click="toggleSignUp">회원가입</button>
    </div>
    <!-- <button class="kakao" @click="loginWithKakao">
      <img src="@/assets/kakao_login.png" alt="">
    </button> -->
  </div>
</template>

<script>
import router from '@/router';
import axios from 'axios';
import {
  userStore
} from '@/store';
import InputText from 'primevue/inputtext';
import IftaLabel from 'primevue/iftalabel';

export default {
  components: {
    InputText,
    IftaLabel,
  },
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false, // "로그인 상태 저장" 체크 여부
    };
  },
  methods: {
    togglePassWordReset() {
      router.push('/passwordReset')
    },
    toggleLogin() {
      router.push('/profile');
    },
    toggleLogin() {
      router.push('/profile');
    },
    async login() {
      try {
        console.log(this.rememberMe)
        const response = await axios.post('http://localhost:8000/user/auth/', {
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe, 
          }, {
            withCredentials: true
          });

        const user = userStore();
        user.isLoggedIn = true;
        localStorage.setItem('isLoggedIn', true);
        router.push('/');
      } catch (error) {
        console.error('Login error:', error);
        alert(error.response.data);
      }
    },
    setCookie(name, value) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);

      document.cookie = `${name}=${value};expires=${expirationDate.toUTCString()};path=/`;
    },

    loginWithKakao() {
      Kakao.Auth.authorize({
        redirectUri: 'http://localhost:8080/', // 카카오 로그인 후 리다이렉트할 주소
      })
    },
    toggleSignUp() {
      router.push('/signUp');
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  /* This will center vertically and take the full viewport height */
}

.login {
  text-align: center;
  width: 100%; 
  max-width: 300px; 
}

.bottom {
  margin: 10px;
}

.kakao {
  width: auto;
  padding: 0;
  border: none;
  background: none;
  margin-top: 10px;
}

.storeLogin {
  margin-top: 20px;
}

.storeLoginBtn {
  padding: 0;
  border: none;
  background: none;
  margin: 0 5px;
}

.form-control {
  height: 50px;
}

.divider {
  margin: 0 10px;
  color: #ccc;
}

.form-control {
  display: flex;
  align-items: flex-end;
  padding-bottom: 5px;
  text-align: left;
}

.p-iftalabel {
  display: flex;
  flex-direction: column-reverse !important;
}

.login-button {
  width: 100%;
}

.remember-me-container {
  display: flex; 
  align-items: center; 
  justify-content: flex-start; 
}

.remember-me-checkbox {
  width: 16px; 
  height: 16px; 
  margin-right: 5px; 
}

.remember-me-label {
  text-align: left;
  font-size: 14px;
}
</style>
