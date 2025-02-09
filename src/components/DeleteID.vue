<template>
  <div class="carpool-container">
    <div class="title-container">
      <Button icon="pi pi-chevron-left" class="back-button" @click="goToProfile" text></Button>
      <h6 class="service-title">회원 탈퇴</h6>
    </div>

    <form @submit.prevent="verifyCurrentPassword" >
      <InputText type="password" v-model="currentPassword" placeholder="비밀번호를 입력하세요." />
      <Button type="submit" label="확인"></Button>
    </form>

    <Dialog 
      :visible="confirmDeleteDialog" 
      @update:visible="confirmDeleteDialog = $event" 
      modal 
      header="회원 탈퇴 확인"
      :style="{ width: '90%', maxWidth: '320px' }"    
      >
      <p>정말로 탈퇴하시겠습니까? 탈퇴 후에는 복구할 수 없습니다.</p>
      <template #footer>
        <Button label="취소" icon="pi pi-times" @click="confirmDeleteDialog = false" class="p-button-text"></Button>
        <Button label="탈퇴" icon="pi pi-check" @click="deleteAccount" autofocus></Button>
      </template>
    </Dialog>

  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from "primevue/inputtext";
import Dialog from 'primevue/dialog';
import router from '@/router';
import { userStore } from '@/store';

export default {
  components: {
    Button,
    InputText,
    Dialog
  },
  setup() {
    const router = useRouter();
    const currentPassword = ref('');
    const confirmDeleteDialog = ref(false);
    const userInfo = ref(null);

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('https://backend.santomato.com/user/auth/', {
          withCredentials: true,
        });
        userInfo.value = response.data.user;
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', error);
        alert('사용자 정보를 가져오는데 실패했습니다.');
      }
    };

    const verifyCurrentPassword = async () => {
      try {
        await axios.post('http://localhost:8000/user/verify-password/', {
          password: currentPassword.value
        }, {
          withCredentials: true,
        }).then(response => {
          if (response.status === 200) {
            confirmDeleteDialog.value = true; // 다이얼로그 표시
          } else {
            if (response.data && response.data.error) {
              alert(response.data.error);
            } else {
              alert('비밀번호가 일치하지 않습니다.');
            }
            console.error('비밀번호 확인 실패:', response);
          }
        })
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error); 
        } else {
          alert('비밀번호 확인 중 오류 발생: ', error);
        }
        console.error('API 호출 실패:', error);
      }
    };

    const deleteAccount = async () => {
      try {
        await axios.delete('http://localhost:8000/user/register/', {
          withCredentials: true,
        }).then(response => {
          if (response.status === 200) {
            alert('회원 탈퇴되었습니다. 그동안 이용해주셔서 감사합니다.');
          } else {
            if (response.data && response.data.error) {
              alert(response.data.error);
            } else {
              alert('회원 탈퇴에 실패했습니다.');
            }
            console.error('회원 탈퇴 실패:', response);
          }
        })
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error); 
        } else {
          alert('회원 탈퇴 중 오류 발생: ', error);
        }
        console.error('API 호출 실패:', error);
      }
      
      const user = userStore();
      user.isLoggedIn = false;
      localStorage.removeItem('isLoggedIn');
      confirmDeleteDialog.value = false; 

      return router.push({ path: '/', replace: true });
    };

    return {
      router,
      userInfo,
      fetchUserInfo,
      currentPassword,
      confirmDeleteDialog,
      verifyCurrentPassword,
      deleteAccount,
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

.dialog-header {
  display: flex;
  justify-content: flex-end;
}

.close-button {
  padding: 0.5rem !important;
  color: #666;
}

.dialog-body {
  padding: 0 5px 5px;
  text-align: center;
}

.button-container {
  display: flex;
  gap: 10px;
  justify-content: center;
}

:deep(.p-button.accept-button) {
  background-color: #2AAA8A;
  border-color: #2AAA8A;
}

:deep(.p-button.reject-button) {
  background-color: #dc3545;
  border-color: #dc3545;
}
</style>
