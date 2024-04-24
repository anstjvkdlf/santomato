<script setup lang="ts">

import {
    MDBFooter,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon
  } from 'mdb-vue-ui-kit';

</script>

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
        <div class=" text-center text-md-start mt-5">
            <span>Company: 🍅Santo
            <a href="" class="me-4 text-reset">
            <MDBIcon iconStyle="fab" icon="instagram"></MDBIcon>
            </a>
            /
            <a href="" class="me-4 text-reset">
            <MDBIcon iconStyle="fab" icon="youtube"></MDBIcon>
            </a>
            </span>
        </div>

    </section>
    <!-- Section: Social media -->
    <!-- Section: Links  -->
    <section class="">
      <MDBContainer class="text-center text-md-start mt-5">
        <!-- Grid row -->
        <MDBRow class="mt-3">
          <!-- Grid column -->
          <!-- Grid column -->
          <MDBCol md="4" lg="3" xl="3" class="mx-auto mb-md-0 mb-4">
            <!-- Links -->
            <p>
              <i class="fas fa-home me-3"></i> Seoul, Korea
            </p>
            <p>
              <i class="fas fa-envelope me-3"></i>
              plantforeveryone@gmail.com
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
      <a class="text-reset fw-bold" href="http://santomato.com/">santomato.com</a>
    </div>
    <!-- Copyright -->
  </MDBFooter>
  <!-- Footer -->
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
