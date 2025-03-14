<template>
  <div class="carpool-container">
    <div class="title-container">
      <Button icon="pi pi-chevron-left" class="back-button" @click="goToProfile" text></Button>
      <h6 class="service-title">카풀 일정</h6>
    </div>
    <Calendar 
      v-model="date" 
      :inline="true"
      :selectable="false"
      :showIcon="false"
      :showButtonBar="false"
      dateFormat="yy.mm.dd"
      :locale="locale"
    >
      <template #date="slotProps">
        <div class="calendar-date-content">
          <div class="date-number">{{ slotProps.date.day }}</div>
          <div class="date-requests">
            <span 
              v-for="request in getRequestsForDate(slotProps.date)" 
              :key="request.service_type"
              :class="['request-tag', 
                  request.service_type === 'companion' ? 'companion-tag' : 'carpool-tag',
                  request.status === 'pending' ? 'pending-tag' : '']"
                @click.stop="showPopup(request)"
              >
              {{ request.service_type === 'companion' ? '동행' : '카풀' }}
            </span>
          </div>
        </div>
      </template>
    </Calendar>

    <!-- 팝업 다이얼로그 -->
    <Dialog 
        v-model:visible="showDialog" 
        modal 
        :style="{ width: '300px' }"
        :breakpoints="{
          '960px': '75vw',
          '640px': '90vw'
        }"
      >
      <template #header>
        <div class="dialog-header">
          <span :class="['service-type', 
            selectedRequest?.service_type === 'companion' ? 'companion-tag' : 'carpool-tag',
            selectedRequest?.status === 'pending' ? 'pending-tag' : '']">
            {{ selectedRequest?.service_type === 'companion' ? '들날동행' : '등산카풀' }}
            {{ selectedRequest?.status === 'pending' ? '(대기중)' : '' }}
          </span>
        </div>
      </template>
      <div class="dialog-content">
        <div class="trip-info">
          <div>
            <span>{{ formatDateTime(selectedRequest.departure_date, selectedRequest.departure_time) }}</span>
          </div>
          <div class="point-info">{{ selectedRequest.start_point }} → {{ selectedRequest.end_point }}</div>
        </div>

        <div v-for="participant in selectedRequest.participants" :key="participant.nickname" class="participant-info">
          <div class="participant-details">
            <strong>{{ participant.nickname }} 
              {{ participant.isowner ? `(방장)` : `(${participant.participants}명)` }}
            </strong>
            <span class="rating">{{ participant.rating }}★</span>
          </div>
          <div class="participant-extra-info">
            <span>{{ participant.gender }} </span>
            <span v-if="selectedRequest.service_type === 'companion' || 
              (selectedRequest.service_type === 'original' && participant.isowner)">{{ participant.carInfo }}</span>
            <div v-if="selectedRequest.service_type === 'original' && participant.isowner === false" class="distance">{{ participant.start_point }} ({{ participant.distance }}m)</div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Dialog from 'primevue/dialog';

export default {
  components: {
    Button,
    Calendar,
    Dialog,
  },
  setup() {
    const router = useRouter();
    const date = ref(new Date());
    const showDialog = ref(false);
    const selectedRequest = ref(null);
    const carpoolRequests = ref([]); 
    const locale = {
      firstDayOfWeek: 0,
      dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
      dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
      dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
      monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
      monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
      today: '오늘',
      clear: '초기화',
      dateFormat: 'yy.mm.dd',
      weekHeader: '주'
    };

    const getRequestsForDate = (date) => {
      const dateStr = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
      return carpoolRequests.value.filter(req => req.departure_date === dateStr);
    };
    const showPopup = (request) => {
      selectedRequest.value = request;
      showDialog.value = true;
    };

    const closePopup = () => {
      selectedRequest.value = null;
      showDialog.value = false;
    };

    const fetchCarpoolAlarm = async () => {
      try {
       const response = await axios.get(`https://backend.santomato.com/api/carpool/mycalendar/`,
       {
          withCredentials: true,
        });
        console.log("API Response:", response.data.data);
       carpoolRequests.value = response.data.data.created_rooms.map(room => ({
          room_id: room.room_id,
          departure_date: room.departure_date,
          departure_time: room.departure_time,
          start_point: room.start_point,
          end_point: room.end_point,
          service_type: room.service_type,
        }));
      } catch (error) {
       console.error('카풀 알람을 가져오는데 실패했습니다:', error);
      }
    };
    
    onMounted(() => {
      fetchCarpoolAlarm();
    });

    return {
      router,
      carpoolRequests,
      date,
      showDialog,
      selectedRequest,
      locale,
      getRequestsForDate,
      showPopup,
      closePopup,
      fetchCarpoolAlarm,
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
  font-weight: bold;
  margin: 0;
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

.carpool-item {
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dialog-content {
  padding: 15px;
}


:deep(.p-dialog) {
  width: 100% !important;  
}

:deep(.p-dialog-header-close) {
  position: absolute;
  right: 1rem;
  top: 1rem;
}

.dialog-header {
  display: flex;
  align-items: center;
  padding-right: 2rem;
}

:deep(.p-dialog-header-icons) {
  padding: 0;
  margin: 0;
}

.trip-info {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eee;
}

.trip-info div:first-child {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.trip-info div:last-child {
  color: #555;
  font-size: 1em;
  display: flex;
  align-items: center;
  gap: 5px;
}

.participant-info {
  margin: 12px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: white;
}

.participant-info:last-child {
  margin-bottom: 0;
  border-bottom: 1px solid #eee;
}

.participant-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.participant-extra-info {
  font-size: 0.9em;
  color: #666;
}

.participant-extra-info span {
  margin-right: 10px;
}

.rating {
  color: #FFD700;
}

.service-type {
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
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

.distance {
  color: #666;
  font-size: 0.9em;
}

.trip-info div:first-child {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.trip-info div:last-child {
  color: #555;
  font-size: 1em;
}

.carpool-item {
  padding: 15px;
}

/* Calendar 관련 스타일 */
:deep(.p-calendar) {
  width: 100%;
}

:deep(.calendar-date-content) {
  display: flex;
  flex-direction: column;
  min-height: 60px;
}

.date-number {
  padding: 4px 0;
  text-align: center;
  height: 24px;
  line-height: 24px;
}

.date-requests {
  padding: 2px;
  pointer-events: auto;
}

.request-tag {
  font-size: 0.75rem;
  padding: 2px 4px;
  margin: 2px 0;
  border-radius: 4px;
  text-align: center;
  width: 100%;
}

.companion-tag {
  background-color: #007bff;
  color: white;
}

.carpool-tag {
  background-color: #ffc107;
  color: black;
}

.pending-tag {
  background-color: #808080 !important; 
  color: white !important;
  border: none; 
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 2rem;
  width: 100%;
}

.companion-pending {
  color: #007bff; 
}

.carpool-pending {
  color: #ffc107;
}

.point-info {
  word-break: keep-all;
}

/* PrimeVue Calendar 커스텀 스타일 */
:deep(.p-datepicker) {
  width: 100%;
}

:deep(.p-datepicker table) {
  width: 100%;
  table-layout: fixed;
}

:deep(.p-datepicker td.p-datepicker-today > span) {
  background-color:white;
  color: #2AAA8A;
}

:deep(.p-datepicker td > span) {
  border-radius: 0;
  width: 100% !important; /* 너비를 100%로 설정 */
  height: auto !important; /* 높이 자동 조절 */
  display: block !important; /* flex 대신 block 사용 */
  padding: 0.2rem 0;
  background: none !important;
  color: inherit ;
}
:deep(.p-highlight) {
  background: none !important; /* 선택된 날짜 배경색 제거 */
}

:deep(.p-datepicker table td) {
  padding: 0;
  height: auto; /* 높이 자동 조절 */
  vertical-align: top;

}
</style>
