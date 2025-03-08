<template>
  <div>
    <Stepper :value="activeStep.toString()" :model="steps">
    <StepPanels>
    <StepPanel value="0" >
      <!-- Step 0 -->
      <h6 class = "service-title"> 들날 동행 찾기 </h6>
      <div class="carpool-container">
        <div class="search-section">
          <!-- 산 선택 -->
          <div class="input-group" >
            <Dropdown
              id="mountain"
              v-model="mountain" 
              :options="mountainOptions"
              optionLabel="name"
              placeholder="산 선택"
              class="p-dropdown-sm"
              :disabled="true"
            />
          </div>

          <!-- 들머리 선택 -->
          <div class="input-group">
            <Dropdown
              id="start-point"
              v-model="startPoint"
              :options="routeOptions"
              optionLabel="name"
              placeholder="들머리 선택"
              class="p-dropdown-sm"
              @change="updateMarker('start')"
              :showClear="false"
            />
          </div>

          <!-- 날머리 선택 -->
          <div class="input-group">
            <Toast position="top-center" />
            <Dropdown
              id="end-point"
              v-model="endPoint"
              :options="routeOptions"
              optionLabel="name"
              placeholder="날머리 선택"
              class="p-dropdown-sm"
              @change="updateMarker('end')"
              :showClear="false"
            />
          </div>
          
          <!-- 탑승 인원 입력 -->
          <div class="input-group">
            <div class="seats-container">
              <span class="seats-label">탑승 인원 :</span>
              <InputNumber v-model="max_participants" showButtons buttonLayout="horizontal" fluid :min="0" :max="10" />
            </div>
          </div>

          <!-- 일정 선택 -->
          <div class="input-group">
            <DatePicker
              id="departure-date"
              v-model="departureDate"
              showTime
              hourFormat="12"
              placeholder="일정을 선택하세요"
              class="p-datepicker-sm"
            />
          </div>
        </div>

        <!-- 지도 -->
        <div id="map" class="map-container"></div>

        <!-- 찾기 버튼 -->
        <div class="input-group">
          <Button
            label="찾기"
            @click="searchCompanion"
            icon="pi pi-check"
            class="p-button-sm">
          </Button>
        </div>
      </div> 
    </StepPanel>

    <StepPanel value="1">
      <!-- Step 1 -->
      <div class="title-container">
      <Button icon="pi pi-chevron-left" 
              class="back-button" 
              @click="activeStep = 0" 
              text ></Button>
      <h6 class="service-title">동행 목록</h6>
      </div>
      <div class="carpool-container">
        <div v-if="companionList.length === 0" class="no-results-message">
          검색된 항목이 없습니다.
        </div>
        <div class="companion-list">
          <Card v-for="companion in companionList" :key="companion.id" class="companion-card" @click="handleCardClick(companion)">
            <template #title>
              {{ companion.start_point }} → {{ companion.end_point }}
            </template>
            <template #content>
              <p>날짜: {{ companion.departure_date }}</p>
              <p>시간: {{ formatTime(companion.departure_time) }}</p>
              <p>가능 인원: {{ companion.max_participants }}명</p>
            </template>
          </Card>
        </div>
      </div>
    </StepPanel>
    
    <StepPanel value="2">
      <!-- Step 2 -->
      <div class="title-container">
        <Button icon="pi pi-chevron-left" 
                class="back-button" 
                @click="activeStep = 1" 
                text></Button>
        <h6 class="service-title">동행 상세</h6>
      </div>

      <div class="carpool-container">
        <h5>{{ formatTime(selectedCompanion.departure_time) }}, {{formatDate(selectedCompanion.departure_date) }}</h5>
          <div class="carpool-detail">
            <div class="point-slot">
              <span class="point-text">들머리</span>
              <div class="point-info">
                <span class="point-name">{{ selectedCompanion.start_point }}</span>
              </div>
            </div>
            <div class="point-slot">
              <span class="point-text">날머리</span>
              <div class="point-info">
                <span class="point-name">{{ selectedCompanion.end_point }}</span>
              </div>
           </div>
        </div>
        <Divider class="" />

        <!-- 사용자 정보 -->
        <div class="user-info">
          <div class="user-avatar">
            <!-- 실제 이미지 URL로 교체 필요 -->
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
            <Button icon="pi pi-chevron-right" text > </Button>
          </div>
        </div>


        <!-- 동행 요청 버튼 -->
        <div class="input-group">
            <Button
              label="동행 요청"
              @click="submitCompanion"
              icon="pi pi-check"
              class="p-button-sm">
            </Button>
        </div>
      </div>
    </StepPanel>

    <StepPanel value="3">
      <!-- Step 3 -->
      <div class="carpool-container">
      <div class="completion-message">
        <h3>요청완료!</h3>
        <p>동행 제공자가 승낙시 예약이 완료됩니다.</p>
      </div>
    </div>
    </StepPanel>
    
  </StepPanels>
  </Stepper>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
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
  },
  setup() { 
    const toast = useToast();
    const activeStep = ref(0);
    const mountain = ref({ name: "설악산", id: 2 });
    const departureDate = ref(null);
    const startPoint = ref(null);
    const endPoint = ref(null);
    const max_participants = ref(null);
    const selectedCompanion = ref({
      departure_date: "", departure_time: "", max_participants: null, startpoint: "", end_point: "", room_id: ""
    });
    const user = ref({
      name: "백지현",
      rate: "4.5",
      car: "투싼"
    });

    const handleCardClick = (companion) => {
      selectedCompanion.value = companion;
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

    const mountainOptions =  ref([
      { name: "소백산", id: 1 },
      { name: "설악산", id: 2 },
    ]);

    const companionList = ref([]);

    const onStepChange = (index) => {
      activeStep.value = index;
    };


    // 들머리와 날머리 옵션 및 주소 매핑
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

    // 지도 초기화
    onMounted(() => {
      if (!window.naver || !window.naver.maps) {
        console.error("네이버 지도 API가 로드되지 않았습니다.");
        return;
      }

      const mapOptions = {
        center: new naver.maps.LatLng(37.5665, 126.978), // 서울 좌표
        zoom: 12,
      };

      map.value = new naver.maps.Map("map", mapOptions);
    });

    // 선택된 들머리 또는 날머리의 주소로 마커 업데이트
    const updateMarker = (type) => {
      const selectedOption = type === "start" ? startPoint.value : endPoint.value;

      if (!selectedOption) return;

      updateMarkerWithAddress(type, selectedOption.address);
    };

    // 주소를 지도에 마커로 표시
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

          // 기존 마커 제거 및 새 마커 추가
          if (markers.value[type]) {
            markers.value[type].setMap(null);
          }

          markers.value[type] = new naver.maps.Marker({
            position: coords,
            map: map.value,
            title: address,
          });

          // 지도 중심 이동
          map.value.setCenter(coords);
        }
      );
    };

    const searchCompanion = async () => {
      if (startPoint.value && endPoint.value && startPoint.value.name === endPoint.value.name) {
        toast.add({
          severity: 'error',
          summary: '오류',
          detail: '들머리와 날머리를 다르게 선택해주세요.',
          life: 3000
        });
        endPoint.value = null; 
        return;
      }
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
      try {
        const formattedDate = departureDate.value ? departureDate.value.toISOString().split('T')[0] : '';
        const formattedTime = departureDate.value ? departureDate.value.toTimeString().split(' ')[0].slice(0, 5) : '';

        // API 구현 후 companionListd에 실제 데이터를 가져오는 로직으로 변경 필요
        const response = await axios.get(`http://localhost:8000/api/companion/${formattedDate}/${formattedTime}/`, {
         // start_point: startPoint.value.name,
         // end_point: endPoint.value.name,
        });
        // console.log(response);
        // 선택된 start_point와 end_point와 일치하고 max_participants가 max_participants 이하인 항목만 필터링
        companionList.value = response.data.filter(companion => 
          companion.start_point === startPoint.value.name && 
          companion.end_point === endPoint.value.name &&
          companion.max_participants >= max_participants.value
        );
        
        // 필터링된 데이터 이름을 한글로 변경
        companionList.value = companionList.value.map(companion => ({
          ...companion,
          start_point: startPoint.value.name,
          end_point: endPoint.value.name
        }));
        activeStep.value = 1;

      } catch (error) {
        console.error('Failed to submit:', error);
      }
    };

    const submitCompanion = async () => {
      try {
        // API 구현 후 실제 데이터를 가져오는 로직으로 변경 필요
        //await axios.post(`http://localhost:8000/api/carpool/`, {
        //});
        await axios.post(
          `http://localhost:8000/api/carpool/join/`, // 올바른 URL로 수정
          {
            room_id: selectedCompanion.value.room_id,
            service_type: "companion",
            participant_cnt: max_participants.value,
            start_point: "서울 강남구 가로수길 5", //임시값
          }, // 본문 내용이 없으므로 빈 객체를 보냄
          {
            withCredentials: true,
          }
        );
        activeStep.value = 3;

      } catch (error) {
        alert(error.response.data.error); 
        console.error('Failed to submit:', error);
      }
    };

    return {
      steps,
      activeStep,
      mountain,
      departureDate,
      startPoint,
      endPoint,
      max_participants,
      mountainOptions,
      routeOptions,
      updateMarker,
      onStepChange,
      searchCompanion,
      submitCompanion,
      companionList,
      selectedCompanion,
      handleCardClick,
      user,
      formatTime,
      formatDate,
    };
  },
};
</script>

<style scoped>
.carpool-title{
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
  flex-direction: column; /* Vertical layout */
  align-items: center; /* Center horizontally */
  gap: 20px; /* Space between buttons */
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

.companion-card {
  width: 100%;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.companion-card :deep(.p-card) {
  border: 1px solid #d4d4d4;
}

.companion-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.companion-card :deep(.p-card-title) {
  font-size: 1.2em;
  color: #2AAA8A;
}

.companion-card :deep(.p-card-content) {
  padding-top: 0.5rem;
}

.companion-card :deep(.p-card-content p) {
  margin: 0.5rem 0;
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

.point-info {
  display: flex;
  flex-direction: column;
}

.point-name {
  font-weight: bold;
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

.no-results-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2em;
  color: #666;
}
</style>