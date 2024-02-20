<template>
    <section>
      <div class="title-container">
        <h1>산토</h1>
        <img src="@/assets/logo.png" class="logo">
      </div>      
      <div class="sns">
        <a href="https://www.youtube.com/channel/UCF1YRWbTrf5T9CdwB8ZHAAA" class="sns-item">
          <img src="@/assets/youtube.png" class = "youtube-logo">
        </a>
        <div class = "space"></div>
        <a href="https://www.instagram.com/san_cherrytomato?igsh=MXBqNWRqYzRqM3YyMA%3D%3D&utm_source=qr" class="sns-item">
          <img src="@/assets/insta.png" class = "insta-logo">
        </a>
      </div>
      
      <input class = "searchTab" type="text" placeholder="산 이름으로 검색하기" v-model="searchTerm" @input="filterByName">
      <div class="filter">
        <div class="item" :class="{ active: activeFilter === 'All' }" @click="filterByStatus('All')">전체</div>
        <span class="separator"></span>
        <div class="item" :class="{ active: activeFilter === 'Alive' }" @click="filterByStatus('Alive')">정상</div>
        <span class="separator"></span>
        <div class="item" :class="{ active: activeFilter === 'Dead' }" @click="filterByStatus('Dead')">통제</div>
      </div>

      <div v-if="filteredMountains.length > 0" class="container-cards">
        <ul class="card-list">
          <li v-for="mountain in filteredMountains" :key="mountain.id" class="card" @click="viewMountainDetail(mountain)">
          <div class="card-content">
            <div class="image">
              <div class="status">
                <span 
                  :class="
                  mountain.status == '정상' ? 'alive' :
                  mountain.status == '통제' ? 'dead' :
                  'unknown'">
                </span>
                <span> {{ mountain.status }} - 대설특보</span>
              </div>
              <div class="information">
                <span>{{ "-17°C" }} ~ {{ "-3°C" }} </span>
              </div>
              <img :src="`http://127.0.0.1:8000/` + mountain.image" :alt="mountain">
            </div>
          </div>
          <h2>{{ mountain.name }}</h2>
        </li>
        </ul>
      </div>
    </section>
  </template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      mountains: [],
      filteredMountains: [],
      searchTerm: '',
      activeFilter: 'All',
    };
  },
  mounted() {
    // this.fetchmountains('http://13.210.210.221:8000/api/all/')
    this.fetchmountains('http://127.0.0.1:8000/api/all/')
  },
  methods: {
    viewMountainDetail(mountain) {
      this.$router.push({name: 'MountainDetail', params: { id: mountain.id }});
    },
    fetchmountains(url) {
    axios.get(url)
      .then(response => {
        this.mountains = response.data;
        this.filteredMountains = response.data;
        console.log(this.mountains);
        console.log(this.filteredMountains);
      })
      .catch(error => {
        console.error('Error al obtener la lista de personajes:', error);
        reject(error);
      });
},

  filterByStatus(status) {
  const lowerCaseStatus = status.toLowerCase();
  this.activeFilter = status;
  if (lowerCaseStatus === 'all') {
    this.filteredMountains = this.mountains;
  } else {
    this.filteredMountains = this.mountains.filter(mountain => mountain.status.toLowerCase() === lowerCaseStatus);
  }
},

    filterByName() {
      const searchTerm = this.searchTerm.toLowerCase();
      this.filteredMountains = this.mountains.filter(
        mountain => mountain.name.toLowerCase().includes(searchTerm)
      );
    },
  },
};
</script>
  
  <style scoped>
    section {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 0rem 10rem 0rem 10rem;
    }
  
    section > h1 {
      text-align: center;
      font-size: 45px;
      margin-top: 4rem;
    }

    .title-container {
      position: relative;
      left:-30px;
    }

    .title-container > h1 {
      font-size: 100px;
      margin: 20px;

    }

    .logo {
      position: absolute;
      top:25px;
      right: -70px;
      width: 50%;
      z-index: -1;
      margin: 10px;
    }
  
    .youtube-logo {
      width:50px;
    }

    .insta-logo {
      width:40px;
    }

    .sns {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .sns-item {
        display: flex;
        align-items: center;
        margin-right: 20px; /* 각 아이템 사이의 간격 조절 */
    }
    
    section .filter{
        width: 20%;
        margin-right: auto;
        margin-left: 3%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: white;
        padding: 0.9rem;
        font-size: 15   px;
        border-radius: 0.5rem;
        cursor: pointer;
        margin-bottom: 1rem;
        border: 2px solid #ccc; /* Thin gray border */
    }
    section .filter :hover{
        color: var(--text-blue);
    }

    section > input{
      width: 15%;
      padding: 1rem;
      border-radius: 0.5rem;
      border: none;
      text-align: center;
      margin-bottom: 1rem;
      margin: 2%;
    }
  
    section .container-cards {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .card-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      
    }
    
    .card {
      width: 20%;
      margin: 1%;
      border-radius: 1rem;
      background-color: var(--background-card);
      box-sizing: border-box;
      text-align: center;
      overflow: hidden;
      transition: transform 200ms ease-in-out;
      cursor: pointer;
      box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.1); /* Box shadow for depth */
      border: 1px solid #ccc; /* Thin gray border */
    }
    .card:hover{
      transform: scale(1.05);
      h2{
        color: var(--text-blue);
      }
    }
    .card-content {
      position: relative;
    }
    
    .card .image {
      width: 100%;
      position: relative;
    }
    .card .image > img {
      width: 100%;
    }
    .card > h2{
      margin: 5px;
    }

    .card .status {
      position: absolute;
      top: 0;
      left: 0;
      margin: 7px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      z-index: 1;
      background-color: white;
      border-radius: 20px;
      padding: 5px;
      box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.2);
    }

    .status span{
      color: var(--text-gray);
      
    }
    .status span:first-child{
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 0.5rem;
    }
    .alive {
        background-color: green;
      }
      .dead {
        background-color: red;
      }
      .unknown {
        background-color: white;
      }
    
    .card .information {
      position: absolute;
      top: 0;
      right: 0;
      background-color: white;
      border-radius: 20px;
      margin: 7px;
      padding: 5px;
      box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      flex-direction: column;
    }

    .card .information > span{
      color: var(--text-gray);
    }

    .item.active {
      color: var(--text-blue);
    }

    
    /* MOBILE */
    @media only screen and (min-width: 370px) and (max-width: 600px) {
      section{
        width: 100%;
        margin: 0;
      }
      section > h1{
        font-size: 35px;
        margin-top: 1rem;
      }
      section .filter{
        width: 80%;
      }
      section > input{
        width: 80%;
      }
      .card{
        width: 80%;
        margin-bottom: 1rem;
      }
    }

    /* TABLET*/
    @media only screen and (min-width: 601px) and (max-width: 768px) {
      section{
        width: 100%;
        margin: 0;
      }
      section > h1{
        font-size: 35px;
        margin-top: 1rem;
      }
      section .filter{
        width: 86%;
      }
      section > input{
        width: 86%;
      }
      .card{
        width: 40%;
        margin-bottom: 1rem;
      }
    }


    /* LAPTOP */
    @media only screen and (min-width: 769px) and (max-width: 1024px) {
      section{
        width: 100%;
        margin: 0;
      }
      section > h1{
        font-size: 45px;
        margin-top: 4rem;
      }
      section .filter{
        width: 40%;
      }
      section > input{
        width: 40%;
      }
      .card{
        width: 30%;
        margin-bottom: 1rem;
      }
    }

    /* LARGE SCREEN */
    @media only screen and (min-width: 1025px) and (max-width: 1201px) {
      section{
        width: 100%;
        margin: 0;
      }
      section > h1{
        font-size: 45px;
        margin-top: 4rem;
      }
      section .filter{
        width: 45%;
      }
      section > input{
        width: 45%;
      }
      .card{
        width: 20%;
        margin-bottom: 1rem;
      }
    }
    
  </style>
  

  
  