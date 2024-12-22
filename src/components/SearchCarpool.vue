<template>
  <div>
    <Stepper :value="activeStep.toString()" :model="steps">
    <StepPanels>
    <StepPanel value="0">
      <!-- Step 1 -->
      <h6 class = "service-title"> 등산 카풀 찾기 </h6>
      <div class="carpool-container">
        <!-- 추가 UI 요소 -->
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

          <!-- 출발지 검색 -->
          <div class="input-group">
            <InputText
              id="departure"
              v-model="startPoint"
              placeholder="출발지를 검색하세요"
              readonly
              class="p-inputtext-sm"
            />
          </div>
          <div class="input-group">
            <Button
              label="출발지 검색"
              icon="pi pi-search"
              @click="openPostcodePopup"
              class="p-button-sm">
            </Button>
          </div>

          <!-- 목적지 선택 -->
          <div class="input-group">
            <Dropdown
              id="end-point"
              v-model="endPoint"
              :options="routeOptions"
              optionLabel="name"
              placeholder="목적지 선택"
              class="p-dropdown-sm"
              @change="updateMarker('end')"
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
            @click="searchCarpool"
            icon="pi pi-check"
            class="p-button-sm">
          </Button>
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
import axios from 'axios';

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
  },
  setup() { 
    const activeStep = ref(0);
    const mountain = ref({ name: "설악산", id: 2 });
    const startPoint = ref(null);
    const endPoint = ref(null);
    const departureDate = ref(null);
    const max_participants = ref(null);

    const steps = ref([
      { label: 'Step 0' },
      { label: 'Step 1' },
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

    const onStepChange = (index) => {
      activeStep.value = index;
    };

    // 들머리와 날머리 옵션 및 주소 매핑
    const routeOptions = ref([
      { name: "소공원", address: "강원 속초시 설악산로 1055", englishName: "sogongwon" },
      { name: "한계령", address: "강원 양양군 설악로 1 중청봉대피소", englishName: "hangaeryoung" },
      { name: "오색", address: "강원 양양군 서면 대청봉길 95", englishName: "osaek" },
      { name: "백담사", address: "강원 인제군 북면 백담로 746", englishName: "baekdamsa" },
    ]);

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

    // 팝업 열기 (카카오 우편번호 API)
    const openPostcodePopup = () => {
      new daum.Postcode({
        oncomplete: function (data) {
          // 팝업에서 주소 선택 시 입력 필드에 채우기
          startPoint.value = data.address;

          // 주소로 좌표 변환 후 지도에 마커 표시
          updateMarkerWithAddress("start", data.address);
        },
      }).open();
    };

    // 선택된 목적지 주소로 마커 업데이트
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

    const searchCarpool = async () => {
      try {
        const response = await axios.post(`https://backend.santomato.com/api/carpool/`, {
          // 필요한 데이터를 여기에 추가
        });
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
      onStepChange,
      searchCarpool,
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

</style>