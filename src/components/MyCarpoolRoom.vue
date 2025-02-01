<template>
  <div class="carpool-container">

    <div class="filter-container">
      <span @click="currentFilter = 'all'" :class="['filter-text', { active: currentFilter === 'all' }]">
        전체 ({{ allRoomsCount }})
      </span>
      <span @click="currentFilter = 'companion'" :class="['filter-text', { active: currentFilter === 'companion' }]">
        들날동행 ({{ companionRoomsCount }})
      </span>
      <span @click="currentFilter = 'original'" :class="['filter-text', { active: currentFilter === 'original' }]">
        등산카풀 ({{ originalRoomsCount }})
      </span>
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
                  <span>참가자 {{ room.totalParticipants }}명 / 최대 {{ room.max_participants }}명</span>
                  <span v-if="room.approved_participants.length > 0" class="view-participants" @click.stop="showParticipants(room)">
                      <strong><u>참가자 보기</u></strong>
                  </span>
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

    <Dialog v-model:visible="showParticipantsDialog" modal :style="{ width: '90%', maxWidth: '320px' }" class="participants-dialog" :showHeader="false">
      <div class="dialog-content">
        <div class="dialog-header">
          <Button icon="pi pi-times" @click="showParticipantsDialog = false" class="close-button" text></Button>
        </div>
        <div class="dialog-body">
          <div class="total-participants">총 참가자: {{ selectedRoom.totalParticipants }}명</div>
          <div  v-for="(participant, index) in selectedRoomParticipants" :key="index" class="participant-info">
            <div class="participant-details">
              <strong>{{ participant.nickname }} 
                {{ participant.isowner ? `(방장)` : `(${participant.participants}명)` }}
              </strong>
              <span class="rating">{{ participant.rating }}★</span>
            </div>
            <div class="participant-extra-info">
              <span>{{ participant.gender }} </span>
              <span v-if="selectedRoom.service_type === 'companion' || 
                (selectedRoom.service_type === 'original' && participant.isowner)">{{ participant.carInfo }}</span>
              <div v-if="selectedRoom.service_type === 'original' && participant.isowner === false" class="distance">{{ participant.start_point }} ({{ participant.distance }}m)</div>
            </div>
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
    const showParticipantsDialog = ref(false);
    const selectedRoomParticipants = ref([]);
    const currentFilter = ref('all');
    const carpoolRooms = ref([
      {
        approved_participants:[
        {
          nickname: '산토마토',
          rating: 5.0,
          carInfo: null,
          gender: '여자',
          participants: 1,
          start_point: "경기 수원시 영통구 덕영대로 123",
          distance: 500,
          isowner: false,
        }],
        service_type: "original",
        start_point: "경기 수원시 영통구 덕영대로 1732",
        end_point: "소공원",
        departure_date: "2025-01-26",
        departure_time: "09:00",
        max_participants: 2,
        room_id: 1,
      },
      {
        approved_participants:[],
        service_type: "companion",
        start_point: "오색",
        end_point: "소공원",
        departure_date: "2025-01-26",
        departure_time: "09:00",
        max_participants: 2,
        room_id: 2,
      },
    ]);

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

    const showParticipants = (room) => {
      if (room && room.approved_participants) {
        selectedRoom.value = room;
        selectedRoomParticipants.value = room.approved_participants;
        showParticipantsDialog.value = true;
      } else {
        console.error('Room or approved participants not found');
      }
    };

    const allRoomsCount = computed(() => carpoolRooms.value.length);
    const companionRoomsCount = computed(() => carpoolRooms.value.filter(room => room.service_type === 'companion').length);
    const originalRoomsCount = computed(() => carpoolRooms.value.filter(room => room.service_type === 'original').length);

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
      if (selectedRoom && selectedRoom.value.room_id) {
        axios.delete(`https://backend.santomato.com/api/carpool/delete/${selectedRoom.value.room_id}/`, 
        {
          withCredentials: true
        })
      .then(() => {
        carpoolRooms.value = carpoolRooms.value.filter(room => room.room_id !== selectedRoom.value.room_id);
        showDeleteDialog.value = false;
        })
        .catch(error => {
          console.error('방 삭제 중 오류 발생:', error);
          // 오류 처리 로직 추가
        });
      }
    };

    const fetchCarpoolRooms = async () => {
      try {
       // const response = await axios.get(`https://backend.santomato.com/api/carpool/all/`, {
        //  withCredentials: true,
        //});
        //console.log(response.data);
        //carpoolRooms.value = response.data;  

        carpoolRooms.value = carpoolRooms.value.map(room => ({
          ...room,
          totalParticipants: room.approved_participants.reduce((sum, participant) => sum + (participant.participants || 1), 0)
        }));

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
      allRoomsCount,
      companionRoomsCount,
      originalRoomsCount,
      showParticipantsDialog,
      selectedRoomParticipants,
      showParticipants,
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
  word-break: keep-all;
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

.view-participants {
  margin-left: 10px;
  color: #007bff;
  cursor: pointer;
}

.participants-list {
  list-style-type: none;
  padding: 0;
}

.participant-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.participant-item div {
  margin-bottom: 5px;
}

.total-participants{
  text-align: left;
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
  text-align: left;
}

.participant-extra-info span {
  margin-right: 10px;
}

.rating {
  color: #FFD700;
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
