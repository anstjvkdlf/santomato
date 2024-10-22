<template>
    <div class="carousel">
      <div class="carousel-slides" :style="{'transform': `translateX(-${currentSlide * 100}%)`}">
        <div class="carousel-slide" v-for="(slide, index) in slides" :key="index">
          <img :src="slide"/>
        </div>
      </div>
      <button class="prev" @click="prevSlide">❮</button>
      <button class="next" @click="nextSlide">❯</button>
      <div class="indicators">
        <span v-for="(slide, index) in slides" :key="index" @click="goToSlide(index)" :class="{'active': currentSlide === index}"></span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Carousel',
    data() {
      return {
        currentSlide: 0,
        slides: [
          "/src/assets/광고1.png" ,
          "/src/assets/광고2.png",
          "/src/assets/광고3.png",
        ],
        interval: null, // 슬라이드 전환을 위한 interval
      };
    },
    methods: {
      prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
      },
      nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      },
      goToSlide(index) {
        this.currentSlide = index;
      },
      startAutoSlide() {
        this.interval = setInterval(this.nextSlide, 3000); // 3초마다 슬라이드 전환
      },
      stopAutoSlide() {
        clearInterval(this.interval);
      },
    },
    mounted() {
      this.startAutoSlide();
    },
    beforeDestroy() {
      this.stopAutoSlide(); // 컴포넌트가 파괴될 때 interval 해제
    },
  };
  </script>
  
  <style scoped>
  .carousel {
    position: relative;
    overflow: hidden;
    width: 1024px;
    height: 480px;
    margin: auto;
  }
  
  .carousel-slides {
    display: flex;
    transition: transform 0.5s ease-in-out;
  }
  
  .carousel-slide {
    min-width: 100%;
    box-sizing: border-box;
  }
  
  .carousel-slide img {
    width: 100%;
    height: auto;
  }
  
  .caption {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: white;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
  }
  
  button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    padding: 10px;
    z-index: 1;
  }
  
  .prev {
    left: 10px;
  }
  
  .next {
    right: 10px;
  }
  
  .indicators {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .indicators span {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: gray;
    border-radius: 50%;
    margin: 0 5px;
    cursor: pointer;
  }
  
  .indicators span.active {
    background: white;
  }
  </style>
  