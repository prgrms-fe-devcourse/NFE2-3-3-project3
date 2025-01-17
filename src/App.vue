<script setup>
import { RouterView } from 'vue-router';
import APItest from './pages/test_api_page/APItest.vue';
</script>

<template>
  <div class="text-red-300 text-3xl font-bold">테스트2</div>
  <APItest />
  <RouterView />
</template>

<style scoped></style>
