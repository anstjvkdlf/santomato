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
  margin: 0 auto;
}

.mountainRoute {
  max-width: 80%;
  height: auto;
  margin-bottom: 20px;
}

.description {
  margin-bottom: 30px;
  display: flex;
  text-align: left;
  flex-direction: column;
}

.cctv-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.cctv-button:hover {
  background-color: #45a049;
}

@media only screen and (max-width: 767px) {
  .mountain-name {
    font-size: 2em; /* 글자 크기 조정 */
  }

  .image-container {
    width: 100%;
    padding: 0 10px; /* 여백 추가 */
  }

  .mountainRoute {
    max-width: 90%;
    height: auto;
    margin-bottom: 15px;
  }

  .description {
    margin: 0 10px;
    text-align: left;
  }

  .comment-container {
    width: 100%;
    padding: 0 10px;
    margin: 0 auto;
  }

  .cctv-button {
    font-size: 14px; /* 버튼 글자 크기 축소 */
    padding: 8px 16px; /* 버튼 패딩 축소 */
  }
}

@media only screen and (max-width: 480px) {
  .mountain-name {
    font-size: 1.5em; /* 더 작은 화면에서 글자 크기 더 줄이기 */
  }

  .mountainRoute {
    max-width: 100%;
    margin-bottom: 10px;
  }

  .description {
    font-size: 14px; /* 설명 글자 크기 축소 */
  }

  .cctv-button {
    font-size: 12px; /* 버튼 글자 크기 더 축소 */
    padding: 6px 12px; /* 패딩 축소 */
  }
}

</style>