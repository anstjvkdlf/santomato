<template>
  <div class="carpool-container">
      <!-- 프로필 섹션 -->
      <div class="profile-section">
        <div class="profile-image">
          <font-awesome-icon icon="fa-solid fa-user" size="2x" />
        </div>
        <div class="user-info">
          <div class="user-name">{{ nickname }} <span class="rating">{{ rating }}★</span></div>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">{{ stats.plans }}</div>
              <div class="stat-label">일정</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.requests }}</div>
              <div class="stat-label">받은 요청</div>
            </div>
            <div class="stat-item">
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
          <div class="info-value">{{ carInfo }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">성별</div>
          <div class="info-value">{{ gender }}</div>
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
        <div class="info-label">비밀번호 재설정</div>
        <div class="info-value"></div>
      </div>
      <template v-if="isLoggedIn">
        <div class="info-item">
          <div class="info-label">로그아웃</div>
          <div class="info-value"></div>
        </div>
      </template>
      <div class="info-item">
        <div class="info-label">회원탈퇴</div>
        <div class="info-value"></div>
      </div>
    </div>

  </div>  
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      activeTab: 'info',
      nickname: '멋쟁이토마토',
      rating: 4.5,
      stats: {
        plans: 0,
        requests: 0,
        reviews: 0,
      },
      username: 'test1234', //id
      email: 'ghkdud458213@naver.com',
      birthDate: '1996.12.03',
      phoneNumber: '010-9999-9999',
      carInfo: '12가1234',
      gender: '여자',
    }
    /*
    return {
      activeTab: 'info',
      nickname: '',
      rating: 4.5,
      stats: {
        reviews: 0,
        companions: 0,
        reports: 0
      },
      username: '', //id
      email: '',
      birthDate: '',
      phoneNumber: '',
      carInfo: '',
      gender: '',
      userInfo: null
    }*/
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
    async fetchUserInfo() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/user/auth');
        this.userInfo = response.data;
        this.nickname = this.userInfo.nickname;
        this.username = this.userInfo.username; //id
        this.email = this.userInfo.email;
        this.birthDate = this.userInfo.birthDate;
        this.phoneNumber = this.userInfo.phone;
        this.carInfo = this.userInfo.car_number;
        this.gender = this.userInfo.gender;
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', error);
      }
    }
  },
 
  mounted() {
    this.fetchUserInfo();
  }
}
</script>

<style scoped>
.carpool-title {
  font-size: 18px;
  margin-top: 50px;
  margin-bottom: 10px;
  text-align: center;
}

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
}

.stat-value {
  font-weight: bold;
  margin-bottom: 5px;
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

.info-label {
  color: #666;
}

.info-value {
  font-weight: 500;
}
</style>
