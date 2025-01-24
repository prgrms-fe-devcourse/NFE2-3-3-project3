<script setup>
const { class: className } = defineProps({
  class: String,
});
</script>

<template>
  <p :class="`flex items-center justify-center text-gray-500 ${className}`">
    <slot></slot>
  </p>
</template>

<style scoped></style>
