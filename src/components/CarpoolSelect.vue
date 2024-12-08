<template>
  <div class="carpool-container">
    <!-- 들날 동행 버튼 -->
      <img 
        :src="imageSrcs['companion']" 
        alt="들날동행" 
        @click="navigateToCarpool('companion')" 
        class="carpool-image" 
      />
      <div class="button-with-tooltip">
      <div class="custom-button">
        <i class="pi pi-question-circle"></i>
        들날 동행
      </div>
      <span class="info-tooltip">차량 두대로 날머리에 도착한 뒤, 하나의 차량으로 함께 들머리로 이동합니다. 
        등산을 마치고 날머리에 주차된 차량을 이용해 들머리로 이동합니다. </span>
    </div>

    <!-- 등산 카풀 버튼 -->
      <img 
        :src="imageSrcs['carpool']" 
        alt="등산카풀" 
        @click="navigateToCarpool('carpool')" 
        class="carpool-image" 
      />
      <div class="button-with-tooltip">
      <div class="custom-button">
        <i class="pi pi-question-circle"></i>
        등산 카풀
      </div>
      <span class="info-tooltip">소정의 금액을 받고 등산 목적지까지 카풀 동행을 태워줍니다.</span>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    
    const imageSrcs = {
      companion: new URL('@/assets/들날동행.png', import.meta.url).href,
      carpool: new URL('@/assets/등산카풀.png', import.meta.url).href,
    };

    const navigateToCarpool = (type) => {
      router.push({ name: 'Carpool', params: { type } });
    };

    return {
      imageSrcs,
      navigateToCarpool,
    };
  },
};
</script>

<style scoped>
.carpool-container {
  display: flex;
  flex-direction: column; /* Vertical layout */
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
  gap: 20px; /* Space between buttons */
  padding: 20px;
  box-sizing: border-box;
  width: 300px;
  height: 500px; 
}

.button-with-tooltip {
  display: flex;
  flex-direction: column; 
  align-items: center;
  gap: 10px;
  position: relative;
  width: 100%;
}

.carpool-image {
  width: 150px; 
  cursor: pointer;
}

.info-tooltip {
  background-color: #333;
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 0.8em;
  position: absolute;
  top: 100%;
  display: none;
  z-index: 10;

  /* 줄바꿈 설정 */
  white-space: normal;

}

.button-with-tooltip:hover .info-tooltip {
  display: block;
}

/* Custom Button Styles */
.custom-button {
  background-color: transparent; /* 투명 배경 */
  border: none; /* 테두리 제거 */
  color: #555; /* 텍스트 색상 */
  font-size: 12px; /* 작은 폰트 크기 */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.custom-button i {
  font-size: 16px; /* 아이콘 크기 */
}

.custom-button:hover {
  color: #333; /* 호버 시 텍스트 색상 */
}
</style>
