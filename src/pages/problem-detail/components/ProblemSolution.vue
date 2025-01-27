<script setup>
import { ref } from "vue";

defineProps({
  answer: {
    type: String,
    default: "",
  },
  explanation: {
    type: String,
    default: "",
  },
  source: {
    // 출처를 위한 prop 추가
    type: String,
    default: "",
  },
});

const isOpen = ref(false);

const toggleAccordion = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
    <div class="w-full rounded-lg bg-black-3/15 px-4 mb-4 py-6">
      <div
        @click="toggleAccordion"
        class="cursor-pointer flex justify-between items-center"
      >
        <span class="text-lg font-semibold text-black-2">풀이와 답 보기</span>
        <svg
          :class="{'transform rotate-180': isOpen, 'transform rotate-0': !isOpen}"
          class="w-5 h-5 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      
      <div v-if="isOpen" class="p-4 border-t border-b border-gray-300 mt-4">
        <h4 class="text-lg font-semibold text-black-2 mb-4">정답</h4>
        <p class="text-gray-700">
          {{ answer || "답이 없습니다." }}
        </p>
      </div>
      <div v-if="isOpen" class="p-4">
        <h4 class="text-lg font-semibold text-black-2 mb-4">문제 해설</h4>
        <p class="text-gray-700">
          {{ explanation || "해설이 없습니다." }}
        </p>
      </div>
    </div>

    <!-- 출처  -->
    <p
      v-if="source"
      class=" text-gray-500 mt-4 p-4 border-b border-gray-300 mb-10"
    >
      출처 | {{ source }}
    </p>
</template>

<style scoped>
.bg-black-3 {
  background-color: #333;
}
.bg-black-6 {
  background-color: #666;
}
</style>