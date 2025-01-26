<template>
  <div class="carpool-container">
    <div class="title-container">
      <Button icon="pi pi-chevron-left" class="back-button" @click="goToProfile" text></Button>
      <h6 class="service-title">받은 요청</h6>
    </div>
    <ul class="carpool-list">
      <li v-for="(request, index) in filteredRequests" :key="index"
          :class="['carpool-item', request.service_type === 'companion' ? 'sky-bg' : 'yellow-bg']"
          @click="showPopup(request)">
        <div class="user-info">
          <strong>{{ request.user.nickname }}</strong>
          <span class="rating">{{ request.user.rating }}★</span>
        </div>
        <div class="additional-info">
          <span>{{ request.user.gender }}</span>
          <span v-if="request.service_type === 'companion'">{{ request.user.carInfo }}</span>
        </div>
        <div class="trip-info">
          <div>
            <span class="service-type">{{ request.service_type === 'companion' ? '들날동행' : '등산카풀' }}</span>
            <span>{{ formatDateTime(request.departure_date, request.departure_time) }}</span>
          </div>
          <div>{{ request.start_point }}
            <span v-if="request.service_type === 'original'" class="distance">({{ request.distance }}m)</span>
            → {{ request.end_point }}
          </div>
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
import { ref, computed } from 'vue';
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

    const carpoolRequests = ref([
      {
        service_type: "companion",
        start_point: "한계령",
        end_point: "오색",
        departure_date: "2025-01-26",
        departure_time: "10:00",
        participants: 1,
        distance: null,
        status: "pending",
        user: {
          nickname: '멋쟁이토마토',
          rating: 4.5,
          carInfo: '12가1234',
          gender: '여자',
        }
      },
      {
        service_type: "original",
        start_point: "광교중앙로 145",
        end_point: "소공원",
        departure_date: "2025-01-26",
        departure_time: "09:00",
        participants: 2,
        distance: 500,
        status: "pending",
        user: {
          nickname: '산토마토',
          rating: 5.0,
          carInfo: '12가1234',
          gender: '여자',
        }
      }
    ]);

    const filteredRequests = computed(() => {
      switch (currentFilter.value) {
        case 'companion':
          return carpoolRequests.value.filter(request => request.service_type === 'companion');
        case 'original':
          return carpoolRequests.value.filter(request => request.service_type === 'original');
        default:
          return carpoolRequests.value;
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
    };
  },
  methods: {
    goToProfile() {
      this.router.push('/profile');
    },
    async fetchCarpoolAlarm() {
      try {
        const response = await axios.get(`http://localhost:8000/api/waitngReauest/`,
        {
            withCredentials: true
        });
        console.log(response.data);
        this.carpoolRequests = response.data;
      } catch (error) {
        console.error('카풀 알람을 가져오는데 실패했습니다:', error);
      }
    },
    formatDateTime(date, time) {
      const [year, month, day] = date.split('-');
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? '오후' : '오전';
      const formattedHour = hour % 12 || 12;
      return `${year.slice(2)}.${month}.${day}, ${ampm} ${formattedHour}시${minutes !== '00' ? ` ${parseInt(minutes)}분` : ''}`;
    },
    async respondToRequest(status) {
      try {
        const response = await axios.post('http://localhost:8000/requestmanager/carpoolRequest/status/', {
          status: status
        });
        console.log(response.data);
        this.showDialog = false;
        this.fetchCarpoolAlarm();
      } catch (error) {
        console.error('요청 처리 중 오류 발생:', error);
      }
    },
  },
 
  mounted() {
    this.fetchCarpoolAlarm();
  }
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
  margin-bottom: 10px;
}

.additional-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 15px;
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
  margin-left: 5px;
}

.sky-bg .service-type {
  background-color: #007bff;
  color: white;
}

.yellow-bg .service-type {
  background-color: #ffc107;
  color: black;
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
