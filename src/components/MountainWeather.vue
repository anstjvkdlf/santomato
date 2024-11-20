<template>
  <div class="page">
    <!-- 날짜 네비게이션 -->
    <div class="navigation-container">
      <h2 class="page-title">⛰️ 산 정상 날씨</h2>
      <div class="date-navigation">
        <Button
          icon="pi pi-chevron-left"
          @click="changeDate('prev')"
          :disabled="!canGoPrev"
          class="p-button-rounded"
          size="small"
        />
        <span>{{ selectedDate }} ({{ dayOfWeek }})</span>
        <Button
          icon="pi pi-chevron-right"
          @click="changeDate('next')"
          :disabled="!canGoNext"
          class="p-button-rounded"
          size="small"
        />
      </div>
    </div>

    <!-- weather-info -->
    <main class="main-layout">
      <div class="weather-info-container">
        <div class="temperature-large">
          <div class="temperature-title">🌡️ 최저 / 최고 기온</div>
          <div class="temperature-values">{{ Math.round(selectedDateTemperatures.minTemp) }} / {{ Math.round(selectedDateTemperatures.maxTemp) }} °C</div>
        </div>
        
        <div class="other-weather-info">
          <div class="weather-item">
            <div class="weather-title">{{ isSnowOnSelectedDate ? '❄️ 총 적설량' : '💧 총 강수량' }}</div>
            <div class="weather-value">{{ selectedDateTotalRainOrSnow.toFixed(2) }} mm</div>
          </div>
          <div class="weather-item">
            <div class="weather-title">💨 최고 풍속</div>
            <div class="weather-value">{{ Math.round(selectedDateMaxWindSpeed) }} m/s</div>
          </div>
          <div class="weather-item">
            <div class="weather-title">🌪️ 최대 돌풍</div>
            <div class="weather-value">{{ Math.round(selectedDateMaxGust) }} m/s</div>
          </div>
        </div>
      </div>

      <!-- WeatherTimeline -->
      <div class="weather-timeline">
        <WeatherTimeline
          :filteredForecastData="filteredForecastData || []"
          :chartOption="chartOption || {}"
          :selectedDate="selectedDate || ''"
          :canGoPrev="canGoPrev"
          :canGoNext="canGoNext"
          :changeDate="changeDate"
        />
      </div>
    </main>
  </div>
</template>


<script>
import WeatherTimeline from "@/components/WeatherTimeline.vue";
import Button from 'primevue/button';

export default {
  name: "MountainWeather",
  props: ["id"],
  components: {
    WeatherTimeline,
    Button,
  },
};
</script>

<script setup>
import { ref, onMounted, watch, reactive, computed } from 'vue';
import { API_KEY, BASE_URL, BASE_URL_FORECAST } from '../constants/index';

import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
TitleComponent,
TooltipComponent,
GridComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';

echarts.use([
TitleComponent,
TooltipComponent,
GridComponent,
LineChart,
CanvasRenderer
]);


const props = defineProps(['id']);
let cityNameKor = '';
let latitude = 0;
let longtitude = 0;

switch (parseInt(props.id)) {
case 1:
  cityNameKor = '소백산';
  latitude = 36.9574906;
  longtitude = 128.4848843;
  break;
case 2:
  cityNameKor = '설악산';
  latitude = 38.1191376;
  longtitude = 128.4654324;
  break;
case 3:
  cityNameKor = '지리산';
  latitude = 35.3371088;
  longtitude = 127.7306952;
  break;
case 4:
  cityNameKor = '덕유산';
  latitude = 35.859908;
  longtitude = 127.746348;
  break;
case 5:
  cityNameKor = '가야산';
  latitude = 35.824953;
  longtitude = 128.119456;
  break;
case 6:
  cityNameKor = '북한산';
  latitude = 37.658931;
  longtitude = 126.977863;
  break;
case 8:
  cityNameKor = '월악산';
  latitude = 36.885850;
  longtitude = 127.105983;
  break;
case 9:
  cityNameKor = '계룡산';
  latitude = 36.351988;
  longtitude = 127.200391;
  break;
case 10:
  cityNameKor = '내장산';
  latitude = 35.478381;
  longtitude = 126.889014;
  break;
case 12:
  cityNameKor = '무등산';
  latitude = 35.121231;
  longtitude = 127.002920;
  break;
case 14:
  cityNameKor = '속리산';
  latitude = 36.543179;
  longtitude = 127.870750;
  break;
case 15:
  cityNameKor = '오대산';
  latitude = 37.794443;
  longtitude = 128.543581;
  break;
case 16:
  cityNameKor = '월출산';
  latitude = 34.766716;
  longtitude = 126.704170;
  break;
case 17:
  cityNameKor = '주왕산';
  latitude = 36.401330;
  longtitude = 129.203877;
  break;
case 18:
  cityNameKor = '치악산';
  latitude = 37.365124;
  longtitude = 128.055562;
  break;
case 19:
  cityNameKor = '태백산';
  latitude = 37.161537;
  longtitude = 128.917626;
  break;
case 21:
  cityNameKor = '팔공산';
  latitude = 36.016555;
  longtitude = 128.695349;
  break;
case 22:
  cityNameKor = '한라산';
  latitude = 33.3617;
  longtitude = 126.5297;
  break;
default:
  // 기본값 설정
  cityNameKor = '서울';
}

const city = ref(cityNameKor)

const weatherInfo = ref(null);
const weatherInfoForecast = reactive({});
const selectedDate = ref('');
const canGoPrev = computed(() => {
  const index = forecastDates.value.indexOf(selectedDate.value);
  return index > 0; // 0보다 크면 이전 버튼 활성화
});
const canGoNext = computed(() => {
  const index = forecastDates.value.indexOf(selectedDate.value);
  return index < forecastDates.value.length - 1; // 마지막 인덱스보다 작으면 다음 버튼 활성화
});
const forecastDates = ref([]);
const isError = computed(() => weatherInfo.value?.cod !== 200);
const isErrorForecast = computed(() => weatherInfoForecast.value?.cod !== 200);
const overallMinTemp = ref(Number.POSITIVE_INFINITY);
const overallMaxTemp = ref(Number.NEGATIVE_INFINITY);

const convertToKST = (utcDateTime) => {
const date = new Date(utcDateTime);
date.setHours(date.getHours() + 9); // UTC에서 KST로 변환하기 위해 9시간 더함

// YYYY-MM-DD HH:MM 형식으로 포맷팅
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
const day = String(date.getDate()).padStart(2, '0');
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const getWeather = async () => {
try {
  const response = await fetch(`${BASE_URL}?lat=${latitude}&lon=${longtitude}&units=metric&appid=${API_KEY}`);
const response_forecast = await fetch(`${BASE_URL_FORECAST}?lat=${latitude}&lon=${longtitude}&units=metric&appid=${API_KEY}`);
  weatherInfo.value = await response.json();
  weatherInfoForecast.value = (await response_forecast.json()).list

  .map(item => {
    return { ...item, dt_txt: convertToKST(item.dt_txt) }; 
  });

  const allTemperatures = Object.values(weatherInfoForecast.value).flat().map(item => Math.round(item.main.temp));
  overallMinTemp.value = Math.min(...allTemperatures);
  overallMaxTemp.value = Math.max(...allTemperatures);

} catch (error) {
  console.log(error)
  isError.value = true;
  isErrorForecast.value = true;
}
};

const chartOption = ref({});

watch(selectedDate, (newDate) => {
if (newDate && weatherInfoForecast[newDate]) {
  const chartData = filteredForecastData.value.map(item => ({
    date: item.dt_txt.split(' ')[1].substring(0, 5),
    temp: Math.round(item.main.temp)
  }));

  chartOption.value = {
    xAxis: {
      type: 'category',
      data: chartData.map(data => data.date)
    },
    yAxis: {
      type: 'value',
      min: overallMinTemp,
      max: overallMaxTemp
    },
    series: [{
      data: chartData.map(data => data.temp),
      type: 'line',
      label: {
        show: true, 
        position: 'top', 
        formatter: '{c}°C' 
      }
    }]
  };
}
}, { immediate: true });

const groupForecastByDate = (forecastData) => {
const groupedData = {};
forecastData.forEach(item => {
  const date = item.dt_txt.split(' ')[0];
  if (!groupedData[date]) {
    groupedData[date] = [];
  }
  groupedData[date].push(item);
});
return groupedData;
};

onMounted(async () => {
  await getWeather();

  if (weatherInfoForecast .value) {
    const groupedForecast = groupForecastByDate(weatherInfoForecast.value);
    // 반응형 객체에 데이터 할당
    for (const date in groupedForecast) {
      weatherInfoForecast[date] = groupedForecast[date];
    }
    forecastDates.value = Object.keys(groupedForecast);
    selectedDate.value = forecastDates.value[0];
  }
});

const changeDate = (direction) => {
  const currentIndex = forecastDates.value.indexOf(selectedDate.value);
  if (direction === 'next' && currentIndex < forecastDates.value.length - 1) {
    selectedDate.value = forecastDates.value[currentIndex + 1];
  } else if (direction === 'prev' && currentIndex > 0) {
    selectedDate.value = forecastDates.value[currentIndex - 1];
  }
};

const dayOfWeek = computed(() => {
  if (!selectedDate.value) return '';
  const date = new Date(selectedDate.value);
  return date.toLocaleDateString('ko-KR', { weekday: 'short' }).slice(0, 1);
});

const filteredForecastData = computed(() => {
  if (!selectedDate.value || !weatherInfoForecast[selectedDate.value]) {
    return [];
}

return weatherInfoForecast[selectedDate.value]
  .filter(item => !excludedTimes.includes(item.dt_txt.split(' ')[1].substring(0, 5)));
});


const excludedTimes = ['00:00', '03:00'];

const selectedDateTemperatures = computed(() => {
  if (!selectedDate.value || !weatherInfoForecast[selectedDate.value]) {
    return { minTemp: null, maxTemp: null };
  }
  const temps = weatherInfoForecast[selectedDate.value]
    .filter(item => !excludedTimes.includes(item.dt_txt.split(' ')[1].substring(0, 5)))
    .map(item => item.main.temp);

  return {
    minTemp: Math.min(...temps),
    maxTemp: Math.max(...temps)
  };
});

const selectedDateTotalRainOrSnow = computed(() => {
  if (!selectedDate.value || !weatherInfoForecast[selectedDate.value]) {
    return 0;
}

return weatherInfoForecast[selectedDate.value]
  .filter(item => !excludedTimes.includes(item.dt_txt.split(' ')[1].substring(0, 5)))
  .reduce((total, item) => {
    if (item.weather[0].description.includes("snow")) {
      return total + (item.snow ? item.snow['3h'] : 0);
    }
    return total + (item.rain ? item.rain['3h'] : 0);
  }, 0);
});

const selectedDateMaxWindSpeed = computed(() => {
  if (!selectedDate.value || !weatherInfoForecast[selectedDate.value]) {
    return null;
}

return Math.max(...weatherInfoForecast[selectedDate.value]
  .filter(item => !excludedTimes.includes(item.dt_txt.split(' ')[1].substring(0, 5)))
  .map(item => item.wind.speed));
});

const selectedDateMaxGust = computed(() => {
  if (!selectedDate.value || !weatherInfoForecast[selectedDate.value]) {
    return null;
}
return Math.max(...weatherInfoForecast[selectedDate.value]
  .filter(item => !excludedTimes.includes(item.dt_txt.split(' ')[1].substring(0, 5)))
  .map(item => item.wind.gust || 0));
});

const timezone = computed(() => weatherInfo.value?.timezone)


// 강수량, 적설량 둘 다 있을 때 강수량으로 표기 (봄~가을)
/*
const isSnowOnSelectedDate = computed(() => {
return filteredForecastData.value.every(item => 
  !item.rain && item.weather[0].description.includes("snow")
);
});
*/

// 강수량, 적설량 둘 다 있을 때 적설량으로 표기 (겨울)
const isSnowOnSelectedDate = computed(() => {
return filteredForecastData.value.some(item => item.weather[0].description.includes("snow"));
});
</script>

<style lang="scss" scoped>
@use '../assets/styles/main.scss' as *;

.navigation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  position: relative;
  margin-bottom: 15px;
}

.page-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 15px 0;
}

.date-navigation {
  display: flex;
  align-items: center;
  position: absolute;
  right: 0; /* 오른쪽에 고정 */
}

.date-navigation span {
  font-size: 1.1rem;
  margin: 0 0.5rem;
}

.date-navigation .p-button {
  background-color: white;
  border: none;
  color: #2196F3;
  border-radius: 4px;
}

.date-navigation .p-button:hover {
  background-color: #e4f0fb;
  color: #2196F3;
  border: none;
}

.date-navigation .p-button:disabled {
  background-color: transparent;
  color: transparent;
  cursor: default;
}

.main-layout {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  gap: 20px;
  padding: 0 30px;
}

.left-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.weather-info-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  gap: 20px;
}

.temperature-large {
  text-align: center;
}

.temperature-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.temperature-values {
  font-size: 1.6rem;
  color: #333;
}

.other-weather-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.weather-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
  gap: 5px;
}

.weather-item:last-child {
  border-bottom: none;
}

.weather-title {
  font-size: 0.9rem;
  color: #555;
}

.weather-value {
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
}

.weather-timeline {
  flex: 2;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .main-layout {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 768px) {
  .navigation-container {
    flex-direction: column;
    align-items: center;
  }

  .page-title {
    font-size: 1.2rem;
    margin: 5px 0;
  }

  .date-navigation {
    position: static;
  }

  .date-navigation span {
    font-size: 0.9rem;
  }
  
  .temperature-values{
    font-size: 1.2rem;
  }

  .temperature-title,
  .weather-title,
  .weather-value {
    font-size: 0.9rem;
  }

  .weather-info-container {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  }

  .temperature-large {
    flex: 1;
    min-width: 100%;
  }

  .other-weather-info {
    flex: 1;
    min-width: 100%;
  }

  .weather-timeline {
    width: 100%;
    margin: 0 auto; 
    padding: 10px;
    border: none;
  }
}
</style>
