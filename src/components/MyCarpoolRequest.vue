<template>
  <div class="carpool-container">
    <div class="title-container">
      <Button icon="pi pi-chevron-left" class="back-button" @click="goToProfile" text></Button>
      <h6 class="service-title">보낸 요청</h6>
    </div>
    
    <div class="filter-container">
      <span @click="currentFilter = 'pending'" :class="['filter-text', { active: currentFilter === 'pending' }]">대기중 ({{ getPendingCount }}) </span>
      <span @click="currentFilter = 'accepted'" :class="['filter-text', { active: currentFilter === 'accepted' }]">수락됨 ({{ getAcceptedCount }})</span>
      <span @click="currentFilter = 'rejected'" :class="['filter-text', { active: currentFilter === 'rejected' }]">거절됨 ({{ getRejectedCount }})</span>
    </div>

    <ul class="carpool-list">
      <li v-for="(request, index) in filteredRequests" :key="index" 
          :class="['carpool-item', request.room_info.service_type === 'companion' ? 'sky-bg' : 'yellow-bg']"
          @click="showPopup(request)">
        
        <div class="trip-info">
          <div>
            <span class="service-type">{{ request.room_info.service_type === 'companion' ? '들날동행' : '등산카풀' }}</span>
            <span>{{ formatDateTime(request.room_info.departure_date, request.room_info.departure_time) }}</span>
          </div>
          <span class="point-info">{{ request.room_info.start_point }}
            <span v-if="request.room_info.ervice_type === 'original'" class="distance">({{ request.distance }}m)</span>
            → {{ request.room_info.end_point }}
          </span>
        </div>
        <div class="user-container">
          <div class="user-info">
            <!-- <strong>{{ request.room_info.user.nickname }}</strong>
            <span class="rating">{{ request.room_info.user.rating }}★</span> -->
          </div>
          <div class="additional-info">
            <!-- <span>{{ request.room_info.user.gender }}</span> -->
            <!-- <span v-if="request.room_info.service_type === 'companion'">{{ request.room_info.user.carInfo }}</span> -->
          </div>
        </div>
        <div  class="participants">요청인원 {{ request.room_info.requested_paricipants }}명 </div>

        <div class="status-container">
          <span class="status-text" :class="getStatusClass(request)">{{ getStatusText(request) }}</span>
          <span v-if="request.status === 'pending' && new Date(request.room_info.departure_date + ' ' + request.room_info.departure_time) > new Date()" 
            class="delete-text" 
            @click.stop="confirmDelete(request)">취소 X</span>
        </div>
      </li>
    </ul>

    <Dialog v-model:visible="showDeleteDialog" modal :style="{ width: '90%', maxWidth: '320px' }" class="delete-dialog" :showHeader="false">
      <div class="dialog-content">
        <div class="dialog-header">
          <Button icon="pi pi-times" @click="showDeleteDialog = false" class="close-button" text></Button>
        </div>
        <div class="dialog-body">
          <p>이 요청을 취소하시겠습니까?</p>
          <div class="button-container">
            <Button label="요청 취소" @click="deleteRequest" class="p-button-danger delete-button"></Button>
            <Button label="아니요" @click="showDeleteDialog = false" class="p-button-secondary cancel-button"></Button>
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
    const showDeleteDialog = ref(false);
    const currentFilter = ref('pending');
    const carpoolRequests = ref([]); // []로 초기화
    const fetchCarpoolAlarm = async () => {
      try {
        const response = await axios.get(`https://backend.santomato.com/api/carpool/req/sent/`, {
          withCredentials: true,
        });
        // 응답 데이터가 객체라면 값을 배열로 변환하여 carpoolRequests에 저장
        carpoolRequests.value = Array.isArray(response.data) ? response.data : []; 
        console.log("Hoyeon");
        console.log(carpoolRequests.value);
      } catch (error) {
        console.error('카풀 알람을 가져오는데 실패했습니다:', error);
      }
    };
    const filteredRequests = computed(() => {
      const now = new Date();
      console.log("Hello");
      console.log(carpoolRequests);
      return carpoolRequests.value.filter(request => {
        const requestDate = new Date(request.room_info.departure_date + ' ' + request.room_info.departure_time);
        switch (currentFilter.value) {
          case 'pending':
            return request.status === 'pending' && requestDate > now;
          case 'accepted':
            console.log("accept!!!")
            return request.status === 'accepted' && requestDate > now;
          case 'rejected':
            return request.status === 'rejected' && requestDate > now;
          default:
            return true;
        }
      });
    });

    const showPopup = (request) => {
      selectedRequest.value = request;
      showDialog.value = true;
    };

    const confirmDelete = (request) => {
      selectedRequest.value = request;
      showDeleteDialog.value = true;
    };

    const deleteRequest = () => {
      axios.delete(`https://backend.santomato.com/requestmanager/carpoolRequests/delete/${requestId}`);
      carpoolRequests.value = carpoolRequests.value.filter(req => req !== selectedRequest.value);
      showDeleteDialog.value = false;
    };

    const getPendingCount = computed(() => {
      return carpoolRequests.value.filter(request => 
        request.status === 'pending' && new Date(request.room_info.departure_date + ' ' + request.room_info.departure_time) > new Date()
      ).length;
    });

    const getAcceptedCount = computed(() => {
      return carpoolRequests.value.filter(request => 
        request.status === 'accepted' && new Date(request.room_info.departure_date + ' ' + request.room_info.departure_time) > new Date()
      ).length;
    });

    const getRejectedCount = computed(() => {
      return carpoolRequests.value.filter(request => 
        request.status === 'rejected' && new Date(request.room_info.departure_date + ' ' + request.room_info.departure_time) > new Date()
      ).length;
    });

    onMounted(() => {
      console.log("on mounted");
      fetchCarpoolAlarm();
    });
    return {
      router,
      carpoolRequests,
      showDialog,
      showDeleteDialog,
      selectedRequest,
      currentFilter,
      filteredRequests,
      showPopup,
      confirmDelete,
      deleteRequest,
      showDeleteDialog,
      getPendingCount,
      getAcceptedCount,
      getRejectedCount,
      fetchCarpoolAlarm
    };
  },
  methods: {
    goToProfile() {
      this.router.push('/profile');
    },
    formatDateTime(date, time) {
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
      try {
        const response = await axios.post('https://backend.santomato.com/requestmanager/myCarpoolRequest/status/', {
          status: status
        });
        // console.log(response.data);
        this.showDialog = false;
        this.fetchCarpoolAlarm();
      } catch (error) {
        console.error('요청 처리 중 오류 발생:', error);
      }
    },

    getStatusText(request) {
      switch (request.status) {
        case 'accepted': return '수락됨';
        case 'rejected': return '거절됨';
        default: return '';
      }
    },
    getStatusClass(request) {
      switch (request.status) {
        case 'accepted': return 'accepted-status';
        case 'rejected': return 'rejected-status';
        default: return '';
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
}

.sky-bg {
  background-color: #e6f3ff;
}

.yellow-bg {
  background-color: #fff9e6;
}

.user-container {
  border-bottom: 1px solid #e0e0e0;
}

.user-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.additional-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  color: #666;
}

.rating {
  color: #FFD700;
}

.trip-info {
  margin-top: 10px;
  margin-bottom: 10px;
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

.filter-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
}

.filter-text {
  flex: 1;
  margin: 0 5px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  padding: 5px 0;
}

.filter-text.active {
  font-weight: bold;
  color: #2AAA8A;
}

.filter-text {
  flex: 1;
  margin: 0 5px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  padding: 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-text span {
  margin-left: 5px;
  font-size: 12px;
  color: #999;
}

.status-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5px;
}

.status-text {
  font-size: 0.9em;
  font-weight: bold;
  margin-right: 8px;
}

.accepted-status { color: #28a745; }
.rejected-status { color: #dc3545; }
.past-status { color: #666 !important; }

.delete-text {
  font-size: 0.9em;
  color: #666;
  cursor: pointer;
  padding: 0 1px;
  line-height: 1;
}

.delete-text:hover {
  opacity: 0.7;
}

:deep(.p-button-rounded.p-button-text) {
  color: #000000 !important;
}

.point-info {
  word-break: keep-all;
}

.participants {
    margin-top: 10px;
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
