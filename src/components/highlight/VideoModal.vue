<script setup>
import CloseBtn from "@/assets/icons/delete-btn.svg";

const props = defineProps({
  videoId: String,
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>
<template>
  <div
    v-if="videoId"
    class="fixed top-0 left-0 flex justify-center items-center w-full h-screen bg-black01 bg-opacity-80 z-50"
  >
    <div class="relative flex flex-col items-center w-[80%] h-auto">
      <div
        class="w-full h-[89px] bg-black01 flex justify-end items-center px-[30px]"
      >
        <button @click="closeModal">
          <img :src="CloseBtn" class="w-[26px] h-[26px]" />
        </button>
      </div>
      <div class="w-full aspect-video">
        <iframe
          class="w-full h-full"
          :src="'https://www.youtube.com/embed/' + videoId + '?autoplay=1'"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
