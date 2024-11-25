<template>
  <div class="carpool-container">
    <div class="search-section">
      <div>
        <input id="start-location" v-model="startLocation" placeholder="출발지를 입력하세요" />
        <button @click="searchAddress('start')">출발지 검색</button>
      </div>
      <div>
        <input id="entrance-location" v-model="entranceLocation" placeholder="들머리를 입력하세요" />
        <button @click="searchAddress('entrance')">들머리 검색</button>
      </div>
      <div>
        <input id="exit-location" v-model="exitLocation" placeholder="날머리를 입력하세요" />
        <button @click="searchAddress('exit')">날머리 검색</button>
      </div>
      <div>
        <DatePicker
          id="date"
          v-model="selectedDate" 
          showTime hourFormat="12" fluid
          placeholder="일정 선택"
        />
      </div>
    </div>
    <div id="map" class="map-container"></div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import DatePicker from "primevue/datepicker";

export default {
  components: {
    DatePicker,
  },
  setup() {
    const selectedDate = ref(null);
    const startLocation = ref("");
    const entranceLocation = ref("");
    const exitLocation = ref("");
    const map = ref(null);
    const mapCenter = ref({ lat: 37.5665, lng: 126.978 }); // 서울 좌표

    // 지도 초기화
    onMounted(() => {
      // 네이버 지도 API가 로드되었는지 확인
      if (!window.naver || !window.naver.maps) {
        console.error("네이버 지도 API가 로드되지 않았습니다.");
        return;
      }

      const mapOptions = {
        center: new naver.maps.LatLng(mapCenter.value.lat, mapCenter.value.lng),
        zoom: 12,
      };
      map.value = new naver.maps.Map('map', mapOptions);
    });

    // 주소 검색 함수
    const searchAddress = (locationType) => {
      if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
        alert("네이버 지도 API가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      let locationValue = '';

      // 입력된 주소 가져오기
      if (locationType === 'start') {
        locationValue = startLocation.value;
      } else if (locationType === 'entrance') {
        locationValue = entranceLocation.value;
      } else if (locationType === 'exit') {
        locationValue = exitLocation.value;
      }

      if (!locationValue) {
        alert("주소를 입력해주세요.");
        return;
      }

      // 네이버 지도 API를 사용해 주소 검색
      naver.maps.Service.geocode(
        { query: locationValue },
        (status, response) => {
          if (status !== naver.maps.Service.Status.OK) {
            alert("주소를 찾을 수 없습니다.");
            return;
          }

          const result = response.v2.addresses[0];
          const coords = new naver.maps.LatLng(result.y, result.x);

          // 지도에 마커 표시
          const marker = new naver.maps.Marker({
            position: coords,
            map: map.value,
            title: locationType === 'start' ? '출발지' : locationType === 'entrance' ? '들머리' : '날머리'
          });

          // 지도 중심을 해당 좌표로 이동
          map.value.setCenter(coords);
          map.value.setZoom(15);
        }
      );
    };

    return {
      selectedDate,
      startLocation,
      entranceLocation,
      exitLocation,
      mapCenter,
      searchAddress,
    };
  },
};
</script>

<style scoped>
.carpool-container {
  display: flex;
  max-width: 300px;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  gap: 15px;
  box-sizing: border-box;
  min-height: 100vh; 
  position: relative;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

label {
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.map-container {
  margin-top: 15px;
  width: 100%;
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}
</style>
