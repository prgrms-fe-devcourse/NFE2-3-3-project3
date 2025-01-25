<script setup>
import { Button } from "primevue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { workbookProblemService } from "@/api/workbook_problem";

const route = useRoute();
const workbookId = route.params.workbookId; // 라우트에서 workbookId 추출
const problems = ref([]); // 문제 목록
const currentProblem = ref({}); // 현재 표시 중인 문제
const isLoading = ref(true);
const error = ref(null);

// 문제 데이터 패치
onMounted(async () => {
  try {
    const data = await workbookProblemService.fetchWorkbookProblems(workbookId);
    problems.value = data;
    currentProblem.value = data[0] || {}; // 첫 번째 문제를 기본으로 표시 (예시)
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-lg w-full mx-auto">
    <!-- 문제 번호와 다시 볼 문제 버튼 -->
    <div class="flex items-center justify-left gap-4 pb-4 mb-4">
      <!-- 문제 번호 -->
      <h2 class="text-lg font-bold">문제 {{ currentProblem.number }}</h2>
      <Button
        label="다시 볼 문제"
        icon="pi pi-flag"
        size="small"
        severity="secondary"
        class="!bg-navy-4 !text-white"
      />
    </div>

    <!-- question -->
    <div class="text-gray-800 mb-6">
      <p class="mb-4">
        {{ currentProblem.question }}
      </p>
    </div>

    <!-- 이미지 -->
    <div v-if="currentProblem.image_src" class="flex justify-center mb-6">
      <img
        :src="currentProblem.image_src"
        alt="Problem_Image"
        class="max-w-full h-auto"
      />
    </div>

    <!-- 내 선택 (아직 미구현)-->
    <div class="mb-6">
      <h3 class="font-bold text-gray-900 mb-2">내 선택</h3>
      <div class="flex items-start space-x-4 border-b pb-4">
        <div
          class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-black font-bold"
        >
          5
        </div>
        <p class="text-gray-800 flex-grow">
          {{ currentProblem.user_answer_explanation }}
        </p>
      </div>
    </div>

    <!--answer -->
    <div class="mb-6">
      <h3 class="font-bold text-gray-900 mb-2">답</h3>
      <div class="flex items-center space-x-4">
        <span
          class="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-black font-bold"
        >
          {{ currentProblem.answer }}
        </span>
        <p class="text-gray-800">
          {{ currentProblem.answer_explanation }}
        </p>
      </div>
    </div>

    <!-- 풀이 -->
    <div>
      <h3 class="font-bold text-gray-900 mb-2">풀이</h3>
      <p class="text-gray-800">
        {{ currentProblem.explanation }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 필요한 경우 Tailwind CSS를 보완할 추가 스타일을 작성할 수 있습니다. */
</style>
