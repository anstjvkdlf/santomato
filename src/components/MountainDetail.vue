<template>
    <div>
      <div class="mountain-weather">
        <MountainWeather :id="id"/>
      </div>
      <div class="image-container">
        <button class="cctv-button" v-if="mountain.cctv_url !== 'blank'" @click="openCCTVNewTab(mountain.cctv_url)">실시간 CCTV</button>
        <img class="mountainRoute" v-if="mountain.status === '통제' && mountain.dead_image_url" :src="mountain.dead_image_url" alt="산통제정보" @click="openImageInNewTab(mountain.dead_image_url)" style="cursor: pointer;">
        <img class="mountainRoute" v-if="mountain.status === '정상' && mountain.alive_image" :src="`http://13.210.210.221:8000/` + mountain.alive_image" alt="정상탐방로" @click="openImageInNewTab(`http://13.210.210.221:8000/` + mountain.alive_image)" style="cursor: pointer;">
        <div class="description" v-html="mountain.description"></div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import MountainWeather from './MountainWeather.vue';

export default {
  components: {
    MountainWeather
  },
  props: ['id'],
  data() {
    return {
      mountain: {}
    }
  },
  methods: {
    fetchMountainData() {
      const apiUrl = `http://13.210.210.221:8000/api/${this.id}`
      axios.get(apiUrl)
        .then(response => {
          this.mountain = response.data.data;
        })
        .catch(error => {
          console.error('Failed to fetch store data:', error);
        });
    },
    openImageInNewTab(imageUrl) {
      window.open(imageUrl, '_blank');
    },
    openCCTVNewTab(cctvUrl) {
      window.open(cctvUrl, '_blank');
    }
  },
  created() {
    this.fetchMountainData();
  }
}
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
  default:
    // 기본값 설정
    cityNameKor = '서울';
}

const city = ref(cityNameKor)

const weatherInfo = ref(null);
const weatherInfoForecast = reactive({});
const selectedDate = ref('');
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
    console.log(weatherInfo)
    console.log(weatherInfoForecast )

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
  'mist': { icon: '🌫️', description: '안개' }
};

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


const excludedTimes = ['00:00', '03:00', '21:00'];

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
/*
const isSnowOnSelectedDate = computed(() => {
  return filteredForecastData.value.every(item => 
    !item.rain && item.weather[0].description.includes("snow")
  );
});*/
// 강수량, 적설량 둘 다 있을 때 적설량으로 표기 (겨울)
const isSnowOnSelectedDate = computed(() => {
  return filteredForecastData.value.some(item => item.weather[0].description.includes("snow"));
});

</script>

<style scoped>

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 15px;
  text-align: center;
}

.mountainRoute {
  max-width: 50%; /* 이미지 너비를 최대로 지정 */
  height: auto;
  margin-bottom: 20px;
}

.description {
  margin-bottom: 30px;
  display: flex;
  text-align: left; /* 텍스트를 가운데 정렬 */
}

.cctv-button {
  background-color: #4CAF50; /* 배경색 */
  border: none; /* 테두리 제거 */
  color: white; /* 글자색 */
  padding: 10px 20px; /* 안쪽 여백 */
  text-align: center; /* 가운데 정렬 */
  text-decoration: none; /* 밑줄 제거 */
  display: inline-block;
  font-size: 16px; /* 글꼴 크기 */
  margin: 4px 2px; /* 바깥 여백 */
  cursor: pointer; /* 커서 모양 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 */
}

.cctv-button:hover {
  background-color: #45a049; /* 마우스 호버 시 배경색 변경 */
}


@media only screen and (max-width: 767px) {
  .mountainRoute {
  max-width: 90%; /* 이미지 너비를 최대로 지정 */
  height: auto;
  margin-bottom: 20px;
}
  .description{
    margin-bottom: 30px;
    margin-left: 10px;
    margin-right: 10px;
    display: flex;
    text-align: left; /* 텍스트를 가운데 정렬 */
  }
}
</style>
