<template>
  <div class="popup">
    <!-- 팝업 내용 -->
    <div class="popup-content">
      <!-- 팝업 내용 -->
      <h2>팝업 창</h2>
      <!-- 팝업 내용 -->
      <p>팝업 내용을 이곳에 넣으세요.</p>
      <!-- 팝업 닫기 버튼 -->
        <div v-if="filteredForecastData.length && selectedDate">
        <div class="forecast-day-graph">
          <v-chart :option="chartOption" style="width: 350px; height: 200px;" v-if="chartOption"/>
        </div>
        <div class="forecast-day">
          <div v-for="item in filteredForecastData" :key="item.dt" class="forecast-time">
            <div class="forecast-day-details" >
              <p v-if="item.dt_txt">{{ item.dt_txt.split(' ')[1].substring(0, 5) }}</p>
              <span v-html="weatherDescriptionMap[item.weather[0].description]?.icon"></span>
              <span> {{ weatherDescriptionMap[item.weather[0].description]?.description }}</span>
              <p>🌡️ {{  Math.round(item.main.temp) }}°C</p>
              <p v-if="item.weather[0].description.includes('snow')">
                💧 {{ item.snow ? `${item.snow['3h']} mm` : '없음' }}
              </p>
              <p v-else-if="item.rain">
                💧 {{ `${item.rain['3h'].toFixed(2)} mm` }}
              </p>
              <p v-else>
                💧 없음
              </p>
              <p>💨 {{ Math.round(item.wind.speed) }} m/s</p>
              <p v-if="item.wind.gust">🌪️ {{ Math.round(item.wind.gust) }} m/s </p>
              <p v-else>🌪️ 없음</p>
            </div>
          </div>
        </div>
      </div>

    <button @click="closePopup">닫기</button>
    </div>
  </div>
</template>

<script>
export default {
    name: "WeatherTimeline",
    methods: {
    closePopup() {
      this.$emit('close'); // 부모 컴포넌트에 닫기 이벤트 전달
    }
  }
}
</script>

<style>
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

    .forecast-day-graph {
    width: 400px;
    height: 300px;
    margin-left: 10px;
    margin-right: 10px;
    /* display: flex; 
    justify-content: center; 
    .v-chart {
        width: 100%; 
        max-width: 400px; 
    } */
    }

    .forecast-day {
    width: 400px;
    /* margin: 0 auto; */
    justify-content: space-around; 
    align-items: flex-start;
    text-align: center;
    display: flex;
    flex-wrap: wrap;

    }

    .forecast-day-details {
    justify-content: start;
    align-items: center;
    }
    .forecast-day-details, .forecast-day-details * {
    font-size: 0.9em !important;
    }

    .forecast-time {
    padding: 5px;
    }
    .forecast-time p {
    margin: 0;
    padding: 2px;
    }
</style>