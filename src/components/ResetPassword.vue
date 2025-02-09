<template>
  <div>
    <Toast position="top-center" />
    <Stepper :value="activeStep.toString()" :model="steps">
    <StepPanels>
    <StepPanel value="0" >
      <!-- Step 0 -->
      <h6 class = "service-title"> 가입된 이메일 확인하기 </h6>
        <div class="form-group-email">
          <input type="email" id="email" name="email" v-model="email" class="form-control input-email" placeholder="이메일 주소" required>
          <button type="submit" class="btn btn-primary" @click="checkEmail" :disabled="!isEmailFilled">인증번호 전송</button>  
        <!-- If emailVerificationRequested is true, show the verification container -->
        <div v-if="showAuthForm">
            <div class="form-group-email verificationCode-form">
              <label for="verificationCode">인증번호</label>
              <div class="verificationCode-input">
                <input type="text" id="verificationCode" v-model="auth_number" class="form-control" placeholder="인증번호" required>
                <button type="button" class="btn btn-primary confirm-btn" @click="confirmVerificationCode">확인</button>
              </div>
              <button type="button" class="btn btn-link resend-btn" @click="checkEmail">이메일 재전송하기</button>
            </div>
        </div>
      </div>
    </StepPanel>

    <StepPanel value="1">
      <!-- Step 1 -->
      <h6 class = "service-title"> 비밀번호 재설정 </h6>
        <div class="signup-form">
          <form @submit.prevent="resetPassword">
            <div class="form-group">
              <InputText type="password" id="new_password" name="new_password" v-model="new_password" placeholder="새 비밀번호" />
              <p v-if="passwordError" class="text-danger">{{ passwordError }}</p>
            </div>
            <div class="form-group">
              <InputText type="password"  id="new_password_check" name="new_password_check" v-model="new_password_check" placeholder="새 비밀번호 확인" />
              <p v-if="passwordCheckError" class="text-danger">{{ passwordCheckError }}</p>
            </div>
            <button type="submit" class="btn btn-primary btn-block" :disabled="!isFormValid">비밀번호 재설정</button>
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
  import router from '@/router';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import InputMask from 'primevue/inputmask';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import Stepper from "primevue/stepper";
  import StepPanels from 'primevue/steppanels';
  import StepPanel from 'primevue/steppanel';

  export default {
      components: {
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
      return {
        username: '',
        email: '',
        new_password: '',
        new_password_check: '',
        passwordError: '',
        passwordCheckError: '',
        showAuthForm: false,
        csrftoken: '',
        auth_number:'',
        isVerificationCode: false,
      }
    },
    computed: {
      isEmailFilled() {
        return this.email.trim() !== '';
      },
      isFormValid() {
        return this.new_password.trim() !== '' && this.new_password_check.trim() !== '';
      },
    },

    methods: {
      checkEmail() {                    
        axios.post(`http://localhost:8000/user/password_reset/confirm/`, { email: this.email })
          .then(response => {
            if (response.status === 200) {
              this.toast.add({ severity: 'success', summary: '인증번호 전송', detail: '인증번호 전송 시 대기가 발생할 수 있습니다.', life: 3000 });
              this.isEmailValid = true;
              this.showAuthForm = true;
            } else {
              if (response.data && response.data.error) {
                alert(response.data.error); // 서버에서 반환된 에러 메시지 표시
              } else {
                alert('인증 번호 전송 실패'); // 기본 에러 메시지
              }
              console.error('인증 번호 전송 실패:', response);
            }
          })
          .catch(error => {
            if (error.response && error.response.data && error.response.data.error) {
              alert(error.response.data.error); 
            } else {
              alert('이메일 확인 중 오류가 발생했습니다.'); 
            }
            console.error('API 호출 실패:', error);
          });
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

      async resetPassword(){
        if (this.new_password.length < 8 || !/[0-9]/.test(this.new_password) || !/[A-Za-z]/.test(this.new_password)) {
          this.passwordError = '영문, 숫자를 포함한 8자 이상의 비밀번호를 입력하세요.';
        } else {
          this.passwordError = '';
        }

        if (this.new_password !== this.new_password_check) {
          this.passwordCheckError = '비밀번호가 일치하지 않습니다.';
          return;
        } else {
          this.passwordCheckError = '';
        }

        const response = await axios.put(`http://localhost:8000/user/password_reset/confirm/`, {
              email: this.email,
              new_password: this.new_password,
            });
        if (response.status === 200) {
          // console.log('Signup successful:', response.data, this.isStoreOwner);
          alert('비밀번호 재설정이 완료되었습니다.');
          this.$router.push({ path: '/login', replace: true });
        }
        else {
          if (response.data && response.data.error) {
                alert(response.data.error); 
              } else {
                alert('비밀번호 재설정 실패'); 
              }
        }
     
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

  .form-group-email {
    width: 250px;
    margin-bottom: 20px;
  }

  .input-email {
    margin-bottom: 10px; 
  }

  .form-group {
    width: 100%;
  }

  .form-group input {
    width: 100%;
    margin-bottom: 10px; 
  }

  .verificationCode-form {
    background-color: whitesmoke;
    border-radius: 8px;
    padding: 15px;
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

label {
  display: block;
  margin-bottom: 0.5rem;
}
  </style>
  