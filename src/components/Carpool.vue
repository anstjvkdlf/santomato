<template>
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
          id="start-date"
          v-model="startDate"
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
</template>

<script>
import { ref, onMounted } from "vue";
import RadioButton from "primevue/radiobutton";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import DatePicker from "primevue/datepicker";

export default {
  components: {
    RadioButton,
    InputText,
    Button,
    Dropdown,
    DatePicker,
  },
  props: {
    type: String,
  },
  setup(props) { 
    const selectedMode = ref(props.type || "companion"); // default mode
    const mountain = ref({ name: "설악산", id: 2 });
    const departureInput = ref("");
    const departureDate = ref(null);
    const startLocation = ref(null);
    const endLocation = ref(null);

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

    return {
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
    };
  },

  method: {
    async createCarpool() {
      try {
          await axios.post(`https://backend.santomato.com/api/carpool/`, {
            
          });
          } catch (error) {
          console.error('Failed to sumbit:', error);
      }
    },
  }
};
</script>

<style scoped>
.carpool-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  gap: 15px;
  box-sizing: border-box;
  width: 300px;
  height: 700px;
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

.info-tooltip {
  background-color: #333;
  color: white;
  padding: 5px;
  border-radius: 5px;
  white-space: nowrap;
  font-size: 0.8em;
  position: absolute;
  top: 30px;
  transform: translateX(-50%);
  display: none;
  z-index: 10;
}

.info-icon:hover .info-tooltip {
  display: block;
}
</style>
