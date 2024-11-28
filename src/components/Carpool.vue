<template>
  <div class="carpool-container">
    <div class="search-section">
      <!-- 출발지 검색 -->
      <div class="input-group">
        <InputText
          id="start-location"
          v-model="startLocationInput"
          placeholder="출발지를 검색하세요"
          readonly
          class="p-inputtext-sm"
        />
        <Button label="출발지 검색" icon="pi pi-search" @click="openPostcodePopup" class="p-button-sm" />
      </div>

      <!-- 들머리 선택 -->
      <div class="input-group">
        <Dropdown
          id="entrance-location"
          v-model="entranceLocation"
          :options="routeOptions"
          optionLabel="name"
          placeholder="들머리 선택"
          class="p-dropdown-sm"
          @change="updateMarker('entrance')"
        />
      </div>

      <!-- 날머리 선택 -->
      <div class="input-group">
        <Dropdown
          id="exit-location"
          v-model="exitLocation"
          :options="routeOptions"
          optionLabel="name"
          placeholder="날머리 선택"
          class="p-dropdown-sm"
          @change="updateMarker('exit')"
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
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import DatePicker from "primevue/datepicker";

export default {
  components: {
    InputText,
    Button,
    Dropdown,
    DatePicker,
  },
  setup() {
    const startLocationInput = ref("");
    const startDate = ref(null);
    const entranceLocation = ref(null);
    const exitLocation = ref(null);

    const map = ref(null);
    const markers = ref({
      start: null,
      entrance: null,
      exit: null,
    });

    // 들머리와 날머리 옵션 및 주소 매핑
    const routeOptions = ref([
      { name: "소공원", address: "강원 속초시 설악산로 1055" },
      { name: "한계령", address: "강원 양양군 설악로 1 중청봉대피소" },
      { name: "장수대", address: "강원 인제군 설악로 4193" },
      { name: "오색", address: "강원 양양군 서면 대청봉길 95" },
      { name: "오세암", address: "강원 인제군 북면 용대리 산75" },
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
          startLocationInput.value = data.address;

          // 주소로 좌표 변환 후 지도에 마커 표시
          updateMarkerWithAddress("start", data.address);
        },
      }).open();
    };

    // 선택된 들머리 또는 날머리의 주소로 마커 업데이트
    const updateMarker = (type) => {
      const selectedOption = type === "entrance" ? entranceLocation.value : exitLocation.value;

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
      startLocationInput,
      startDate,
      entranceLocation,
      exitLocation,
      routeOptions,
      openPostcodePopup,
      updateMarker,
    };
  },
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
  min-height: 100vh;
  width: 300px;
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
</style>
