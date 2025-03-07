<template>
  <div>
    <Toast position="top-center" />
    <Stepper :value="activeStep.toString()" :model="steps">
    <StepPanels>
    <StepPanel value="0" >
      <!-- Step 0 -->
      <h6 class = "service-title"> 이메일 인증 </h6>
        <div class="form-group-email">
          <input type="email" id="email" name="email" v-model="email" class="form-control input-email" placeholder="이메일 주소" required>
          <button type="submit" class="btn btn-primary" @click="sendAuthNumber" :disabled="!isEmailFilled">인증번호 전송</button>  
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
      </div>
    </StepPanel>

    <StepPanel value="1">
      <!-- Step 1 -->
      <h6 class = "service-title"> 회원가입 </h6>
        <div class="signup-form">
          <form @submit.prevent="handleSignup">
            <div class="form-group">
              <label for="username">아이디</label>
              <input type="username" id="username" name="username" v-model="username" class="form-control" placeholder="영문+숫자 6자 이상" >
              <button  type="button" class="btn btn-primary" @click="checkUsername">중복확인</button>
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
            <div class="p-field">
              <label for="gender">성별</label>
              <Dropdown v-model="gender" :options="genderOptions" optionLabel="label" optionValue="value" placeholder="성별 선택" />
            </div>
            <div class="p-field">
              <label for="birthDate">생년월일</label>
                <div class="birthdate-container">
                  <Dropdown v-model="birthYear" :options="yearOptions" optionLabel="label" optionValue="value" placeholder="년" />
                  <Dropdown v-model="birthMonth" :options="monthOptions" optionLabel="label" optionValue="value" placeholder="월" />
                  <Dropdown v-model="birthDay" :options="dayOptions" optionLabel="label" optionValue="value" placeholder="일" />
                </div>
              </div>
            <div class="p-field">
            <label for="phoneNumber">휴대폰 번호</label>
              <InputMask v-model="phoneNumber" mask="999-9999-9999" placeholder="010-0000-0000" />
            </div>
            <div class="p-field">
              <label for="carInfo">차량 번호</label>
              <div class="car-info-container">
                <InputText v-model="carInfo" :disabled="noCar" placeholder="12가1234" style="width: 150px;" />
                <div class="p-field-checkbox">
                  <input type="checkbox" id="noCar" v-model="noCar" style="margin-left: 10px;" />
                  <label for="noCar" style="margin-left: 5px; font-weight: normal;">차량 없음</label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="nickname">닉네임</label>
              <input type="nickname" id="nickname" name="nickname" v-model="nickname" class="form-control" placeholder="별명 (2~10자)">
              <p v-if="nicknameError" class="text-danger">{{ nicknameError }}</p>
            </div>
            <button type="submit" class="btn btn-primary btn-block" :disabled="!isFormValid">가입하기</button>
          </form>
      </div> 
    </StepPanel>
  </StepPanels>
  </Stepper>
  </div>
</template>
  
  <script>
  import { ref } from "vue";
  import axios from 'axios';
  import { userStore } from '@/store';
  import router from '@/router';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import Dropdown from 'primevue/dropdown';
  import InputMask from 'primevue/inputmask';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import Stepper from "primevue/stepper";
  import StepPanels from 'primevue/steppanels';
  import StepPanel from 'primevue/steppanel';

  export default {
      components: {
      Dropdown,
      InputMask,
      InputText,
      Button,
      Stepper,
      StepPanels,
      StepPanel,
      Toast
    },
    setup() {
      const toast = useToast();
      const activeStep = ref(0);
      const steps = ref([
        { label: 'Step 0' },
        { label: 'Step 1' },
      ]);

      return { 
        toast,
        activeStep,
        steps
      };
    },
    name: 'SignUp',
    data() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 100; 
      const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
      const yearOptions = years.map(year => ({ label: String(year), value: year }));
      
      const monthOptions = Array.from({ length: 12 }, (_, i) => ({ label: String(i + 1), value: i + 1 }));
      const dayOptions = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1), value: i + 1 }));

      return {
        username: '',
        email: '',
        gender: null,
        phoneNumber: '',
        carInfo: '',
        noCar: false,
        nickname:'',
        password: '',
        password_check: '',
        usernameError: '',
        passwordError: '',
        passwordCheckError: '',
        nicknameError: '',
        showAuthForm: false,
        csrftoken: '',
        auth_number:'',
        isVerificationCode: false,
        isUserNameValid: false,
        isNickNameValid: false,
        genderOptions: [
        { label: '남성', value: 'male' },
        { label: '여성', value: 'female' },
        ],
        birthYear: null,
        birthMonth: null,
        birthDay: null,
        yearOptions: yearOptions,
        monthOptions: monthOptions,
        dayOptions: dayOptions,
      }
    },
    computed: {
      isEmailFilled() {
        return this.email.trim() !== '';
      },
      isFormValid() {
        return this.username.trim() !== '' &&
            this.password.trim() !== '' &&
            this.password_check.trim() !== '' &&
            this.gender !== null &&
            this.birthYear !== null &&
            this.birthMonth !== null &&
            this.birthDay !== null &&
            this.phoneNumber.trim() !== '' &&
            (this.noCar || (this.carInfo && this.carInfo.trim() !== '')) &&
            this.nickname.trim() !== '' ;
      },
      birthDate() {
        if (this.birthYear && this.birthMonth && this.birthDay) {
          const month = String(this.birthMonth).padStart(2, '0');
          const day = String(this.birthDay).padStart(2, '0');
          return `${this.birthYear}-${month}-${day}`;
        }
        return null;
      },
    },

    methods: {
      checkUsername() {
        if (this.username.length < 6 || !/[0-9]/.test(this.username) || !/[A-Za-z]/.test(this.username)) {
          this.usernameError = '영문, 숫자를 포함한 6자 이상의 아이디를 입력하세요.';
          return;
        } else {
          this.usernameError = '';
        }
        axios.get(`http://localhost:8000/user/username/${this.username}`)
          .then(response => {
            alert(response.data.message);
            this.isUserNameValid = true;
            this.usernameError = '';
          })
          .catch(error => {
            if (error.response) {
              alert(error.response.data.error);
              this.usernameError = error.response.data.error;
              this.isUserNameValid = false;
            } else {
              alert("중복확인 중 오류 발생");
              this.isUserNameValid = false;
            }
            console.error('중복확인 오류:', error);
          });
        },

      checkNickname() {
        axios.get(`http://localhost:8000/user/nickname/${this.nickname}`)
          .then(response => {
            this.isNickNameValid = true;
            this.nicknameError = '';
          })
          .catch(error => {
            if (error.response) {
              this.nicknameError = error.response.data.error;
              this.isNickNameValid = false;
            } else {
              alert("중복확인 중 오류 발생");
              this.isNickNameValid = false;
            }
            console.error('중복확인 오류:', error);
          });
        },

      sendAuthNumber() {
        if (!this.isValidEmail(this.email)) {
          alert("유효한 이메일 주소를 입력해주세요.");
          return;
        }

        // Axios를 사용하여 Django로부터 CSRF 토큰을 요청
        axios.get('http://localhost:8000/user/get_csrf_token/')
        .then(response => {
            // 추출한 CSRF 토큰을 모든 Axios 요청의 기본 헤더에 추가
            this.csrftoken = response.data.csrf_token;
            axios.defaults.headers.common['X-CSRFTOKEN'] = this.csrftoken 
            this.toast.add({ severity: 'success', summary: '인증번호 전송', detail: '인증번호 전송 시 대기가 발생할 수 있습니다.', life: 3000 });
            // 이제 CSRF 토큰이 설정되었으므로 비밀번호 재설정 요청을 보낼 수 있음
            axios.post('http://localhost:8000/user/register/auth/', { email: this.email })
                .then(response => {
                    // console.log(response.data.message);
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

      isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },

      async handleSignup() {
        if (this.isUserNameValid == false){
          this.usernameError = "아이디 중복확인을 해주세요."
          return;
        }

        if (this.password.length < 8 || !/[0-9]/.test(this.password) || !/[A-Za-z]/.test(this.password)) {
          this.passwordError = '영문, 숫자를 포함한 8자 이상의 비밀번호를 입력하세요.';
          return;
        } else {
          this.passwordError = '';
        }

        // 비밀번호 확인 검사
        if (this.password !== this.password_check) {
          this.passwordCheckError = '비밀번호가 일치하지 않습니다.';
          return;
        } else {
          this.passwordCheckError = '';
        }

        if (this.nickname.length < 2 || this.nickname.length > 10) {
          this.nicknameError  = '닉네임은 2~10자 사이여야 합니다.';
          return;
        } else {
          this.nicknameError  = '';
        }
        // Implement your check Nickname logic here
        try {
          await this.checkNickname();
          if (!this.isNickNameValid) {
            return; 
          }
        } catch (error) {
          console.error("닉네임 중복 확인 에러:", error);
          alert("닉네임 중복 확인 중 오류가 발생했습니다.");
          return;
        }


        if (this.isFormValid) {
          axios.post('http://localhost:8000/user/register/', {
            username: this.username,
            email: this.email,
            password: this.password,
            nickname: this.nickname,
            birth: this.birthDate,
            gender: this.gender,
            phone_number: this.phoneNumber.replace(/\s/g, ''),
            car_number: this.noCar ? null : this.carInfo,
          })
          .then(response => {
            if (response.status === 200) {
              alert('회원가입이 완료되었습니다.');
              this.$router.push({ 
                path: '/', 
                replace: true 
              }).then(() => {
                window.scrollTo(0, 0);
              });
            }
          })
          .catch(error => {
            alert('회원가입 오류: ' + error);
            console.error('회원가입 오류:', error);
          });
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
            // console.log(this.email, this.auth_number);
            if (response.status === 200) {
              alert('인증번호가 일치합니다.');
              this.isVerificationCode = true;
              this.activeStep = 1;
            } else {
              if (response.data && response.data.error) {
                alert(response.data.error); 
              } else {
                alert('인증 번호 확인 실패'); 
              }
            }
          })
          .catch(error => {
            if (error.response && error.response.data && error.response.data.error) {
              alert(error.response.data.error); 
            } else {
              alert('인증 번호 확인 중 오류가 발생했습니다.'); 
            }
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
  .service-title {
    font-size: 20px;
    text-align: left;
    color: #0D47A1;
    margin-bottom: 15px;
    font-weight: bold;
  }

  .carpool-container {
    width: 100%;
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
  }

  .completion-message {
    text-align: center;
    justify-content: center;
    padding: 100px 20px;
  }

  .completion-message h3 {
    color: #2AAA8A;
    margin-bottom: 15px;
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
  }

  .form-group button {
    width: 100%;
    margin-bottom: 10px; 
  }

  .form-group input {
    width: 100%;
    margin-bottom: 10px; 
  }

  .form-group-email {
    width: 250px;
    margin-bottom: 20px;
  }

  .input-email {
    margin-bottom: 10px; 
  }

  .verificationCode-form {
    background-color: whitesmoke;
    border-radius: 8px;
    padding: 15px;
    margin-top: 10px;
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

  .signup-form {
    width: 300px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 10px;
  }

  .p-field {
    margin-bottom: 1rem;
  }

  .car-info-container {
    display: flex;
    align-items: center; /* 수직 정렬 */
  }

  .p-field-checkbox {
    display: flex;
    align-items: center;
  }

  .p-field-checkbox label {
    margin-left: 0.5rem;
    font-weight: normal; /* "차량 없음" 텍스트를 볼드체가 아닌 일반 글꼴로 설정 */
    white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .birthdate-container {
    display: flex;
    gap: 5px;
    width: 100%;
  }

  .birthdate-container .p-dropdown {
    width: calc(33.33% - 5px); /* Adjust width for equal distribution */
  }
  </style>
  