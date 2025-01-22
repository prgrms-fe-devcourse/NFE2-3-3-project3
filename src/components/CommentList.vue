<script setup>
import { defineProps } from "vue";

import Comment from "@/components/layout/Comment.vue";

const { comments } = defineProps({
  comments: {
    type: Array,
    required: true,
  },
});
</script>
<template>
  <div class="w-[876px] flex flex-col">
    <div class="text-[24px] text-[#6A718B]">댓글</div>

    <div class="w-[862px]">
      <Comment v-for="comment in comments" :comment />
    </div>

    <div>
      <textarea
        class="w-full h-[133px] resize-none pt-3 px-6 rounded-lg pretend text-[14px] bg-[#f0f0f0] border-[#d4d4d4]"
        placeholder="문제집에 대해 어떻게 생각하시나요?"
      ></textarea>
    </div>
  </div>
</template>
<style scoped></style>
