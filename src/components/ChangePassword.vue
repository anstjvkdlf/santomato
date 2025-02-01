<template>
  <div class="carpool-container">
    <div class="title-container">
      <Button icon="pi pi-chevron-left" class="back-button" @click="goToProfile" text></Button>
      <h6 class="service-title">비밀번호 변경</h6>
    </div>
    
    <form @submit.prevent="verifyCurrentPassword" v-if="!isCurrentPasswordVerified">
      <InputText type="password" v-model="currentPassword" placeholder="현재 비밀번호" />
      <Button type="submit" label="확인"></Button>
    </form>

    <form @submit.prevent="changePassword" v-else>
      <InputText type="password" v-model="newPassword" placeholder="새 비밀번호" />
      <InputText type="password" v-model="confirmNewPassword" placeholder="새 비밀번호 확인" />
      <Button type="submit" label="비밀번호 변경"></Button>
    </form>
    
  </div>  
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from "primevue/inputtext";

export default {
  components: {
    Button,
    InputText
  },
  setup() {
    const router = useRouter();
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmNewPassword = ref('');
    const isCurrentPasswordVerified = ref(false);
    const userInfo = ref(null);

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('https://backend.santomato.com/user/auth/', {
          withCredentials: true,
        });
        userInfo.value = response.data.user;
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', error);
      }
    };

    const verifyCurrentPassword = async () => {
     /*
      try {
        const response = await axios.post('https://backend.santomato.com/user/auth/verify-password/', {
          password: currentPassword.value
        }, {
          withCredentials: true,
        });
        if (response.data.status === 'success') {
          isCurrentPasswordVerified.value = true;
        } else {
          alert('현재 비밀번호가 일치하지 않습니다.');
        }
      } catch (error) {
        console.error('비밀번호 확인 중 오류 발생:', error);
        alert('비밀번호 확인 중 오류가 발생했습니다.');
      }*/
      isCurrentPasswordVerified.value = true;
    };

    const changePassword = async () => {
      if (newPassword.value !== confirmNewPassword.value) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }

      try {
        const response = await axios.put('https://backend.santomato.com/user/auth/password_reset/', {
          new_password: newPassword.value
        }, {
          withCredentials: true,
        });
        if (response.data.status === 'success') {
          alert('비밀번호가 성공적으로 변경되었습니다.');
          router.push('/profile');
        } else {
          alert('비밀번호 변경에 실패했습니다.');
        }
      } catch (error) {
        console.error('비밀번호 변경 중 오류 발생:', error);
        alert('비밀번호 변경 중 오류가 발생했습니다.');
      }
    };

    return {
      router,
      currentPassword,
      newPassword,
      confirmNewPassword,
      isCurrentPasswordVerified,
      userInfo,
      fetchUserInfo,
      verifyCurrentPassword,
      changePassword,
      goToProfile: () => router.push('/profile')
    };
  },
  mounted() {
    this.fetchUserInfo();
  }
}
</script>

<style scoped>
.carpool-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}

.service-title {
  font-size: 20px;
  text-align: left;
  color: #2AAA8A;
  padding: 5px 15px;
  font-weight: bold;
  margin: 0;
  padding: 0;
}

.title-container {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px; 
  padding: 0;
}

.back-button {
  font-size: 1.2rem;
  color: #2AAA8A;
  cursor: pointer;
  padding: 0.5rem 0.5rem 0.5rem 0 !important;
}

.back-button:hover {
  color: #1f8f73;
  background-color: transparent !important;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
</style>
