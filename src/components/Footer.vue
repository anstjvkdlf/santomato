<template>
  <!-- Footer -->
  <MDBFooter :text="['center', 'lg-start', 'muted']">
    <!-- Section: Social media -->
    <section class="
        d-flex
        justify-content-center justify-content-lg-between
        p-4
        border-bottom
      ">
      <!-- Left -->
      <div class="me-5 d-none d-lg-block">
        <span>Welcome to Santo's National Park Alert System</span>
      </div>
      <!-- Left -->
      <!-- Right -->
      <div>
        <a href="https://www.youtube.com/@san_cherrytomato" class="me-4 text-reset">
          <MDBIcon iconStyle="fab" icon="youtube"></MDBIcon>
        </a>
        <a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=plantforeveryone.gmail.com" class="me-4 text-reset">
          <MDBIcon iconStyle="fab" icon="google"></MDBIcon>
        </a>
        <a href="https://www.instagram.com/san_cherrytomato" class="me-4 text-reset">
          <MDBIcon iconStyle="fab" icon="instagram"></MDBIcon>
        </a>
        <a href="https://blog.naver.com/santomato" class="me-4 text-reset">
          <MDBIcon iconStyle="fab" icon="blogger"></MDBIcon>
        </a>
      </div>
      <!-- Right -->
    </section>
    <!-- Section: Social media -->
    <!-- Section: Links  -->
    <section class="">
      <MDBContainer class="text-center text-md-start mt-5">
        <!-- Grid row -->
        <MDBRow class="mt-3">
          <!-- Grid column -->
          <MDBCol md="3" lg="4" xl="3" class="mx-auto mb-4">
            <!-- Content -->
            <h6 class="text-uppercase fw-bold mb-4">
              <i class="fas fa-gem me-3"></i>SANTO
            </h6>
            <p>
              All content is used with approval of relevant organizations.
              Secondary use is prohibited without permission.
              All rights reserved.
            </p>
          </MDBCol>
          <!-- Grid column -->
          <!-- Grid column -->
          <MDBCol md="2" lg="2" xl="2" class="mx-auto mb-4">
            <!-- Links -->
            <h6 class="text-uppercase fw-bold mb-4">Products</h6>
            <p>
              <a href="#!" class="text-reset">준비중</a>
            </p>
            <!-- <p>
              <a href="#!" class="text-reset">React</a>
            </p>
            <p>
              <a href="#!" class="text-reset">Vue</a>
            </p>
            <p>
              <a href="#!" class="text-reset">Laravel</a>
            </p> -->
          </MDBCol>
          <!-- Grid column -->
          <!-- Grid column -->
          <MDBCol md="3" lg="2" xl="2" class="mx-auto mb-4">
            <!-- Links -->
            <h6 class="text-uppercase fw-bold mb-4">Useful links</h6>
            <p>
              <a href="https://www.knps.or.kr/portal/main.do" class="text-reset">국립공원</a>
            </p>
            <p>
              <a href="https://www.weather.go.kr/w/theme/mountain-weather.do" class="text-reset">산악 날씨</a>
            </p>
            <p>
              <a href="https://www.weather.go.kr/w/image/vshrt/rain.do" class="text-reset">초단기 강수 레이더</a>
            </p>
            <p>
              <a href="https://pf.kakao.com/_LAJkG" class="text-reset">고객센터</a>
            </p>
          </MDBCol>
          <!-- Grid column -->
          <!-- Grid column -->
          <MDBCol md="4" lg="3" xl="3" class="mx-auto mb-md-0 mb-4">
            <!-- Links -->
            <h6 class="text-uppercase fw-bold mb-4">Contact</h6>
            <p>
              <i class="fas fa-home me-3"></i> Seoul, KOREA
            </p>
            <p>
              <i class="fas fa-envelope me-3"></i>
              plantforeveryone@gmail.com
            </p>
            <p>
              <MDBIcon icon="phone" class="me-3" /> https://pf.kakao.com/_LAJkG
            </p>
          </MDBCol>
          <!-- Grid column -->
        </MDBRow>
        <!-- Grid row -->
      </MDBContainer>
    </section>
    <!-- Section: Links  -->
    <!-- Copyright -->
    <div class="text-center p-4" style="background-color: rgba(0, 0, 0, 0.05)">
      © 2024 Copyright:
      <a class="text-reset fw-bold" href="santomato.com">santomato.com</a>
    </div>
    <!-- Copyright -->
  </MDBFooter>
  <!-- Footer -->
</template>

<script setup lang="ts">
  import {
    MDBFooter,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon
  } from 'mdb-vue-ui-kit';
</script>