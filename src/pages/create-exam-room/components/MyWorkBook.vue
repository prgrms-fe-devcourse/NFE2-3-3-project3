<script setup>
import shareIcon from "@/assets/icons/my-problem-sets/share.svg";

defineProps({
  visibleMyBooks: {
    required: true,
  },
});
</script>
<template>
  <div class="grid grid-cols-3 gap-2">
    <div
      v-for="(book, index) in visibleMyBooks"
      :key="index"
      class="w-[cal((100% - 4rem) / 3 )] h-[146px] p-4 bg-orange-3 rounded-lg flex flex-col justify-between"
    >
      <div>
        <h3 class="font-medium">{{ book.title }}</h3>
        <p class="text-sm text-gray-600 truncate">{{ book.description }}</p>
      </div>
      <div class="flex justify-between items-center mt-2">
        <img :src="shareIcon" alt="share" />
        <p class="text-sm font-medium">{{ book.count }}문제</p>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
