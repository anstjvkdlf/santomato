<template>
  <div class="carpool-container">
    <div class="title-container">
      <Button icon="pi pi-chevron-left" class="back-button" @click="goToProfile" text></Button>
      <h6 class="service-title">내 정보 변경</h6>
    </div>

    <div class="edit-form">
      <form @submit.prevent="handleEdit">
        <div class="p-field">
          <label for="gender">성별</label>
          <Dropdown v-model="new_gender" :options="genderOptions" optionLabel="label" optionValue="value" placeholder="성별 선택" />
        </div>
        <div class="p-field">
          <label for="birthDate">생년월일</label>
          <div class="birthdate-container">
            <Dropdown v-model="new_birthYear" :options="yearOptions" optionLabel="label" optionValue="value" placeholder="년" />
            <Dropdown v-model="new_birthMonth" :options="monthOptions" optionLabel="label" optionValue="value" placeholder="월" />
            <Dropdown v-model="new_birthDay" :options="dayOptions" optionLabel="label" optionValue="value" placeholder="일" />
          </div>
        </div>
        <div class="p-field">
          <label for="phoneNumber">휴대폰 번호</label>
          <InputMask v-model="new_phoneNumber" mask="999-9999-9999" placeholder="010-0000-0000" />
        </div>
        <div class="p-field">
          <label for="carInfo">차량 번호</label>
          <div class="car-info-container">
            <InputText v-model="new_carInfo" :disabled="noCar" placeholder="12가1234" />
            <div class="p-field-checkbox">
              <input type="checkbox" id="noCar" v-model="noCar" />
              <label for="noCar">차량 없음</label>
            </div>
          </div>
        </div>

        <Button type="submit" :disabled="!isFormValid">변경하기</Button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';
import Dropdown from 'primevue/dropdown';
import InputMask from 'primevue/inputmask';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { ref } from 'vue';

export default {
  components: {
    Dropdown,
    InputMask,
    InputText,
    Button,
  },
  data() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
    const yearOptions = years.map(year => ({ label: String(year), value: year }));

    const monthOptions = Array.from({ length: 12 }, (_, i) => ({ label: String(i + 1), value: i + 1 }));
    const dayOptions = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1), value: i + 1 }));

    return {
      email: '',
      gender: null,
      phoneNumber: '',
      carInfo: '',
      noCar: false,

      new_gender: null,
      new_phoneNumber: '',
      new_carInfo: '',
      new_birthYear: null,
      new_birthMonth: null,
      new_birthDay: null,

      genderOptions: [
        { label: '남성', value: 'male' },
        { label: '여성', value: 'female' },
      ],
      yearOptions: yearOptions,
      monthOptions: monthOptions,
      dayOptions: dayOptions,
      goToProfile: () => router.push('/profile')
    };
  },
  computed: {
    isFormValid() {
      return this.new_gender !== null &&
        this.new_birthYear !== null &&
        this.new_birthMonth !== null &&
        this.new_birthDay !== null &&
        this.new_phoneNumber.trim() !== '' &&
        (this.noCar || (this.new_carInfo && this.new_carInfo.trim() !== ''));
    },
    new_birthDate() {
      if (this.new_birthYear && this.new_birthMonth && this.new_birthDay) {
        const month = String(this.new_birthMonth).padStart(2, '0');
        const day = String(this.new_birthDay).padStart(2, '0');
        return `${this.new_birthYear}-${month}-${day}`;
      }
      return null;
    },
  },
  methods: {
    async fetchUserInfo() {
      try {
        const response = await axios.get('https://backend.santomato.com/user/auth/', {
          withCredentials: true,
        });
        const userInfo = response.data.user;

        this.email = userInfo.email;

        // Set birth date values
        if (userInfo.birth) {
          const [year, month, day] = userInfo.birth.split('-').map(Number);
          this.new_birthYear = year;
          this.new_birthMonth = month;
          this.new_birthDay = day;
        }
        this.new_phoneNumber = userInfo.phone_number;
        this.new_carInfo = userInfo.car_number;
        this.noCar = userInfo.car_number === null;

        if (userInfo.gender === 'male') {
          this.new_gender = 'male';
        } else if (userInfo.gender === 'female') {
          this.new_gender = 'female';
        } else {
          this.new_gender = null;
        }
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', error);
      }
    },
    async handleEdit() {
      try {
        const response = await axios.put('https://backend.santomato.com/user/auth/', {
          email: this.email,
          new_birth: this.new_birthDate,
          new_gender: this.new_gender,
          new_phone_number: this.new_phoneNumber.replace(/-/g, ''), // remove dashes
          new_car_number: this.noCar ? null : this.new_carInfo,
        }, { withCredentials: true });

        // Handle successful update (e.g., show a success message)
        console.log('업데이트 성공:', response.data);
        router.push('/profile');
      } catch (error) {
        alert(error.response.data.error);
        console.error('업데이트 실패:', error);
      }
    },
  },
  created() {
    this.fetchUserInfo();
  },
  mounted() {
    this.fetchUserInfo();
  },
};
</script>

<style scoped>
.carpool-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}

.service-title {
  font-size: 20px;
  text-align: left;
  color: #2AAA8A;
  font-weight: bold;
  margin: 0;
  padding: 0;
}

.title-container {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  padding: 0;
}

.back-button {
  font-size: 1.2rem;
  color: #2AAA8A;
  cursor: pointer;
  padding: 0.5rem 0.5rem 0.5rem 0 !important;
  width: 30px;
}

.back-button:hover {
  color: #1f8f73;
  background-color: transparent !important;
}

.edit-form {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-sizing: border-box;
}

.p-field {
  margin-bottom: 1rem;
}

.birthdate-container {
  display: flex;
  gap: 5px;
  width: 100%;
}

.birthdate-container .p-dropdown {
  width: calc(33.33% - 5px); /* Adjust width for equal distribution */
}

.car-info-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.car-info-container .p-inputtext {
  width: 70%;
}

.p-field-checkbox {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.p-field-checkbox label {
  margin-left: 0.5rem;
  font-weight: normal;
  white-space: nowrap;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

button {
  width: 100%;
  box-sizing: border-box;
}
</style>
