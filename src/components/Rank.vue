<template>
    <div class="ranking-container">
      <div class="ranking">
        <span class="rank">{{ currentRank }}. </span>
        <span class="name">{{ mountains[currentIndex].name }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        mountains: [
          { id: 1, name: '치악산' },
          { id: 2, name: '북한산' },
          { id: 3, name: '설악산' },
          { id: 4, name: '한라산' },
          { id: 5, name: '지리산' }
        ], // 산 목록
        currentIndex: 0, // 현재 표시할 산의 인덱스
        currentRank: 1, // 현재 순위
      };
    },
    mounted() {
      this.startRankingRotation(); // 컴포넌트가 마운트되면 자동 넘김 시작
    },
    methods: {
      startRankingRotation() {
        setInterval(() => {
          // 다음 산으로 이동
          this.currentIndex = (this.currentIndex + 1) % this.mountains.length;
          // 순위 업데이트
          this.currentRank = this.currentIndex + 1;
        }, 2000); // 2초마다 다음 순위로 이동
      }
    }
  };
  </script>
  
  <style scoped>
  .ranking-container {
    width: 200px; /* 컴포넌트 크기 조정 */
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .ranking {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  
  .rank {
    color: #ff6347; /* 순위 색상 */
  }
  
  .name {
    color: #333; /* 산 이름 색상 */
  }
  </style>
  