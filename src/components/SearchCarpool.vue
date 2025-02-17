<template>
  <div>
    <Stepper :value="activeStep.toString()" :model="steps">
      <StepPanels>
        <StepPanel value="0">
          <!-- Step 0 -->
          <h6 class="service-title">등산 카풀 찾기</h6>
          <Toast position="top-center" />
          <div class="carpool-container">
            <div class="search-section">
              <!-- 산 선택 -->
              <div class="input-group">
                <Dropdown id="mountain" v-model="mountain" :options="mountainOptions" optionLabel="name" 
                  placeholder="산 선택" class="p-dropdown-sm" :disabled="true" />
              </div>
              <!-- 출발지 검색 -->
              <div class="input-group">
                <InputText id="departure" v-model="startPoint" placeholder="출발지를 검색하세요" 
                  readonly class="p-inputtext-sm" />
              </div>
              <div class="input-group">
                <Button label="출발지 검색" icon="pi pi-search" @click="openPostcodePopup" 
                  class="p-button-sm" ></Button>
              </div>
              <!-- 목적지 선택 -->
              <div class="input-group">
                <Dropdown id="end-point" v-model="endPoint" :options="routeOptions" optionLabel="name" 
                  placeholder="목적지 선택" class="p-dropdown-sm" @change="updateMarker('end')" />
              </div>
              <!-- 탑승 인원 입력 -->
              <div class="input-group">
                <div class="seats-container">
                  <span class="seats-label">탑승 인원 :</span>
                  <InputNumber v-model="max_participants" showButtons buttonLayout="horizontal" 
                    fluid :min="0" :max="10" />
                </div>
              </div>
              <!-- 일정 선택 -->
              <div class="input-group">
                <DatePicker id="departure-date" v-model="departureDate" showTime hourFormat="12" 
                  placeholder="일정을 선택하세요" class="p-datepicker-sm" />
              </div>
            </div>
            <!-- 지도 -->
            <div id="map" class="map-container"></div>
            <!-- 찾기 버튼 -->
            <div class="input-group">
              <Button label="찾기" @click="searchCarpool" icon="pi pi-check" class="p-button-sm"></Button>
            </div>
          </div>
        </StepPanel>

        <StepPanel value="1">
          <!-- Step 1 -->
          <div class="title-container">
            <Button icon="pi pi-chevron-left" class="back-button" @click="activeStep = 0" text></Button>
            <h6 class="service-title">카풀 목록</h6>
          </div>
          <div class="sort-container">
            <div class="radio-group">
              <RadioButton v-model="sortOption" value="time" inputId="time" />
              <label for="time" class="sort-label">시간순</label>
              <RadioButton v-model="sortOption" value="distance" inputId="distance" />
              <label for="distance" class="sort-label">거리순</label>
            </div>
          </div>
          <div class="carpool-container">
            <div v-if="carpoolList.length === 0" class="no-results-message">
              검색된 항목이 없습니다.
            </div>
            <div class="carpool-list">
              <Card v-for="carpool in carpoolList" :key="carpool.room_id" class="carpool-card" 
                @click="handleCardClick(carpool)">
                <template #title>
                  <div style="display: flex; flex-direction: column;">
                    {{ carpool.start_point }}

                  </div>
                </template>
                <template #content>
                  <p>시간: {{ formatTime(carpool.departure_time) }}</p>
                  <p>가능 인원: {{ carpool.max_participants }}명</p>
                  <p>거리: {{ carpool.distance ? `${carpool.distance}m` : '정보 없음' }}</p>
                </template>
              </Card>
            </div>
          </div>
        </StepPanel>

        <StepPanel value="2">
          <!-- Step 2 -->
          <div class="title-container">
            <Button icon="pi pi-chevron-left" class="back-button" @click="activeStep = 1" text></Button>
            <h6 class="service-title">카풀 상세</h6>
          </div>
          <div class="carpool-container">
            <h5>{{ formatTime(selectedCarpool.departure_time) }}, {{formatDate(selectedCarpool.departure_date) }}</h5>
            <div class="carpool-detail">
              <div class="point-slot">
                <span class="point-text">출발지</span>
                <div class="point-info">
                  <span class="point-name">{{ selectedCarpool.start_point }}</span>
                </div>
              </div>
              <div class="point-slot">
                <span class="point-text">목적지</span>
                <div class="point-info">
                  <span class="point-name">{{ selectedCarpool.end_point }}</span>
                </div>
              </div>
            </div>
            <Divider />
            <!-- 사용자 정보 -->
            <div class="user-info">
              <div class="user-avatar">
                <img src="@/assets/등산카풀.png" alt="User Avatar" />
              </div>
              <div class="user-details">
                <h3>{{ user.name }}</h3>
                <div class="user-rating">
                  <i class="pi pi-star-fill" style="color: gold;"></i>
                  <span>{{ user.rate }}</span>
                </div>
                <p>{{ user.car }}</p>
              </div>
              <div class="user-actions">
                <Button icon="pi pi-chevron-right" text ></Button>
              </div>
            </div>
            <!-- 동행 요청 버튼 -->
            <div class="input-group">
              <Button label="카풀 요청" @click="submitCarpool" icon="pi pi-check" class="p-button-sm"></Button>
            </div>
          </div>
        </StepPanel>

        <StepPanel value="3">
          <!-- Step 3 -->
          <div class="carpool-container">
            <div class="completion-message">
              <h3>요청완료!</h3>
              <p>카풀 제공자가 승낙시 예약이 완료됩니다.</p>
            </div>
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import DatePicker from "primevue/datepicker";
import Stepper from "primevue/stepper";
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import InputNumber from 'primevue/inputnumber';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import RadioButton from 'primevue/radiobutton';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import axios from 'axios';
import { userStore } from '@/store';

export default {
  components: {
    Stepper,
    StepPanels,
    StepPanel,
    InputText,
    Button,
    Dropdown,
    DatePicker,
    InputNumber,
    Card,
    Divider,
    Toast,
    RadioButton,
  },
  setup() {
    const toast = useToast();
    const activeStep = ref(0);
    const sortOption = ref('time');
    const mountain = ref({ name: "설악산", id: 2 });
    const startPoint = ref(null);
    const endPoint = ref(null);
    const departureDate = ref(null);
    const max_participants = ref(null);
    const selectedCarpool = ref({
      departure_date: "",
      departure_time: "",
      max_participants: null,
      start_point: "",
      end_point: ""
    });
    const user = ref({
      name: "백지현",
      rate: "4.5",
      car: "투싼"
    });

    const carpoolList = ref([]);
    const carpoolListTime = ref([]);
    const carpoolListDistance = ref([]);

    const handleCardClick = (carpool) => {
      selectedCarpool.value = carpool;
      activeStep.value = 2;
    };

    const steps = ref([
      { label: 'Step 0' },
      { label: 'Step 1' },
      { label: 'Step 2' },
      { label: 'Step 3' },
    ]);

    const map = ref(null);
    const markers = ref({
      departure: null,
      entrance: null,
      exit: null,
    });

    const mountainOptions = ref([
      { name: "소백산", id: 1 },
      { name: "설악산", id: 2 },
    ]);

    const routeOptions = ref([
      { name: "소공원", address: "강원 속초시 설악산로 1055"},
      { name: "한계령", address: "강원 양양군 설악로 1 중청봉대피소"},
      { name: "오색", address: "강원 양양군 서면 대청봉길 95"},
      { name: "백담사", address: "강원 인제군 북면 백담로 746"},
    ]);

    const formatTime = (time) => {
      if (!time) return '정보 없음';
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? '오후' : '오전';
      const formattedHour = hour % 12 || 12;
      return `${ampm} ${formattedHour}시${minutes !== '00' ? ` ${parseInt(minutes)}분` : ''}`;
    };

    const formatDate = (date) => {
      const dateObj = new Date(date);
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const dayOfWeek = days[dateObj.getDay()];
      
      const [year, month, day] = date.split('-');
      return `${year.slice(2)}.${month}.${day} (${dayOfWeek})`;
    };

    onMounted(() => {
      if (!window.naver || !window.naver.maps) {
        console.error("네이버 지도 API가 로드되지 않았습니다.");
        return;
      }
      const mapOptions = {
        center: new naver.maps.LatLng(37.5665, 126.978),
        zoom: 12,
      };
      map.value = new naver.maps.Map("map", mapOptions);
    });

    const openPostcodePopup = () => {
      new daum.Postcode({
        oncomplete: function(data) {
          startPoint.value = data.address;
          updateMarkerWithAddress("start", data.address);
        },
      }).open();
    };

    const updateMarker = (type) => {
      const selectedOption = type === "start" ? startPoint.value : endPoint.value;
      if (!selectedOption) return;
      updateMarkerWithAddress(type, selectedOption.address);
    };

    const updateMarkerWithAddress = (type, address) => {
      naver.maps.Service.geocode(
        { query: address },
        (status, response) => {
          if (status !== naver.maps.Service.Status.OK) {
            console.error("주소를 찾을 수 없습니다.");
            return;
          }
          const result = response.v2.addresses[0];
          const coords = new naver.maps.LatLng(result.y, result.x);
          
          if (markers.value[type]) {
            markers.value[type].setMap(null);
          }
          markers.value[type] = new naver.maps.Marker({
            position: coords,
            map: map.value,
            title: address,
          });
          map.value.setCenter(coords);
        }
      );
    };

    const searchCarpool = async () => {
      // 필수 필드 검사
      if (!mountain.value || !departureDate.value || !max_participants.value || 
          !startPoint.value || !endPoint.value) {
        toast.add({
          severity: 'error',
          summary: '입력 오류',
          detail: '모든 필드를 입력해주세요.',
          life: 3000
        });
        return;
      }
      const formattedDate = departureDate.value ? departureDate.value.toISOString().split('T')[0] : '';
      const formattedTime = departureDate.value ? departureDate.value.toTimeString().split(' ')[0].slice(0, 5) : '';
  
      try {
        const apiUrl = `https://backend.santomato.com/api/carpool/${formattedDate}/${formattedTime}`;
        const params = new URLSearchParams({ start_point: startPoint.value });

        axios.defaults.withCredentials = true;

        // 시간순 정렬 데이터 가져오기
        const responseTime = await axios.get(`${apiUrl}?${params.toString()}&sort=time`, { withCredentials: true });
        carpoolListTime.value = responseTime.data.filter(carpool => 
          carpool.end_point === endPoint.value.name && 
          carpool.max_participants >= max_participants.value
        );

        // 거리순 정렬 데이터 가져오기
        const responseDistance = await axios.get(`${apiUrl}?${params.toString()}&sort=distance`, { withCredentials: true });
        carpoolListDistance.value = responseDistance.data.filter(carpool => 
          carpool.end_point === endPoint.value.name && 
          carpool.max_participants >= max_participants.value
        );

        // 현재 sortOption에 따라 carpoolList 업데이트
        updateCarpoolList();
        
        // console.log(carpoolList);
        activeStep.value = 1;

      } catch (error) {
        console.error('Failed to submit:', error);
      }
    };

    const updateCarpoolList = () => {
      const filteredList = (sortOption.value === 'time' ? carpoolListTime.value : carpoolListDistance.value)
        .filter(carpool => 
          // 선택된 end_point와 일치하고 max_participants 이하인 항목만 필터링
          carpool.end_point === endPoint.value.name && 
          carpool.max_participants >= max_participants.value
        );
      
      carpoolList.value = filteredList;
    };
    watch(sortOption, updateCarpoolList);

    const submitCarpool = async () => {
      try {
        await axios.post(
          `https://backend.santomato.com/api/carpool/join/`, // 올바른 URL로 수정
          {
            room_id: selectedCarpool.value.room_id,
            start_point: selectedCompanion.value.startPoint,
            service_type: "original",
            participant_cnt: max_participants.value,
          }, // 본문 내용이 없으므로 빈 객체를 보냄
          {
           withCredentials: true
          }
        );
        activeStep.value = 3;
      } catch (error) {
        console.error('Failed to submit:', error);
      }
    };

    return {
      steps,
      activeStep,
      mountain,
      startPoint,
      endPoint,
      max_participants,
      departureDate,
      mountainOptions,
      routeOptions,
      updateMarker,
      openPostcodePopup,
      searchCarpool,
      selectedCarpool,
      user,
      carpoolList,
      handleCardClick,
      submitCarpool,
      sortOption,
      formatTime,
      formatDate,
    };
  },
};
</script>

<style scoped>
.carpool-title {
  font-size: 18px;
  margin-top: 50px;
  margin-bottom: 10px;
  text-align: center;
}

.service-title {
  font-size: 20px;
  text-align: left;
  color: #2AAA8A;
  padding: 5px 15px;
  font-weight: bold;
}

.carpool-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  width: 300px;
  min-height: 420px;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.input-group {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.map-container {
  margin-top: 15px;
  width: 100%;
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}

.seats-container {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
}

.seats-label {
  white-space: nowrap;
  min-width: fit-content;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 15px;
}

.back-button {
  font-size: 1.2rem;
  color: #2AAA8A;
}

.back-button:hover {
  color: #1f8f73;
}

.carpool-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.carpool-card {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.carpool-card :deep(.p-card) {
  border: 1px solid #d4d4d4;
}

.carpool-card :deep(.p-card-title) {
  font-size: 1.2em;
  color: #2AAA8A;
  word-break: keep-all;
  padding: 0.3rem;
}

.carpool-card :deep(.p-card-content) {
  padding: 0.3rem;
}

.carpool-card :deep(.p-card-content p) {
  margin: 0.3rem 0;
}

.carpool-card :deep(.p-card-body) {
  padding: 0.8rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.carpool-detail {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.point-slot {
  display: flex;
  gap: 15px;
}

.point-text {
  white-space: nowrap;
  min-width: fit-content;
}

.point-info {
  display: flex;
  flex-direction: column;
}

.point-name {
  font-weight: bold;
  word-break: keep-all;
}

.completion-message {
  text-align: center;
  justify-content: center;
  padding: 100px 20px;
}

.completion-message h3 {
  color: #2AAA8A;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 10px 0;
  width: 100%;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex-grow: 1;
}

.user-details h3 {
  margin: 0;
  font-size: 1.2em;
}

.user-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.user-actions {
  margin-left: auto;
}

.sort-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.radio-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sort-label {
  margin-left: 8px;
  cursor: pointer;
  color: #666;
  white-space: nowrap;
}

.no-results-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2em;
  color: #666;
}
</style>
