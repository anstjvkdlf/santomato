<template>
  <div class="site-name">
    <div class="title-container">
      <router-link to="/">
        <img src="@/assets/logo.png" class="logo">
      </router-link>
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
  margin-bottom: 10px; /* sns와의 간격을 조정합니다. */
}

.logo {
  width: 200px;
}

.sns {
  display: flex;
  align-items: center;
  justify-content: center; /* 가로 중앙으로 정렬합니다. */
}

.sns-item {
  margin-right: 20px;
}

.youtube-logo,
.insta-logo {
  width: 40px;
}

@media only screen and (max-width: 767px) {
  .site-name {
    flex-direction: row; /* 요소를 가로로 나열합니다. */
  }
  .logo {
    padding-right: 25px;
  }

  .sns-item {
  margin-right: 5px;
  }
}

</style>
