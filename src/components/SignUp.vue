<template>
    <div class="container mt-5">
      <h2 class="mb-4">일반회원가입</h2>
      <!-- <p class="text-secondary">sns계정으로 간편하게 회원가입</p>
      <button class="kakao-btn" @click="loginWithKakao">
          <img src="@/assets/btn_kakao.png" alt="" />
        </button>     -->
        <div class="form-group-email">
          <label for="email">이메일</label>
          <input type="email" id="email" name="email" v-model="email" class="form-control input-email" placeholder="이메일" required>
          <button type="btn btn-secondary" class="btn btn-primary btn-block" @click="sendAuthNumber" :disabled="!isEmailFilled">
          이메일 인증하기
          </button>
        </div>
        <!-- If emailVerificationRequested is true, show the verification container -->
        <div v-if="showAuthForm">
          <div class="form-group-email verificationCode-form">
          <label for="verificationCode">인증번호</label>
          <div class="verificationCode-input">
          <input type="text" id="verificationCode" v-model="auth_number" class="form-control" placeholder="인증번호" required>
          <button type="button" class="btn btn-primary confirm-btn" @click="confirmVerificationCode">확인</button>
          </div>
          <button type="button" class="btn btn-link resend-btn" @click="sendAuthNumber">이메일 재전송하기</button>
      </div>
        </div>
        <!-- End of verification container -->
        <div v-if="isVerificationCode">
        <form @submit.prevent="signup">
        <div class="form-group">
          <label for="username">아이디</label>
          <input type="username" id="username" name="username" v-model="username" class="form-control" placeholder="영문+숫자 6자 이상" >
          <button type="submit" class="btn btn-primary" @click="checkUsername">중복확인</button>
          <p v-if="usernameError" class="text-danger">{{ usernameError }}</p>
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" name="password" v-model="password" class="form-control" placeholder="영문+숫자 8자 이상" >
          <p v-if="passwordError" class="text-danger">{{ passwordError }}</p>
        </div>
        <div class="form-group">
          <label for="password">비밀번호 확인</label>
          <input type="password" id="password_check" name="password_check" v-model="password_check" class="form-control" placeholder="비밀번호 확인" >
          <p v-if="passwordCheckError" class="text-danger">{{ passwordCheckError }}</p>
        </div>
        <div class="form-group">
          <label for="nickname">닉네임</label>
          <input type="nickname" id="nickname" name="nickname" v-model="nickname" class="form-control" placeholder="별명 (2~15자)">
          <p v-if="nicknameCheckError" class="text-danger">{{ nicknameCheckError }}</p>
        </div>
        <button type="submit" class="btn btn-primary btn-block" :disabled="!isFormValid">Sign Up</button>
      </form>
    </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { userStore } from '@/store';
  import router from '@/router';
  export default {
    name: 'SignUp',
    data() {
      return {
        username: '',
        email: '',
        password: '',
        password_check: '',
        passwordError: '',
        passwordCheckError: '',
        showAuthForm: false,
        nicknameCheckError: '',
        csrftoken: '',
        isVerificationCode: false,
        isUserNameValid: false
      };
    },
    computed: {
      isEmailFilled() {
      return this.email.trim() !== '';
    },
    isUserNameValid() {
      return this.isUserNameValid = true;
    },
    isFormValid() {
      return true
      // return this.isUserNameValid == true && this.email.trim() !== '' && this.password.trim() !== '' && this.password_check.trim() !== '';
    },
    },
    methods: {
      checkUsername() {
          axios.get(`http://localhost:8000/user/username/${this.username}`)
            .then(response => {
              // 서버로부터 받은 응답을 alert로 표시
              alert(response.data.message);
              console.log(response.data.message);
              this.isUserNameValid = true;
            })
            .catch(error => {
              // 에러가 발생한 경우에도 alert로 표시
              alert('중복 확인 에러');
              console.error('중복확인', error);
            });
        },
        sendAuthNumber() {
            // Axios를 사용하여 Django로부터 CSRF 토큰을 요청
            axios.get('http://localhost:8000/user/get_csrf_token/')
                .then(response => {
                    // 추출한 CSRF 토큰을 모든 Axios 요청의 기본 헤더에 추가
                    this.csrftoken = response.data.csrf_token;
                    axios.defaults.headers.common['X-CSRFTOKEN'] = this.csrftoken 

                    // 이제 CSRF 토큰이 설정되었으므로 비밀번호 재설정 요청을 보낼 수 있음
                    axios.post('http://localhost:8000/user/register/auth/', { email: this.email })
                        .then(response => {
                            console.log(response.data.message);
                            this.showAuthForm = true;
                        })
                        .catch(error => {
                            alert(error.response.data.error);
                            console.error('인증 번호 요청 실패:', error);
                        });
                })
                .catch(error => {
                    console.error('CSRF 토큰을 가져오는 데 실패했습니다.', error);
                });
    },
      async signup() {
        // Password validation
        if (this.password.length < 8 || !/[0-9]/.test(this.password) || !/[A-Za-z]/.test(this.password)) {
          this.passwordError = '영문, 숫자를 포함한 8자 이상의 비밀번호를 입력하세요.';
        } else {
          this.passwordError = '';
        }
  
        // Password confirmation validation
        if (this.password !== this.password_check) {
          this.passwordCheckError = '비밀번호가 일치하지 않습니다.';
        } else {
          this.passwordCheckError = '';
        }
        
        // Implement your check Nickname logic here
        // this.nicknameCheckError = '이미 사용중인 별명입니다.';
  
        if (!this.passwordError && !this.passwordCheckError && !this.nicknameCheckError) {
          try {
            console.log(this.username)
            const response = await axios.post('http://localhost:8000/user/register/', {
              username: this.username,
              email: this.email,
              password: this.password,
              nickname: this.nickname,
              is_store_owner: false,
            });
            console.log('Signup successful:', response.data, this.isStoreOwner);
            alert('회원가입이 완료되었습니다.');
            router.push('/');
            // Handle successful signup, e.g., redirect to login page
          } catch (error) {
            console.error('Signup error:', error);
            // Handle signup error, e.g., display error message
          }
        }
  
      },
  
      requestEmailVerification() {
        // Implement your email verification request logic here
        // Set emailVerificationRequested to true to show the verification container
        this.emailVerificationRequested = true;
      },
  
      confirmVerificationCode() {
        axios.get(`http://localhost:8000/user/register/auth/${this.email}/${this.auth_number}`)
        .then(response => {
          console.log(this.email, this.auth_number)
          if (response.status === 200) {
            alert('인증번호가 일치합니다.');
            this.isVerificationCode = true
          } else {
            alert('인증 번호가 일치하지 않습니다.');
            console.error('인증 번호가 일치하지 않습니다.');
          }
        })
        .catch(error => {
          alert('인증번호가 일치하지 않습니다.');
          console.error('API 호출 실패:', error);
        });

      },
  
      loginWithKakao() {
        Kakao.Auth.authorize({
          redirectUri: 'http://localhost:8080/',
        });
        const store = userStore(); // Access the store using the useStore function
        store.isLoggedIn = true; // Update the isLoggedIn property in the store
      },
    },
  };
  </script>
  
  <style scoped>
  /* You don't need 'scoped' since Bootstrap classes are global */
  
  .container {
    width: 100%;
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
  }
  
  h2 {
    text-align: left;
    margin-bottom: 20px;
  }
  
  .text-secondary{
    text-align: center;
  }
  
  .kakao-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    padding: 0; /* Remove padding */
    border: none; /* Remove border */
    background: none; /* Remove background */
    margin: auto;
    margin-bottom: 40px;
  }
  
  .kakao-btn img {
    width: 100%; 
    height: 100%; 
  }

  .form-group {
    width: 100%;
    margin-bottom: 20px;
  }

  .form-group input {
    width: 100%;
    margin-bottom: 10px; 
  }

  .form-group-email {
    width: 60%;
    margin-bottom: 20px;
  }

  .input-email {
    margin-bottom: 10px; 
  }

  .verificationCode-form {
    background-color: whitesmoke;
    border-radius: 8px;
    padding: 15px;
    width: 100%;
  }

  .verificationCode-input {
    position: relative;
  }

  .verificationCode-input input {
    width: calc(100% - 90px);  /* 확인 버튼 공간 확보 */
  }
  
  .verificationCode-form label {
      padding: 5px 5px; 
    }
  
  .confirm-btn {
    position: absolute;
    width: 80px;
    height: 30px;
    top: 0;
    bottom: 0;
    right: 10px;
    margin: auto 0;
    border-radius: 3px;
    font-size: 80%;
    display: flex;   
    justify-content: center; 
    align-items: center;    
    padding: 0;    
  }
  
  label {
    font-weight: bold;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="nickname"]{
    width: 100%;
  }
  
  button {
    width: 100%;
    box-sizing: border-box; 
  }
  </style>
  