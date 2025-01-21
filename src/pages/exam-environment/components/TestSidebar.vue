<script setup>
import { Button } from "primevue";
import { defineProps } from "vue";

const { userAnswers, showWarning } = defineProps({
  userAnswers: {
    type: Array,
    required: true,
  },
  showWarning: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits([
  "submitAnswers",
  "submitAnswersSafely",
  "setCurrentProblemIndex",
]);
</script>
<template>
  <aside class="flex flex-col min-w-72 w-72 h-screen border-l border-black-4">
    <div class="flex flex-col justify-center items-center h-16 bg-black-5">
      <p class="font-semibold text-xl">남은 시간</p>
    </div>
    <div class="flex justify-center items-center h-24">
      <div class="flex gap-4 text-3xl">
        <div class="flex flex-col items-center">
          <span>00</span>
          <span class="text-sm text-gray-3">시간</span>
        </div>
        <span class="text-gray-3">:</span>
        <div class="flex flex-col items-center">
          <span>00</span>
          <span class="text-sm text-gray-3">분</span>
        </div>
        <span class="text-gray-3">:</span>
        <div class="flex flex-col items-center">
          <span>00</span>
          <span class="text-sm text-gray-3">초</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center h-16 bg-black-5">
      <p class="font-semibold text-xl">문제</p>
    </div>
    <div class="flex justify-center items-center gap-6 my-4">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-black-4 rounded-full"></div>
        <span class="text-sm">안 푼 문제</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-orange-1 rounded-full"></div>
        <span class="text-sm">푼 문제</span>
      </div>
    </div>

    <div class="h-full grid grid-cols-5 auto-rows-max gap-2 px-7">
      <button
        v-for="(userAnswer, index) in userAnswers"
        @click="emit('setCurrentProblemIndex', index)"
        type="button"
        :class="[
          'flex justify-center items-center w-10 h-10 rounded-l-lg rounded-tr-lg text-white',
          userAnswer ? 'bg-orange-1' : 'bg-black-4',
        ]"
      >
        {{ index + 1 }}
      </button>
    </div>

    <Button
      v-if="!showWarning"
      @click="emit('submitAnswersSafely')"
      label="제출하기"
      class="w-44 h-9 mb-5 mx-auto"
      size="large"
      rounded
    />
    <div v-else class="flex flex-col items-center gap-2">
      <div class="flex items-center gap-2">
        <span class="pi pi-exclamation-circle text-red-1"></span>
        <span>아직 풀지 않은 문제가 있습니다.</span>
      </div>
      <Button
        @click="emit('submitAnswers')"
        label="그래도 제출하기"
        class="w-44 h-9 mb-5 mx-auto"
        size="large"
        rounded
      />
    </div>
  </aside>
</template>
<style scoped></style>
