<script setup>
import { defineProps } from "vue";

const { comment } = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div class="my-8">
    <div class="flex justify-between">
      <div class="flex items-center mb-1">
        <div class="text-[16px] font-pretend">{{ comment.author }}</div>
        <div class="text-[12px] text-[#b1b1b1] ml-[5px] mt-[1px]">
          {{ comment.date }}
        </div>
      </div>

      <div class="flex w-[92px] justify-between">
        <button
          class="rounded-lg bg-[#f0f0f0] h-[17px] w-[42px] text-[10px] flex items-center justify-center"
        >
          <img
            src="../../assets/icons/comment/update.svg"
            alt="수정"
            class="w-3 h-3 mr-1"
          />
          <span>수정</span>
        </button>

        <button
          class="rounded-lg bg-[#f0f0f0] h-[17px] w-[42px] text-[10px] flex items-center justify-center"
        >
          <img
            src="../../assets/icons/comment/delete.svg"
            alt="삭제"
            class="w-3 h-3 mr-1"
          />
          <span>삭제</span>
        </button>
      </div>
    </div>
    <div class="text-[14px]">
      {{ comment.contents }}
    </div>
  </div>
</template>
<style scoped></style>
