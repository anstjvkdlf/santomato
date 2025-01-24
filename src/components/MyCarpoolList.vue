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
        </span>
        <span v-if="selectedRequest?.status === 'pending'" 
              :class="['pending-text', 
                      selectedRequest?.service_type === 'companion' ? 'companion-pending' : 'carpool-pending']">
              응답 대기중
        </span>
      </div>
      </template>
      <div class="dialog-content">
        <div class="trip-info">
          <div>
            <span>{{ formatDateTime(selectedRequest.departure_date, selectedRequest.departure_time) }}</span>
          </div>
          <div>
            {{ selectedRequest.start_point }} → {{ selectedRequest.end_point }}
          </div>
        </div>

        <div class="additional-info">
          <span>참가자: {{ getTotalParticipants(selectedRequest.participants) }}명</span>
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
import { ref } from 'vue';
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
  
    const carpoolRequests = ref([
      {
        service_type: "companion",
        start_point: "한계령",
        end_point: "오색",
        departure_date: "2025-01-26",
        departure_time: "10:00",
        status: "accepted",
        participants: [{
          nickname: '멋쟁이토마토',
          rating: 4.5,
          carInfo: '12가1234',
          gender: '여자',
          participants: 2,
          isowner: false,
        },
        {
          nickname: '멋쟁이곰',
          rating: 4.5,
          carInfo: '10가3334',
          gender: '남자',
          participants: 1,
          isowner: true,
        },
        ]
      },
      {
        service_type: "original",
        start_point: "덕영대로 1732",
        end_point: "소공원",
        departure_date: "2025-01-25",
        departure_time: "09:00",
        status: "accepted",
        participants:[{
          nickname: '산토마토',
          rating: 5.0,
          carInfo: null,
          gender: '여자',
          participants: 2,
          start_point: "덕영대로 123",
          distance: 500,
          isowner: false,
        },
        {
          nickname: '산다람쥐',
          rating: 5.0,
          carInfo: null,
          gender: '여자',
          participants: 1,
          start_point: "덕영대로 1456",
          distance: 1200,
          isowner: false,
        },
        {
          nickname: '산방울',
          rating: 4.0,
          carInfo: '12가1234',
          gender: '남자',
          participants: 1,
          start_point: "덕영대로 1732",
          distance: 0,
          isowner: true,
        }]
      },
      {
        service_type: "companion",
        start_point: "소공원",
        end_point: "오색",
        departure_date: "2025-01-30",
        departure_time: "10:00",
        status: "pending",
        participants: [{
          nickname: '멋쟁이곰',
          rating: 4.5,
          carInfo: '10가3334',
          gender: '남자',
          participants: 1,
          isowner: true,
        },
        ]
      },
    ]);

    const hasRequests = (date) => {
      const dateStr = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
      return carpoolRequests.value.some(req => req.departure_date === dateStr);
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

    return {
      router,
      carpoolRequests,
      date,
      showDialog,
      selectedRequest,
      locale,
      hasRequests,
      getRequestsForDate,
      showPopup,
      closePopup
    };
  },
  methods: {
    goToProfile() {
      this.router.push('/profile');
    },
    getTotalParticipants(participants) {
      return participants.reduce((sum, participant) => sum + participant.participants, 0);
    },
    async fetchCarpoolAlarm() {
      //try {
       // const response = await axios.get(`http://127.0.0.1:8000/api/carpool-requests/`);
       // console.log(response.data);
       // this.carpoolRequests = response.data;
      //} catch (error) {
      //  console.error('카풀 알람을 가져오는데 실패했습니다:', error);
      //}
    },
    formatDateTime(date, time) {
      const [year, month, day] = date.split('-');
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? '오후' : '오전';
      const formattedHour = hour % 12 || 12;
      return `${year.slice(2)}.${month}.${day}, ${ampm} ${formattedHour}시${minutes !== '00' ? ` ${parseInt(minutes)}분` : ''}`;
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

.additional-info {
  display: flex;
  justify-content: flex-start;
  font-size: 0.75em;
  color: #999;
  margin-bottom: 10px;
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

.pending-text {
  font-size: 0.9em;
  font-weight: bold;
  margin-right: 10px;
}

.companion-pending {
  color: #007bff; 
}

.carpool-pending {
  color: #ffc107;
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
