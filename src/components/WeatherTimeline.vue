<template>
  <div class="weather-timeline-container">

    <!-- Forecast Graph -->
    <div v-if="filteredForecastData.length && selectedDate">
      <div class="forecast-day-graph">
        <v-chart :option="chartOption" style="width: 100%; height: 280px;" v-if="chartOption" />
      </div>
      <div class="forecast-day">
        <div v-for="item in filteredForecastData" :key="item.dt" class="forecast-time">
          <div class="forecast-day-details">
            <p v-if="item.dt_txt">{{ item.dt_txt.split(" ")[1].substring(0, 5) }}</p>
            <span v-if="weatherDescriptionMap[item.weather[0].description]">
              <span v-html="weatherDescriptionMap[item.weather[0].description].icon"></span>
              <span>{{ weatherDescriptionMap[item.weather[0].description].description }}</span>
            </span>
            <span v-else>
              <span>❔ </span>
              <span>{{ item.weather[0].description }}</span>
            </span>
            <p>🌡️ {{ Math.round(item.main.temp) }}°C</p>
            <p v-if="item.weather[0].description.includes('snow')">
              💧 {{ item.snow ? `${item.snow['3h']} mm` : '없음' }}
            </p>
            <p v-else-if="item.rain">
              💧 {{ `${item.rain['3h'].toFixed(2)} mm` }}
            </p>
            <p v-else>💧 없음</p>
            <p>💨 {{ Math.round(item.wind.speed) }} m/s</p>
            <p v-if="item.wind.gust">🌪️ {{ Math.round(item.wind.gust) }} m/s </p>
            <p v-else>🌪️ 없음</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "WeatherTimeline",
    props: ["filteredForecastData", "chartOption", "selectedDate"],
  };
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

</style>