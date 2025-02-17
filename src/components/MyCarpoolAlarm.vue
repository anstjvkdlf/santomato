<template>
  <div class="carpool-container">
    <div class="title-container">
      <Button icon="pi pi-chevron-left" class="back-button" @click="goToProfile" text></Button>
      <h6 class="service-title">받은 요청</h6>
    </div>
    <ul class="carpool-list">
      <li v-for="(request, index) in filteredRequests" :key="index"
          :class="['carpool-item', request.service_type === 'companion' ? 'sky-bg' : 'yellow-bg']"
          @click="showPopup(request, index)">
        <div class="trip-info">
          <div>
            <span class="service-type">{{ request.service_type === 'companion' ? '들날동행' : '등산카풀' }}</span>
            <span>{{ formatDateTime(request.departure_date, request.departure_time) }}</span>
          </div>
          <span class="point-info">{{ request.start_point }}
            <span v-if="request.service_type === 'original'" class="distance">({{ request.distance }}m)</span>
            → {{ request.end_point }}
          </span>
        </div>
        <div class="user-info">
          <strong>{{ request.requester }}</strong>
          <!-- <span class="rating">{{ request.user.rating }}★</span> -->
        </div>
        <div class="additional-info">
          <!-- <span>{{ request.user.gender }}</span> -->
          <span v-if="request.service_type === 'companion'">{{ request.user.carInfo }}</span>
          <div>참가자 {{ request.max_participants }}명 </div>
        </div>
      </li>
    </ul>

    <Dialog 
    v-model:visible="showDialog" 
    modal 
    :style="{ width: '90%', maxWidth: '320px' }" 
    class="request-dialog"
    :showHeader="false"
  >
    <div class="dialog-content">
      <div class="dialog-header">
        <Button 
          icon="pi pi-times" 
          @click="showDialog = false" 
          class="close-button" 
          text
        ></Button>
      </div>
      <div class="dialog-body">
        <p>이 요청을 수락하시겠습니까?</p>
        <div class="button-container">
          <Button 
            label="수락" 
            @click="respondToRequest('accepted')" 
            class="p-button-success accept-button"
          ></Button>
          <Button 
            label="거절" 
            @click="respondToRequest('rejected')" 
            class="p-button-danger reject-button"
          ></Button>
        </div>
      </div>
    </div>
  </Dialog>

  </div>  
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

export default {
  components: {
    Button,
    Dialog
  },
  setup() {
    const router = useRouter();
    const showDialog = ref(false);
    const selectedRequest = ref(null);
    const currentFilter = ref('all');
    const carpoolRequests = ref({}); // 초기 데이터 구조를 객체로 설정
    const fetchCarpoolAlarm = async () => {
      try {
        const response = await axios.get(`https://backend.santomato.com/api/carpool/req/received/`, {
          withCredentials: true
        });
        console.log("API 응답 데이터:", response.data);
        carpoolRequests.value = response.data;  // ✅ API에서 받은 데이터를 반응형 변수에 저장
      } catch (error) {
        console.error('카풀 알람을 가져오는데 실패했습니다:', error);
      }
    };

    onMounted(() => {
      fetchCarpoolAlarm();
    });

    const filteredRequests = computed(() => {
      const allRequests = [];
      // 각 room_id를 순회하면서 요청들을 평탄화시켜
      for (const roomId in carpoolRequests.value) {
        if (carpoolRequests.value[roomId].length > 0) {
          const requestsWithRoomId = carpoolRequests.value[roomId].map(request => ({
            ...request,
            room_id: parseInt(roomId.replace('room_id: ', ''))  // 각 요청에 room_id를 추가
          }));
          allRequests.push(...requestsWithRoomId);  // 수정된 요청들을 allRequests에 추가
        }
      }
      switch (currentFilter.value) {
        case 'companion':
          return allRequests.filter(request => request.service_type === 'companion');
        case 'original':
          return allRequests.filter(request => request.service_type === 'original');
        default:
          return allRequests;
      }
    });


    
    const showPopup = (request) => {
      selectedRequest.value = request;
      showDialog.value = true;
    };


    return {
      router,
      carpoolRequests,
      showDialog,
      selectedRequest,
      showPopup,
      currentFilter,
      filteredRequests,
      fetchCarpoolAlarm,
    };
  },
  methods: {
    goToProfile() {
      this.router.push('/profile');
    },
    formatDateTime(date, time) {
      if (!date || !time) {
        console.error("Date or time is missing");
        return '정보 없음';  // 또는 원하는 기본값을 리턴
      }

      console.log(date); // 확인을 위해 출력
      console.log(time); // 확인을 위해 출력
      const dateObj = new Date(date);
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const dayOfWeek = days[dateObj.getDay()];

      const [year, month, day] = date.split('-');
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? '오후' : '오전';
      const formattedHour = hour % 12 || 12;
      return `${year.slice(2)}.${month}.${day}(${dayOfWeek}), ${ampm} ${formattedHour}시${minutes !== '00' ? ` ${parseInt(minutes)}분` : ''}`;
    },
    async respondToRequest(status) {
      console.log("hhh");
      console.log(this.selectedRequest);
      console.log(this.selectedRequest.room_id);
      console.log(this.selectedRequest.requester);
      if (status == "accepted") {
        try {
        const response = await axios.post(
          `https://backend.santomato.com/api/carpool/accept/`, 
        {
          room_id : this.selectedRequest.room_id,
          requester_id : this.selectedRequest.requester
        },
        {
          withCredentials: true,
        });
        // console.log(response.data);
        this.showDialog = false;
        this.fetchCarpoolAlarm();
      } catch (error) {
        console.error('요청 처리 중 오류 발생:', error);
      }
      }
      else if (status == "rejected") {
        try {
        const response = await axios.post(`https://backend.santomato.com/api/carpool/reject/`, 
        {
          room_id : this.selectedRequest.room_id,
          requester_id : this.selectedRequest.requester
        },
        {
          withCredentials: true,
        });
        // console.log(response.data);
        this.showDialog = false;
        this.fetchCarpoolAlarm();
      } catch (error) {
        console.error('요청 처리 중 오류 발생:', error);
      }
      }
    },
  },
}
</script>

<style scoped>
.carpool-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

.carpool-list {
  list-style-type: none;
  padding: 0;
  width: 100%;
}

.carpool-item {
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
}

.carpool-item:hover {
  opacity: 0.8;
}

.sky-bg {
  background-color: #e6f3ff;
}

.yellow-bg {
  background-color: #fff9e6;
}

.user-info {
  display: flex;
  justify-content: space-between;
}

.rating {
  color: #FFD700;
}

.trip-info {
  margin-top: 10px;
  margin-bottom: 10px;
}

.additional-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 5px;
}

.service-type {
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 5px;
  font-size: 0.9em;
  display: inline-block;
}

.distance {
  color: #666;
  font-size: 0.9em;
}

.sky-bg .service-type {
  background-color: #007bff;
  color: white;
}

.yellow-bg .service-type {
  background-color: #ffc107;
  color: black;
}

.point-info {
  word-break: keep-all;
}

/* Dialog 스타일 */
.request-dialog {
  border-radius: 12px;
  overflow: hidden;
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
