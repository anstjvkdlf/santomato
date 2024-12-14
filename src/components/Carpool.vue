<template>
  <div>
    <Stepper :value="activeStep.toString()" :model="steps">
    <StepPanels>
    <StepPanel value="0" >
      <!-- Step 0 -->
      <h6 class="carpool-title">생성할 서비스를 선택하세요.</h6>
      <div class="carpool-container">
        <!-- 들날 동행 버튼 -->
        <img
          :src="imageSrcs['companion']"
          alt="들날동행"
          @click="selectService('companion')"
          class="carpool-image"
        />
        <div class="button-with-tooltip">
          <div class="custom-button">
            <i class="pi pi-question-circle"></i>
            들날 동행
          </div>
          <span class="info-tooltip">차량 두대로 날머리에 도착한 뒤, 하나의 차량으로 함께 들머리로 이동합니다. 
            등산을 마치고 날머리에 주차된 차량을 이용해 함께 들머리로 돌아가 각자의 차량으로 이동합니다.</span>
        </div>

        <!-- 등산 카풀 버튼 -->
        <img
          :src="imageSrcs['carpool']"
          alt="등산카풀"
          @click="selectService('carpool')"
          class="carpool-image"
        />
        <div class="button-with-tooltip">
          <div class="custom-button">
            <i class="pi pi-question-circle"></i>
            등산 카풀
          </div>
          <span class="info-tooltip">일정 금액을 받고 등산 목적지까지 카풀 동행을 태워줍니다.</span>
        </div>
      </div>
    </StepPanel>

    <StepPanel value="1">
      <!-- Step 1 -->
      <div class="carpool-container">
        <!-- 라디오 버튼 그룹 -->
        <div class="radio-group">
          <RadioButton
            v-model="selectedMode"
            name="들날 동행"
            value="companion"
            class="p-radiobutton-sm"
          />
          <label for="companion" class="radio-label">들날 동행</label>
          <div class="info-icon">
            <i class="pi pi-question-circle p-button-secondary"></i>
            <span class="info-tooltip">차량 두대를 각각 들머리, 날머리에 주차하고 함께 이동합니다.</span>
          </div>

          <RadioButton
            v-model="selectedMode"
            name="등산 카풀"
            value="carpool"
            class="p-radiobutton-sm"
          />
          <label for="carpool" class="radio-label">등산 카풀</label>
          <div class="info-icon">
            <i class="pi pi-question-circle p-button-secondary"></i>
            <span class="info-tooltip">일정 금액을 받고 목적지까지 카풀 동행을 태워줍니다.</span>
          </div>
        </div>

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
          <div class="input-group" v-if="selectedMode === 'carpool'">
            <InputText
              id="departure"
              v-model="departureInput"
              placeholder="출발지를 검색하세요"
              readonly
              class="p-inputtext-sm"
            />
          </div>
          <div class="input-group" v-if="selectedMode === 'carpool'">
            <Button
              label="출발지 검색"
              icon="pi pi-search"
              @click="openPostcodePopup"
              class="p-button-sm">
            </Button>
          </div>

          <!-- 들머리 선택 -->
          <div class="input-group" v-if="selectedMode === 'companion'">
            <Dropdown
              id="start-location"
              v-model="startLocation"
              :options="routeOptions"
              optionLabel="name"
              placeholder="들머리 선택"
              class="p-dropdown-sm"
              @change="updateMarker('start')"
              :showClear="false"
            />
          </div>

          <!-- 날머리 선택 -->
          <div class="input-group" v-if="selectedMode === 'companion'">
            <Dropdown
              id="end-location"
              v-model="endLocation"
              :options="routeOptions"
              optionLabel="name"
              placeholder="날머리 선택"
              class="p-dropdown-sm"
              @change="updateMarker('end')"
              :showClear="false"
            />
          </div>

          <!-- 목적지 선택 -->
          <div class="input-group" v-if="selectedMode === 'carpool'">
            <Dropdown
              id="end-location"
              v-model="endLocation"
              :options="routeOptions"
              optionLabel="name"
              placeholder="목적지 선택"
              class="p-dropdown-sm"
              @change="updateMarker('end')"
            />
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

        <!-- 생성 버튼 -->
        <div class="input-group">
          <Button
            label="생성"
            @click="createCarpool"
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
import RadioButton from "primevue/radiobutton";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import DatePicker from "primevue/datepicker";
import Stepper from "primevue/stepper";
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';

export default {
  components: {
    Stepper,
    StepPanels,
    StepPanel,
    RadioButton,
    InputText,
    Button,
    Dropdown,
    DatePicker,
  },
  setup() { 
    const activeStep = ref(0);
    const selectedMode = ref("companion"); // Default value
    const mountain = ref({ name: "설악산", id: 2 });
    const departureInput = ref("");
    const departureDate = ref(null);
    const startLocation = ref(null);
    const endLocation = ref(null);

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

    const imageSrcs = {
      companion: new URL('@/assets/들날동행.png', import.meta.url).href,
      carpool: new URL('@/assets/등산카풀.png', import.meta.url).href,
    };

    const selectService = (type) => {
      selectedMode.value = type; // Set default radio button value
      activeStep.value = 1; // Move to Step 1
    };

    const onStepChange = (index) => {
      activeStep.value = index;
    };


    // 들머리와 날머리 옵션 및 주소 매핑
    const routeOptions = ref([
      { name: "소공원", address: "강원 속초시 설악산로 1055" },
      { name: "한계령", address: "강원 양양군 설악로 1 중청봉대피소" },
      { name: "오색", address: "강원 양양군 서면 대청봉길 95" },
      { name: "백담사", address: "강원 인제군 북면 백담로 746" },
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
          departureInput.value = data.address;

          // 주소로 좌표 변환 후 지도에 마커 표시
          updateMarkerWithAddress("start", data.address);
        },
      }).open();
    };

    // 선택된 들머리 또는 날머리의 주소로 마커 업데이트
    const updateMarker = (type) => {
      const selectedOption = type === "start" ? startLocation.value : endLocation.value;

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

    const createCarpool = async () => {
      try {
        await axios.post(`https://backend.santomato.com/api/carpool/`, {
          // 필요한 데이터를 여기에 추가
        });
      } catch (error) {
        console.error('Failed to submit:', error);
      }
    };

    return {
      steps,
      activeStep,
      selectedMode,
      mountain,
      departureInput,
      departureDate,
      startLocation,
      endLocation,
      mountainOptions,
      routeOptions,
      openPostcodePopup,
      updateMarker,
      imageSrcs,
      onStepChange,
      selectService,
      createCarpool,
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

.carpool-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  gap: 15px;
  box-sizing: border-box;
  width: 300px;
  min-height: 400px;
}
.button-with-tooltip {
  display: flex;
  flex-direction: column; 
  align-items: center;
  gap: 10px;
  position: relative;
  width: 100%;
}

.carpool-image {
  width: 150px; 
  cursor: pointer;
}

.info-tooltip {
  background-color: #333;
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 0.8em;
  position: absolute;
  top: 100%;
  display: none;
  z-index: 10;

  /* 줄바꿈 설정 */
  word-break: keep-all;
}

.button-with-tooltip:hover .info-tooltip {
  display: block;
}

/* Custom Button Styles */
.custom-button {
  background-color: transparent; /* 투명 배경 */
  border: none; /* 테두리 제거 */
  color: #555; /* 텍스트 색상 */
  font-size: 12px; /* 작은 폰트 크기 */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.custom-button i {
  font-size: 16px; /* 아이콘 크기 */
}

.custom-button:hover {
  color: #333; /* 호버 시 텍스트 색상 */
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

.radio-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.info-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
}

.info-icon:hover .info-tooltip {
  display: block;
  width: 250px;
  transform: translateX(-50%);
}

</style>