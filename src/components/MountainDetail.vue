<template>
    <div>
      <div class="image-container">
        <img class="mountainRoute" v-if="mountain.status === '통제' && mountain.dead_image_url" :src="mountain.dead_image_url" alt="산통제정보" @click="openImageInNewTab(mountain.dead_image_url)" style="cursor: pointer;">
        <img class="mountainRoute" v-if="mountain.status === '정상' && mountain.alive_image" :src="`http://127.0.0.1:8000/` + mountain.alive_image" alt="정상탐방로" @click="openImageInNewTab(`http://127.0.0.1:8000/` + mountain.alive_image)" style="cursor: pointer;">
        <div class="description" v-html="mountain.description"></div>
        <button class="cctv" v-if="mountain.cctv_url !=='blank'" @click = "openCCTVNewTab(mountain.cctv_url)"> 실시간 cctv</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    props: ['id'],
    data() {
      return {
        mountain: {}
      }
    },
    methods: {
      fetchMountainData() {
        const apiUrl = `http://127.0.0.1:8000/api/${this.id}`
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
  }
  
  .mountainRoute {
    max-width: 800px;
    width: 100%;
    height: auto;
    margin-bottom: 20px;
  }
  
  .description {
    margin-top: 20px;
  }
  </style>
  