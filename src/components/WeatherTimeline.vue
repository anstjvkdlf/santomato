<template>
  <div class="weather-timeline-container">
    <!-- Forecast Graph -->
    <div v-if="filteredForecastData.length && selectedDate">
      <div class="forecast-day-graph">
        <v-chart :option="chartOption" style="width: 100%; height: 100%;" v-if="chartOption" />
      </div>
      <div class="forecast-day">
        <div v-for="item in filteredForecastData" :key="item.dt" class="forecast-time">
          <div class="forecast-day-details">
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
  'light rain' : { icon: '☔', description: '약한 비' },
  'thunderstorm': { icon: '⚡', description: '천둥번개' },
  'snow': { icon: '❄️', description: '눈' },
  'light snow' :  { icon: '🌨️', description: '약한 눈' },
  'mist': { icon: '🌫️', description: '안개' },
  'heavy intensity rain': { icon: '⛈️', description: '폭우' },
};
</script>

<style>
.weather-timeline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.forecast-day-graph {
  width: 500px;
  height: 270px;
  display: flex;
  justify-content: center;
  align-items: center; 
}

.forecast-day {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center; 
  text-align: center;
  overflow-x: auto;
  white-space: nowrap;
}

.forecast-day-details {
  display: flex;
  flex-direction: column;
  align-items: center; 
}

.forecast-day-details, .forecast-day-details * {
  font-size: 0.9em !important;
}

.forecast-time p {
  margin: 0;
  padding: 2px;
}
/* Responsive adjustments */
@media (max-width: 768px) {
  .forecast-day-graph {
    width: 100%; 
    height: 240px;
  }
  .forecast-day {
    justify-content: flex-start; 
    gap: 10px; 
  }
}

@media (max-width: 480px) {
  .forecast-day-graph {
    width: 100%;
    height: 200px;
  }
  .forecast-day {
    justify-content: flex-start;
    gap: 8px;
  }
  .forecast-day-details, .forecast-day-details * {
    font-size: 0.8em !important; 
  }
}
</style>
