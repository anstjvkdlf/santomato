<template>
  <div class="page">
  <main class="main">
    <div class="date-navigation">
      <button @click="changeDate('prev')" :class="{ 'invisible': !canGoPrev }">⬅️</button>
      <span>{{ selectedDate }}</span>
      <button @click="changeDate('next')" :class="{ 'invisible': !canGoNext }">➡️</button>
    </div>
    <div v-if="filteredForecastData.length && selectedDate">
      <div class="weather-timeline">
        <button class="weather-timeline-button" @click="openPopup">전체 날씨보기</button>
        <WeatherTimeline v-if="showPopup"
                 @close="closePopup"
                 :filteredForecastData="filteredForecastData"
                 :chartOption="chartOption"
                 :selectedDate="selectedDate"
                 :canGoPrev="canGoPrev"
                 :canGoNext="canGoNext"
                 :changeDate="changeDate" />
      </div>
      <div class="weather-info">
      <div class="weather-detail">
        <div>🌡️ 기온</div>
        <div v-if="selectedDateTemperatures.minTemp !== null && selectedDateTemperatures.maxTemp !== null">
          {{ Math.round(selectedDateTemperatures.minTemp) }} °C / {{ Math.round(selectedDateTemperatures.maxTemp) }} °C
        </div>
      </div>
      <div class="weather-detail">
        <div v-if="isSnowOnSelectedDate">❄️ 총 적설량</div>
        <div v-else>💧 총 강수량</div>
        <div v-if="selectedDateTotalRainOrSnow !== null">{{selectedDateTotalRainOrSnow.toFixed(2) }} mm</div>
        <div v-else>없음</div>
      </div>
      <div class="weather-detail">
        <div>💨 최대 풍속</div>
        <div v-if="selectedDateMaxWindSpeed !== null">{{ Math.round(selectedDateMaxWindSpeed) }} m/s</div>
        <div v-else>없음</div>
      </div>
      <div class="weather-detail">
        <div>🌪️ 최대 돌풍</div>
        <div v-if="selectedDateMaxGust !== null">{{ Math.round(selectedDateMaxGust) }} m/s</div>
        <div v-else>없음</div>
      </div>
    </div>

    </div>
    <div v-else >
      <h2 class="weather-heading">현재 날씨</h2>
      <div class="weather-info">
      <div class="weather-detail">
        <div>🌡️ 기온</div>
        <div>{{ Math.round(weatherInfo?.main?.temp) }} °C</div>
      </div>
      <div class="weather-detail">
        <div>
          {{ weatherInfo?.snow ? '❄️ 적설량' : '💧 강수량' }}
        </div>
        <div>
          <template v-if="weatherInfo?.snow">
            {{ weatherInfo.snow['1h'] }} mm
          </template>
          <template v-else-if="weatherInfo?.rain">
            {{ weatherInfo.rain['1h'] }} mm
          </template>
          <template v-else>
            0.00 mm
          </template>
        </div>
      </div>
      <div class="weather-detail">
        <div>💨 풍속</div>
        <div>{{ weatherInfo?.wind?.speed? Math.round(weatherInfo?.wind?.speed) + ' m/s' : '없음' }}</div>
      </div>
      <div class="weather-detail">
        <div>🌪️ 돌풍</div>
        <div>{{ weatherInfo?.wind?.gust ? Math.round(weatherInfo?.wind?.gust) + ' m/s' : '없음' }}</div>
      </div>
    </div>
    </div>
  </main>
</div>
</template>

<script>
import WeatherTimeline from "@/components/WeatherTimeline.vue"
export default {
name: "MountainWeather",
props: ['id'],
components: {
  WeatherTimeline
},
data() {
  return {
    showPopup: false // 팝업 창 표시 여부
  };
},
methods: {
  openPopup() {
    this.showPopup = true; // 팝업 창 열기
  },
  closePopup() {
    this.showPopup = false; // 팝업 창 닫기
  }
}
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

// 강수량, 적설량 둘 다 있을 때 강수량으로 표기 (봄~가을)
const isSnowOnSelectedDate = computed(() => {
return filteredForecastData.value.every(item => 
  !item.rain && item.weather[0].description.includes("snow")
);
});
// 강수량, 적설량 둘 다 있을 때 적설량으로 표기 (겨울)
/*
const isSnowOnSelectedDate = computed(() => {
return filteredForecastData.value.some(item => item.weather[0].description.includes("snow"));
});
*/

</script>

<style scoped>

.main {
width: 100%;
border-radius: 25px;
color: black;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
}

.weather-heading{
justify-content: center;
text-align: center;
margin-bottom: 5px;
}

.weather-icon {
font-size: 3em;
}

.weather-description {
font-size: 0.8em;
}

.weather-info {
display: flex;
align-items: center;
background: #fff;
justify-content: center; 
padding: 5px;
border-radius: 10px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
margin: 20px;
white-space: nowrap;
}

.weather-detail {
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
flex-shrink: 0;
margin: 10px;
}
@media screen and (max-width: 600px) {
.weather-detail {
  font-size: 0.8em;
  margin: 2.5px;
}
}

.weather-detail-icon{
width: 100%; 
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
}

.loading {
text-align: center;
color: #888;
}

.date-navigation {
  display: flex;
  justify-content: center; /* 중앙 정렬을 강화 */
  align-items: center;
  text-align: center;
}

.date-navigation button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  opacity: 1; /* 기본적으로 버튼은 보임 */
  transition: opacity 0.3s;
}

.date-navigation button.invisible {
  opacity: 0; /* 버튼을 숨김 */
  pointer-events: none; /* 클릭 이벤트 무시 */
}

.weather-timeline {
justify-content: center;
text-align: center;
margin-bottom: 5px;
}

.weather-timeline-button {
background-color: #f3e91d; /* 배경색 */
border: none; /* 테두리 제거 */
color: black; /* 글자색 */
padding: 5px 10px; /* 안쪽 여백 */
text-align: center; /* 가운데 정렬 */
text-decoration: none; /* 밑줄 제거 */
display: inline-block;
font-size: 12px; /* 글꼴 크기 */
margin: 4px 2px; /* 바깥 여백 */
cursor: pointer; /* 커서 모양 */
border-radius: 8px; /* 모서리 둥글게 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 */
}

.weather-timeline-button:hover {
background-color: #fff702; /* 마우스 호버 시 배경색 변경 */
}
</style>
