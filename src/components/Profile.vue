<template>
    <div>
      <div>
        <!-- 사용자가 store 소유자인 경우에 보여줄 내용 -->
        <h1>마이 스토어 페이지</h1>
      </div>
      <div>
        <!-- 사용자가 store 소유자가 아닌 경우에 보여줄 내용 -->
        <h1>나의 정보 페이지</h1>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'Profile',
    data() {
        return {
          user: {}
        };
    },
    methods: {
    },
  };
  </script>