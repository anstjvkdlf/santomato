<template>
    <div class="login-page">
      <form class="login" @submit.prevent="login">
        <div class="mb-3">
          <input type="username" class="form-control" v-model="username" id="username" aria-describedby="usernameHelp" placeholder="아이디">
        </div>
        <div class="mb-3">
          <input type="password" class="form-control" v-model="password" id="password" placeholder="비밀번호">
        </div>
        <button type="submit" class="btn btn-primary">로그인</button>
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
    import { userStore } from '@/store';
  
    export default {
      name: 'Login',
      data() {
        return {
          username: '',
          password: '',
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
            // console.log(this.username)
            const response = await axios.post('https://backend.santomato.com/user/auth/', {
              username: this.username,
              password: this.password,
            },
            {
              withCredentials: true
            });
            // console.log('Login successful:', response.data);
            // 로그인 성공 시 서버에서 반환한 토큰 값
  
            // 쿠키에 토큰 값을 저장
            // this.setCookie('access', accessToken);
  
            // console.log('Login successful:', response.data);
            const user = userStore();
            user.isLoggedIn = true; // 스토어에 로그인 상태 업데이트
            // console.log("isLoggedIn");
            // console.log(user.isLoggedIn);
            localStorage.setItem('isLoggedIn', true);
            router.push('/'); // 로그인 성공 시 리다이렉트할 페이지
            // 기타 로그인 후 처리 코드...
            // Handle successful login, e.g., store tokens and redirect to dashboard
          } catch (error) {
            console.error('Login error:', error);
            alert(error.response.data);
            // Handle login error, e.g., display error message
          }
        },
        setCookie(name, value) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1); // 예시로 하루 뒤에 만료되도록 설정
  
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
    height: 50vh; /* This will center vertically and take the full viewport height */
  }
  
  .login {
    text-align: center; /* Center-align the form content */
  }
  .bottom {
    margin: 10px;
  }
  .kakao {
    width: auto;
    padding: 0; /* Remove padding */
    border: none; /* Remove border */
    background: none; /* Remove background */
    margin-top: 10px;
  }
  .storeLogin {
    margin-top: 20px;
  }
  .storeLoginBtn {
    padding: 0; /* Remove padding */
    border: none; /* Remove border */
    background: none; /* Remove background */
    margin: 0 5px; /* 버튼 간격 */
  }
  

  .divider {
  margin: 0 10px; /* 구분선 양쪽 여백 */
  color: #ccc; /* 구분선 색상 */
  }
    </style>
    