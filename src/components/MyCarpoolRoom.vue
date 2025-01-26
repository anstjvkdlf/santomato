<template>
  <div class="carpool-container">

    <div class="filter-container">
      <span @click="currentFilter = 'all'" :class="['filter-text', { active: currentFilter === 'all' }]">전체</span>
      <span @click="currentFilter = 'companion'" :class="['filter-text', { active: currentFilter === 'companion' }]">들날동행</span>
      <span @click="currentFilter = 'original'" :class="['filter-text', { active: currentFilter === 'original' }]">등산카풀</span>
    </div>

    <ul class="carpool-list">
      <li v-for="(room, index) in filteredRooms" :key="index" 
          :class="['carpool-item', room.service_type === 'companion' ? 'sky-bg' : 'yellow-bg']"
          @click="showPopup(room)">
          <div class="trip-info">
              <div class="service-header">
                  <span class="service-type">{{ room.service_type === 'companion' ? '들날동행' : '등산카풀' }}</span>
                  <span class="date-time">{{ formatDateTime(room.departure_date, room.departure_time) }}</span>
              </div>
              <div class="route-info">
                  <div class="route-point">
                      <span class="point-label">{{ room.service_type === 'companion' ? '들머리: ' : '출발지: ' }}</span>
                      <span class="point-value">{{ room.start_point }}</span>
                  </div>
                  <div class="route-point">
                      <span class="point-label">{{ room.service_type === 'companion' ? '날머리: ' : '목적지: ' }}</span>
                      <span class="point-value">{{ room.end_point }}</span>
                  </div>
              </div>
              <div class="participants">
                  <span>참가자 {{ room.approved_participants.length }}명 / 최대 {{ room.max_participants }}명</span>
              </div>
          </div>
          <div class="status-container">
          <span class="delete-text" @click.stop="confirmDelete(room)">삭제 X</span>
        </div>
      </li>
    </ul>

    <Dialog v-model:visible="showDeleteDialog" modal :style="{ width: '90%', maxWidth: '320px' }" class="delete-dialog" :showHeader="false">
      <div class="dialog-content">
        <div class="dialog-header">
          <Button icon="pi pi-times" @click="showDeleteDialog = false" class="close-button" text></Button>
        </div>
        <div class="dialog-body">
          <p>이 일정을 삭제하시겠습니까?</p>
          <div class="button-container">
            <Button label="삭제" @click="deleteRoom" class="p-button-danger delete-button"></Button>
            <Button label="아니요" @click="showDeleteDialog = false" class="p-button-secondary cancel-button"></Button>
          </div>
        </div>
      </div>
    </Dialog>

    <Dialog v-model:visible="showErrorDialog" modal :style="{ width: '90%', maxWidth: '320px' }" class="delete-dialog" :showHeader="false">
      <div class="dialog-content">
        <div class="dialog-header">
          <Button icon="pi pi-times" @click="showErrorDialog = false" class="close-button" text></Button>
        </div>
        <div class="dialog-body">
          <p>참가자가 있는 일정은 삭제할 수 없습니다.</p>
          <div class="button-container">
            <Button label="확인" @click="showErrorDialog = false" class="p-button-secondary"></Button>
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
    const selectedRoom = ref(null);
    const showDeleteDialog = ref(false);
    const showErrorDialog = ref(false);
    const currentFilter = ref('all');
    const carpoolRooms = ref([{
      approved_participants:[{nickname: '멋쟁이토마토',
          rating: 4.5,
          carInfo: '12가1234',
          gender: '여자',}],
        service_type: "original",
        start_point: "경기 수원시 영통구 덕영대로 1732",
        end_point: "소공원",
        departure_date: "2025-01-26",
        departure_time: "09:00",
        max_participants: 2,
        distance: 500,
        status: "pending",
        user: {
          nickname: '산토마토',
          rating: 5.0,
          carInfo: '12가1234',
          gender: '여자',
        }
      }]);

    const filteredRooms = computed(() => {
      switch (currentFilter.value) {
        case 'companion':
          return carpoolRooms.value.filter(room => room.service_type === 'companion');
        case 'original':
          return carpoolRooms.value.filter(room => room.service_type === 'original');
        default:
          return carpoolRooms.value;
      }
    });

    const showPopup = (room) => {
      selectedRoom.value = room;
      showDialog.value = true;
    };

    const confirmDelete = (room) => {
      try {
        if (room.approved_participants.length > 0) {
          showErrorDialog.value = true;
        } else {
          selectedRoom.value = room;
          showDeleteDialog.value = true;
        }
      } catch (error) {
        console.error('Error in confirmDelete:', error);
        // 에러 발생 시 기본 동작
        showErrorDialog.value = false;
        showDeleteDialog.value = false;
      }
    };

    const deleteRoom = () => {
      //axios.delete(`http://localhost:8000/requestmanager/carpoolRequests/delete/${requestId}`);
      //carpoolRequests.value = carpoolRequests.value.filter(req => req !== selectedRequest.value);
      showDeleteDialog.value = false;
    };

    const fetchCarpoolRooms = async () => {
      try {
        //const response = await axios.get(`http://localhost:8000/api/carpool/all/`, {
        //  withCredentials: true,
        //});
        //console.log(response.data);
        //carpoolRooms.value = response.data;  
      } catch (error) {
        console.error('카풀 정보를 가져오는데 실패했습니다:', error);
        if (error.response && error.response.status === 401) {
          console.log('인증에 실패했습니다. 다시 로그인해주세요.');
        }
      }
    };

    return {
      router,
      showDialog,
      selectedRoom,
      showDeleteDialog,
      showErrorDialog,
      currentFilter,
      filteredRooms,
      showPopup,
      confirmDelete,
      deleteRoom,
      fetchCarpoolRooms,
    };
  },
  methods: {
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
    }
  },
 
  mounted() {
    this.fetchCarpoolRooms();
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

.carpool-list {
  list-style-type: none;
  padding: 0;
  width: 100%;
}

.carpool-item {
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: transform 0.2s ease;
}

.sky-bg {
  background-color: #e6f3ff;
}

.yellow-bg {
  background-color: #fff9e6;
}

.trip-info {
  margin-bottom: 10px;
}

.service-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.service-type {
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.9em;
}

.date-time {
    color: #555;
    font-size: 0.9em;
}

.route-info {
    background-color: rgba(255, 255, 255, 0.5);
    padding: 10px;
    border-radius: 8px;
    margin: 8px 0;
}

.route-point {
    margin: 4px 0;
}

.point-label {
    color: #666;
    font-size: 0.9em;
    margin-right: 4px;
}

.point-value {
    font-weight: 500;
    word-break: keep-all;
}

.participants {
    margin-top: 8px;
    font-size: 0.9em;
    color: #444;
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
  margin-left: 5px;
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
  word-break: keep-all;
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
