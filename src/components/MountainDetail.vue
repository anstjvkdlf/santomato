<template>
  <div>
    <div class="mountain-name">{{ mountain.name }}</div>
    <div class="mountain-weather">
      <MountainWeather :id="id"/>
    </div>
    <div class="image-container">
      <button class="cctv-button" v-if="mountain.cctv_url !== 'blank'" @click="openCCTVNewTab(mountain.cctv_url)">실시간 CCTV</button>
      <img class="mountainRoute" v-if="mountain.status === '통제' && mountain.dead_image_url" :src="mountain.dead_image_url" alt="산통제정보" @click="openImageInNewTab(mountain.dead_image_url)" style="cursor: pointer;">
      <img class="mountainRoute" v-if="mountain.status === '정상' && mountain.alive_image" :src="`http://3.39.161.55:8000/` + mountain.alive_image" alt="정상탐방로" @click="openImageInNewTab(`http://3.39.161.55:8000/` + mountain.alive_image)" style="cursor: pointer;">
      <div class="description" v-html="mountain.description"></div>
    </div>
    <div class="comment-container">
      <Comment :id="id" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MountainWeather from './MountainWeather.vue';
import Comment from './Comment.vue';

export default {
components: {
  MountainWeather,
  Comment
},
props: ['id'],
data() {
  return {
    mountain: {}
  }
},
methods: {
  fetchMountainData() {
    const apiUrl = `http://3.39.161.55:8000/api/${this.id}`
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

.mountain-name {
text-align: center;
font-size: 3em;
font-weight: bold;
}

.image-container {
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
margin-top: 5px;
margin-bottom: 5px;
text-align: center;
}

.comment-container {
width: 800px;
margin: 0 auto
}

.mountainRoute {
max-width: 80%; /* 이미지 너비를 최대로 지정 */
height: auto;
margin-bottom: 20px;
}

.description {
margin-bottom: 30px;
display: flex;
text-align: left; /* 텍스트를 가운데 정렬 */
flex-direction: column;
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
margin-bottom: 10px;
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
    flex-direction: column; /* 모바일에서도 세로 정렬 */
    text-align: left; /* 텍스트를 왼쪽 정렬 */
  }
}
</style>