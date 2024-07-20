<template>
  <div class="popup">
    <div class="popup-content">
      <!-- 오른쪽 상단에 X 표시를 추가한 닫기 버튼 -->
      <button class="close-button" @click="closePopup">X</button>
      <button @click="changeDate('prev')" :class="{ 'invisible': !canGoPrev }">⬅️</button>
      <span>{{ selectedDate }}</span>
      <button @click="changeDate('next')" :class="{ 'invisible': !canGoNext }">➡️</button>
      <div v-if="filteredForecastData.length && selectedDate">
        <div class="forecast-day-graph">
          <v-chart :option="chartOption" style="width: 100%; height: 200px;" v-if="chartOption"/>
        </div>
        <div class="forecast-day">
          <div v-for="item in filteredForecastData" :key="item.dt" class="forecast-time">
            <div class="forecast-day-details" >
              <p v-if="item.dt_txt">{{ item.dt_txt.split(' ')[1].substring(0, 5) }}</p>
              <span v-if="weatherDescriptionMap[item.weather[0].description]">
                <span v-html="weatherDescriptionMap[item.weather[0].description].icon"></span>
                <span>{{ weatherDescriptionMap[item.weather[0].description].description }}</span>
              </span>
              <span v-else>
                <span>❔ </span>
                <span>{{ item.weather[0].description }}</span>
              </span>
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
    </div>
  </div>
</template>

<script>
export default {
    name: "WeatherTimeline",
    props: ['filteredForecastData', 'chartOption', 'selectedDate', 'canGoPrev', 'canGoNext', 'changeDate'],
    methods: {
      closePopup() {
        this.$emit('close'); // 부모 컴포넌트에 닫기 이벤트 전달
      },
    }
}
</script>

<script setup>
import VChart from 'vue-echarts';

const weatherDescriptionMap = {
  'clear sky': { icon: '☀️', description: '맑음' },
  'few clouds': { icon: '🌤️', description: '구름 조금' },
  'scattered clouds': { icon: '⛅', description: '구름' },
  'broken clouds': { icon: '🌥️', description: '구름' },
  'overcast clouds': { icon: '☁️', description: '구름 많음' },
  'shower rain': { icon: '🌦️', description: '소나기' },
  'rain': { icon: '🌧️', description: '비' },
  'moderate rain' : { icon: '🌧️', description: '비' },
  'light rain' : { icon: '☔', description: '비 조금' },
  'thunderstorm': { icon: '⚡', description: '천둥번개' },
  'snow': { icon: '❄️', description: '눈' },
  'light snow' :  { icon: '🌨️', description: '약한 눈' },
  'mist': { icon: '🌫️', description: '안개' },
  'heavy intensity rain': { icon: '⛈️', description: '폭우' },
};
</script>

<style>
.popup {
  width: 80%;
  max-width: 600px; /* 팝업 최대 너비 지정 */
  height: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  overflow: auto; /* 내용이 넘칠 경우 스크롤 표시 */
}

/* 닫기 버튼 스타일 */
.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 5px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.forecast-day-graph {
  width: 100%;
  margin: 10px 0;
  display: flex; 
  justify-content: center; 
}

.forecast-day {
  width: 100%;
  margin: 0 auto;
  justify-content: space-around; 
  align-items: flex-start;
  text-align: center;
  display: flex;
  overflow-x: auto;
  white-space: nowrap; 
}

.forecast-day-details {
  justify-content: start;
  align-items: center;
}

.forecast-day-details, .forecast-day-details * {
  font-size: 0.9em !important;
}

.forecast-time {
  padding: 4px;
}

.forecast-time p {
  margin: 0;
  padding: 2px;
}

.popup-content button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  opacity: 1; /* 기본적으로 버튼은 보임 */
  transition: opacity 0.3s;
}

.popup-content button.invisible {
  opacity: 0; /* 버튼을 숨김 */
  pointer-events: none; /* 클릭 이벤트 무시 */
}

</style>