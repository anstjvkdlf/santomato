<template>
  <div class="carpool-container">
      <!-- 프로필 섹션 -->
      <div class="profile-section">
        <div class="profile-image">
          <font-awesome-icon icon="fa-solid fa-user" size="2x" />
        </div>
        <div class="user-info">
          <div class="user-name">
            <span v-if="!isEditingNickname">{{ nickname }}</span>
            <input 
              v-else 
              v-model="editedNickname" 
              @keyup.enter="saveNickname" 
              ref="nicknameInput"
            >
            <font-awesome-icon 
              icon="fa-solid fa-pen" 
              class="edit-icon" 
              @click="handleEditIconClick" 
            />
            <span class="rating">{{ rating }}★</span>
          </div>
          <div class="stats">
            <div class="stat-item" @click="navigateToPlans">
              <div class="stat-value">{{ stats.plans }}</div>
              <div class="stat-label">일정</div>
            </div>
            <div class="stat-item" @click="navigateToRequests">
              <div class="stat-value">{{ stats.requests }}</div>
              <div class="stat-label">보낸 요청</div>
            </div>
            <div class="stat-item" @click="navigateToAlarms">
              <div class="stat-value">{{ stats.alarms }}</div>
              <div class="stat-label">받은 요청</div>
            </div>
            <div class="stat-item" @click="navigateToReviews">
              <div class="stat-value">{{ stats.reviews }}</div>
              <div class="stat-label">리뷰</div>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-container">
        <div class="tab" 
            :class="{ active: activeTab === 'info' }" 
            @click="switchTab('info')">내 정보</div>
        <div class="tab" 
            :class="{ active: activeTab === 'id' }" 
            @click="switchTab('id')">내 계정</div>
      </div>
      
      <!-- 내 정보 섹션 -->
      <div class="info-section" v-if="activeTab === 'info'">
        <div class="info-item">
          <div class="info-label">생년월일</div>
          <div class="info-value">{{ birthDate }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">휴대폰번호</div>
          <div class="info-value">{{ phoneNumber }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">내 차량</div>
          <div class="info-value">{{ carInfo ? carInfo : '차량없음' }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">성별</div>
          <div class="info-value">{{ gender }}</div>
        </div>
        <div class="info-header">
          <font-awesome-icon icon="fa-solid fa-pen" class="edit-icon" @click="navigateToEdit" />
        </div>
      </div>
      
      <!-- 내 계정 섹션 -->
    <div class="info-section" v-if="activeTab === 'id'">
      <div class="info-item">
        <div class="info-label">ID</div>
        <div class="info-value">{{ username }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">이메일</div>
        <div class="info-value">{{ email }}</div>
      </div>
      <div class="info-item">
        <div class="info-label button-label" @click="navigateToChangePassword" data-clickable="true">비밀번호 변경</div>
        <div class="info-value"></div>
      </div>
      <div class="info-item">
        <div class="info-label button-label" @click="navigateToDeleteID" data-clickable="true">회원탈퇴</div>
        <div class="info-value"></div>
      </div>
    </div>

  </div>  
</template>

<script>
import axios from 'axios';
import { userStore } from '@/store';

export default {
  data() {
    return {
      activeTab: 'info',
      nickname: '',
      rating: 4.5,
      stats: {
        plans: 0,
        requests: 0,
        alarms: 0,
        reviews: 0,
      },
      username: '',
      email: '',
      birthDate: '',
      phoneNumber: '',
      carInfo: '',
      gender: '',
      isEditingNickname: false,
      editedNickname: '',
    }
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
    navigateToPlans() {
      this.$router.push('/profile/carpoolList');
    },
    navigateToRequests() {
      this.$router.push('/profile/carpoolRequest');
    },
    navigateToAlarms() {
      this.$router.push('/profile/carpoolAlarm');
    },
    navigateToReviews() {
      this.$router.push('/profile/reviews');
    },
    navigateToChangePassword(){
      this.$router.push('/profile/changePassword');
    },
    navigateToDeleteID(){
      this.$router.push('/profile/deleteID');
    },
    navigateToEdit() {
      this.$router.push('/profile/edit');
    },
    async fetchUserInfo() {
      try {
        const response = await axios.get('http://localhost:8000/user/auth/', {
          withCredentials: true,
        });

        // console.log("Response:", response);
        const userInfo = response.data.user;
        // console.log(userInfo);
        this.nickname = userInfo.nickname;
        this.username = userInfo.username;
        this.requested_carpool_rooms = userInfo.requested_carpool_rooms;
        this.email = userInfo.email;
        this.birthDate = userInfo.birth;
        this.phoneNumber = userInfo.phone_number;
        this.carInfo = userInfo.car_number;
        this.gender = userInfo.gender === 'male' ? '남성' : (userInfo.gender === 'female' ? '여성' : null);
        
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', error);
      }
    },
    
  startEditNickname() {
    // 편집 모드 활성화 및 기존 닉네임 설정
    this.isEditingNickname = true;
    this.editedNickname = this.nickname;

    this.$nextTick(() => {
      this.$refs.nicknameInput.focus();
    });
  },
  async saveNickname() {
    if (this.editedNickname && this.editedNickname !== this.nickname) {
      if (this.editedNickname.length < 2 || this.editedNickname.length > 10) {
        alert('닉네임은 2~10자 사이여야 합니다.');
        return;
      }

      try {
        const response = await axios.put(
          'http://localhost:8000/user/nickname/', 
          { nickname: this.editedNickname, email: this.email }, 
          { withCredentials: true }
        );

        this.nickname = response.data.nickname;
        alert('닉네임이 성공적으로 변경되었습니다.');
      } catch (error) {
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          console.error('닉네임 업데이트 실패:', error);
          alert('닉네임 저장 중 문제가 발생했습니다.');
        }
      }
    }

    this.isEditingNickname = false;
  },

  handleEditIconClick() {
    if (this.isEditingNickname) {
      this.saveNickname();
    } else {
      this.startEditNickname();
    }
  },
  async updateNickname(newNickname) {
      try {
        // API 호출 로직
        const response = await axios.put('http://localhost:8000/user/nickname/', { 
          nickname: newNickname,
          email: this.email,
         }, { withCredentials: true });

        console.log(response)
        this.nickname = response.data.nickname;
      } catch (error) {
        alert(error.response.data.error);
        console.error('닉네임 업데이트 실패:', error);
      }
    },
  },
  created() {
    this.fetchUserInfo();
  },
  mounted() {
    // console.log("Component mounted");
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

.tab-container {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 15px 0;
  cursor: pointer;
  color: #666;
  position: relative;
}

.tab.active {
  color: #007bff;
  font-weight: bold;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #007bff;
}

.profile-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  text-align: center;
}

.user-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.rating {
  color: #FFD700;
  margin-left: 5px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.stat-item {
  text-align: center;
  cursor: pointer;
}

.stat-value {
  font-weight: bold;
  margin-bottom: 5px;
  cursor: pointer;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.info-section {
  width: 100%;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.info-section h3 {
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.info-item .info-label[data-clickable="true"] {
  cursor: pointer;
}

.info-label {
  color: #666;
}

.info-value {
  font-weight: 500;
}

.info-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 15px;
}

.info-label.button-label {
  display: block;
  text-align: center;
  width: 100%; 
}

.edit-icon {
  cursor: pointer;
  color: #c0c0c0;
}

.user-name input {
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-bottom: 1px solid #007bff;
  outline: none;
  background: transparent;
}
</style>
