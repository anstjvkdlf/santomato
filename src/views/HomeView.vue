<script setup>
import ContentWrapper from '../livechatcomponents/ContentWrapper.vue'
import vMessagesHeader from '../livechatcomponents/vMessagesHeader.vue'
import InfinityMessages from '../livechatcomponents/InfinityMessages.vue'
import vInputForm from '../livechatcomponents/vInputForm.vue'
</script>

<template>
  <content-wrapper>
    <v-messages-header class="mb-5" />
    <infinity-messages />
    <v-input-form class="mt-5" />
  </content-wrapper>
</template>
