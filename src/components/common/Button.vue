<script setup>
defineProps({
  text: { type: String, required: true },
  type: { type: String, default: "button" },
  logo: { type: String, default: "" },
  customClass: { type: String, default: "" },
});
</script>
<template>
  <button
    :type="type"
    class="w-full h-[76px] text-[#000000] font-bold rounded-[10px] flex items-center justify-center gap-[5px] transition-all bg-white02 border border-gray01"
    :class="customClass"
  >
    <img v-if="logo" :src="logo" alt="button icon" class="w-5 h-5" />
    {{ text }}
  </button>
</template>
<style scoped></style>
