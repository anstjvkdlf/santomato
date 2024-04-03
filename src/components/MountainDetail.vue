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
