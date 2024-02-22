<template>
    <div>
      <div class="image-container"> 
        <img class = "mountainRoute" v-if="mountain.status === '통제'" :src="mountain.images_urls" alt="산통제정보">
        <img class = "mountainRoute" v-if="mountain.status === '정상'" :src="`http://127.0.0.1:8000/` + mountain.alive_image" alt="정상탐방로">
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
  .mountainRoute {
    width: 50%;
  }
  </style>