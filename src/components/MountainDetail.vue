<template>
    <div>
      <div class="imgae-container" v-if="mountain.status === 'dead'">
        <img :src="mountain.images_urls" alt="산통제정보">
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
            const apiUrl = `http://13.210.210.221:8080/api/${this.id}`
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
  </style>