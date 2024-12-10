<template>
  <div class="mountain-container">
    <div class="mountain-header">
      <div class="mountain-name">{{ mountain.name }}</div>
      <div class="status-button">
        <Button
          v-if="mountain.status === '정상'"
          label="정상"
          severity="success"
          rounded>
        </Button>
        <Button
          v-else-if="mountain.status === '통제'"
          label="통제"
          severity="danger"
          rounded>
        </Button>
      </div>
    </div>
    <Divider class="" />

    <div class="image-container">
      <Button
        class="cctv-button"
        v-if="mountain.cctv_url !== 'blank'"
        @click="openCCTVNewTab(mountain.cctv_url)"
        label="실시간 CCTV"
        icon="pi pi-video" iconPos="left">
      </Button>
      <div class="image-wrapper">
      <img
        class="mountainRoute"
        :src="mountain.status === '통제' ? mountain.dead_image_url : `https://backend.santomato.com` + mountain.alive_image"
        alt="탐방로 이미지"
        @click="openImagePreview"
      />
      <i class="pi pi-search preview-icon" @click="openImagePreview"></i>
      </div>

      <!-- Preview Modal -->
      <div v-if="showPreview" class="image-preview-modal" @click="closePreview">
        <img
          class="preview-image"
          :src="mountain.status === '통제' ? mountain.dead_image_url : `https://backend.santomato.com` + mountain.alive_image"
          alt="탐방로 이미지"
        />
      </div>
      
      <!-- TabView for description sections -->
      <TabView>
        <TabPanel
          v-for="(section, index) in descriptionSections"
          :key="index"
          :header="getTabHeader(section)"
          >
          <div v-html="section" class="description"></div>
        </TabPanel>
      </TabView>
    </div>
    <Panel class="weather-panel">
      <MountainWeather :id="id"/>
    </Panel>
    <div class="comments-section">
      <h4 class="comments-title">{{ mountain.name }} 댓글</h4>
      <Divider class="bold-divider" />
      <div class="comment-container">
        <Comment :id="id"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MountainWeather from './MountainWeather.vue';
import Comment from './Comment.vue';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Panel from 'primevue/panel';
import Image from 'primevue/image';
import Divider from 'primevue/divider';

export default {
components: {
  MountainWeather,
  Comment,
  Button,
  TabView,
  TabPanel,
  Panel,
  Image,
  Divider
},
props: ['id'],
data() {
  return {
    mountain: {},
    descriptionSections: [], 
    showPreview: false,
  }
},
methods: {
  fetchMountainData() {
    const apiUrl = `https://backend.santomato.com/api/${this.id}`
    axios.get(apiUrl)
      .then(response => {
        this.mountain = response.data.data;
        this.descriptionSections = this.mountain.description
        ? this.mountain.description
            .replace(/<hr\s*\/?>/gi, '<hr>') // <hr> 태그를 기준으로 나누기 위해 일관성 있게 설정
            .split('<hr>')
            .map((section) =>
              section
                .replace(/^(<br\s*\/?>)+/gi, '')  // 각 섹션 시작 부분의 <br> 제거
                .replace(/(<br\s*\/?>)+$/gi, '')  // 각 섹션 마지막 부분의 <br> 모두 제거
            )
        : ['No description available'];
      })
      .catch(error => {
        console.error('Failed to fetch store data:', error);
      });
  },
  getTabHeader(section) {
    const pattern = new RegExp(`${this.mountain.name}[^<]*?사무소`, 'i');
    const match = section.match(pattern);
    return match ? match[0] : `${this.mountain.name}국립공원사무소`;
  },
  openImageInNewTab(imageUrl) {
    window.open(imageUrl, '_blank');
  },
  openCCTVNewTab(cctvUrl) {
    window.open(cctvUrl, '_blank');
  },
  openImagePreview() {
    this.showPreview = true;
  },
  closePreview() {
    this.showPreview = false;
  },
},
created() {
  this.fetchMountainData();
}
}
</script>

<style>
/* 전체 레이아웃을 조정하는 컨테이너 */
.mountain-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.mountain-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.mountain-name {
  font-size: 3em;
  font-weight: bold;
  text-align: center;
}

.status-button {
  margin-top: 10px;
}

.status-button .p-button:hover {
  cursor: default !important;
}

.image-container,
.comments-section,
.comment-container {
  width: 100%;
  margin: 0 auto;
}

.comment-container {
  flex-direction: column;
}

.p-tabview {
  background-color: transparent !important;
  width: 100%;
}

.p-tabview-panels {
  width: 100%;
  max-width: 1200px;
  background-color: transparent !important;
}

.p-tabview-tablist {
  background-color: transparent !important;
}

.description {
  display: flex;
  text-align: left;
  flex-direction: column;
  margin-bottom: 40px;
}

.cctv-button {
  padding: 10px 20px;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  float: right;
}

.weather-panel {
  width: 100%;
  height: auto;
  font-size: 20px;
  margin-bottom: 50px;
}

.comments-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
}

.divider {
  margin: 10px 0;
}

.thin-divider {
  height: 1px;
  background-color: #ccc;
  margin: 15px 0;
}

.bold-divider {
  height: 3px;
  background-color: #757575;
  margin: 15px 0;
  border-radius: 2px;
}

.mountainRoute {
  width: 100%;
  height: auto;
  cursor: pointer;
  max-width: 100%;
  object-fit: contain;
}

.preview-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: color 0.3s ease;
}

.preview-icon:hover {
  color: #fff;
}

.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.preview-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
}

@media only screen and (max-width: 767px) {
  .mountain-container {
    width: 90%;
    padding: 0 10px;
  }

  .image-wrapper {
    width: 100%;
  }

  .mountain-name {
    font-size: 2em;
  }

  .cctv-button {
    font-size: 14px;
    padding: 8px 16px;
  }

  .description {
    font-size: 12px;
  }

  .weather-panel {
    font-size: 18px;
    width: 90%;
  }

  .comments-title {
    font-size: 1.3em;
  }

  .p-tabview-tablist .p-tabview-nav {
    width: 90%;
    flex-wrap: wrap;
    font-size: 0.9em;
  }

  .p-tabview {
    width: 90%;
  }

  .p-tabview-tab-title {
    font-size: 0.9em;
  }
}

@media only screen and (max-width: 480px) {
  .mountain-name {
    font-size: 1.5em;
  }

  .cctv-button {
    font-size: 10px;
    padding: 4px 8px;
  }

  .weather-panel {
    font-size: 16px;
  }

  .comments-title {
    font-size: 1.2em;
  }

  .p-tabview-tablist {
    font-size: 0.9rem;
  }

  .comments-section {
    max-width: 300px;
  }
}
</style>