import { ref } from 'vue'
import { defineStore } from 'pinia'
import { insertUser as insertUserAsync } from '@/api'

export const userStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
  }),
  actions: {
    // updateLoginState() {
    //   const accessToken = this.getCookie('access');
    //   console.log("updateLoginState", accessToken);
    //   if (accessToken) {
    //     this.isLoggedIn = true;
    //   }
    //   else {
    //     this.isLoggedIn = false;
    //   }
    //   // this.isLoggedIn = !!accessToken; // 토큰이 있으면 true, 없으면 false
    // },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      // console.log()
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    },
    // deleteCookie() {
    //   // 쿠키 삭제 로직
    //   document.cookie = `access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    //   document.cookie = `refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    //   this.isLoggedIn = false; // 상태 갱신
    // },
  },
});

export default defineStore('main', () => {
  const name = ref(0)
  const user_location = ref('UA')
  const projectStats = ref({})
  const online = ref(1)

  function setName(newName) {
    name.value = newName
  }

  function getName() {
    return name.value
  }

  function setUserLocation(data) {
    user_location.value = data
    insertUserAsync(data)
  }

  function getCountry() {
    return user_location.value.country.iso_code
  }

  function getLocation() {
    return user_location.value
  }

  function setProjectStats(stats) {
    projectStats.value = stats
  }

  function incrementProjectMessageCount() {
    projectStats.value.message_count++
  }

  function setOnlineNumber(num) {
    online.value = num
  }

  return {
    setName,
    getName,
    getCountry,
    setUserLocation,
    getLocation,
    setProjectStats,
    projectStats,
    incrementProjectMessageCount,
    setOnlineNumber,
    online
  }
})
