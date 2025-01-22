<script setup>
import { Accordion, AccordionTab } from 'primevue'

defineProps({
  answer: {
    type: String,
    default: ''
  },
  explanation: {
    type: String,
    default: ''
  },
  source: {        // 출처를 위한 prop 추가
    type: String,
    default: ''
  }
});
</script>

<template>
  <div class="mb-8">
    <Accordion class="w-full">
      <AccordionTab>
        <template #header>
          <span class="text-lg font-semibold">풀이와 답 보기</span>
        </template>
        <div class="p-4 border-b border-gray-200">
          <h4 class="text-lg font-semibold mb-4">정답</h4>
          <p class="text-gray-700">
            {{ answer || "답이 없습니다." }}
          </p>
        </div>
        <div class="p-4">
          <h4 class="text-lg font-semibold mb-4">문제 해설</h4>
          <p class="text-gray-700">
            {{ explanation || "해설이 없습니다." }}
          </p>
        </div>
      </AccordionTab>
    </Accordion>

    <!-- 출처  -->
    <p v-if="source" class="text-sm text-gray-500 mt-4 bg-black-6 p-4 rounded-lg">
      출처: {{ source }}
    </p>
  </div>
</template>

<style scoped>
:deep(.p-accordion .p-accordion-header .p-accordion-header-link) {
  background-color: #f3f4f6;
  color: #4f4f4f;
  border: none;
  padding: 1rem;
}

:deep(.p-accordion .p-accordion-content) {
  border: none;
  background-color: #ffffff;
}

:deep(.p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link) {
  background-color: #f3f4f6;
  color: #4f4f4f;
  border: none;
}

:deep(.p-accordion .p-accordion-header:not(.p-highlight):not(.p-disabled):hover .p-accordion-header-link) {
  background-color: #e5e7eb;
  border: none;
}
</style>