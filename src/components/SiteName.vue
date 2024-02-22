<template>
  <div class="site-name">
    <div class="title-container">
      <img src="@/assets/logo.png" class="logo">
    </div>
    <div class="sns">
      <a href="https://www.youtube.com/channel/UCF1YRWbTrf5T9CdwB8ZHAAA" class="sns-item">
        <img src="@/assets/youtube.png" class="youtube-logo">
      </a>
      <a href="https://www.instagram.com/san_cherrytomato?igsh=MXBqNWRqYzRqM3YyMA%3D%3D&utm_source=qr" class="sns-item">
        <img src="@/assets/insta.png" class="insta-logo">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "SiteName",
};
</script>

<style scoped>
.site-name {
  display: flex;
  flex-direction: column;
  align-items: center; /* 요소를 수직 중앙으로 정렬합니다. */
}

.title-container {
  display: flex; /* Flexbox를 사용하여 요소를 정렬합니다. */
  align-items: center; /* 요소를 수직 중앙으로 정렬합니다. */
  justify-content: center; /* 요소를 가로 중앙으로 정렬합니다. */
}

.logo {
  width: 200px;
}

.sns {
  display: flex;
  align-items: center;
}

.sns-item {
  margin-right: 20px;
}

.youtube-logo,
.insta-logo {
  width: 40px;
}
</style>
