<template>
    <div>
      <div class="image-container"> 
        <img class = "mountainRoute" v-if="mountain.status === '통제' && mountain.dead_image_url" :src="mountain.dead_image_url" alt="산통제정보">
        <img class = "mountainRoute" v-if="mountain.status === '정상' && mountain.alive_image" :src="`http://127.0.0.1:8000/` + mountain.alive_image" alt="정상탐방로">
        <div class="description" v-html="mountain.description"></div>
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
            // const apiUrl = `http://13.210.210.221:8000/api/${this.id}`
            const apiUrl = `http://127.0.0.1:8000/api/${this.id}`
            axios.get(apiUrl)
                .then(response => {
                this.mountain = response.data.data; // Assuming the API returns the store data as an objectcon
                console.log(this.mountain);
                })
                .catch(error => {
                console.error('Failed to fetch store data:', error);
                });
        }
    },
    created() {
        this.fetchMountainData();
    }
    }
  </script>
  
  <style scoped>
/* 여기에 컴포넌트의 스타일을 작성할 수 있습니다 */
.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 15px;
}

.mountainRoute {
    max-width: 800px; /* 이미지의 최대 너비를 설정하여 넘어가지 않도록 함 */
    width: 100%; /* 이미지가 부모 요소에 맞춰져서 크기 조절됨 */
    height: auto; /* 이미지의 높이는 자동으로 조절되어 가로 세로 비율 유지 */
    margin-bottom: 20px; /* 이미지와 설명 사이의 여백 설정 */
}

.description {
    margin-top: 20px; /* 설명 위 여백 설정 */
}
</style>