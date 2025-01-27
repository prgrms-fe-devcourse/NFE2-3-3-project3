<script setup>
import allProblem from "@/assets/icons/exam-result/allProblem.svg";
import correctedProblem from "@/assets/icons/exam-result/correctProblem.svg";
import average from "@/assets/icons/exam-result/average.svg";
import ExamResultChart from "./ExamResultChart.vue";
import ExamResultTable from "./ExamResultTable.vue";
import ExamResultProblems from "./ExamResultProblems.vue";

import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { useExamResultStore } from "@/store/ExamResultStore";
import { useRoute } from "vue-router";
import { testResultAPI } from "@/api/testResult";

const authStore = useAuthStore();
const examResultStore = useExamResultStore();
const route = useRoute();

// 토글 관리
const isCollapsed = ref(true);
const isShowed = ref(false);

const toggleProblemSolution = () => {
  isCollapsed.value = !isCollapsed.value;
};

// 토글 함수 추가
const toggleShowGrade = async () => {
  if (isShowed.value) {
    isShowed.value = false;
    return;
  }
  isShowed.value = true;
};

const {
  currentProblem,
  correctCount,
  totalCount,
  averageCount,
  isFetchingProblems,
  isTableData,
  isLoading,
  error,
} = storeToRefs(examResultStore);

const initializeData = async () => {
  try {
    if (isFetchingProblems.value) return;

    // 초기화 상태 설정
    examResultStore.isFetchingProblems = true;
    examResultStore.error = null;

    if (!authStore.user) {
      await authStore.initializeAuth();
    }

    const testResultId = Number(route.params.examResultId);
    if (!testResultId) throw new Error("잘못된 test_result_id");

    await Promise.all([
      examResultStore.initializeExamData(authStore.user.id, testResultId),
      examResultStore.fetchProblems(testResultId),
    ]);

    const testCenterId = await testResultAPI.fetchTestCenterId(testResultId);
    if (testCenterId) {
      await examResultStore.getScoresByTestCenter(testCenterId);
    }
  } catch (err) {
    console.error("초기화 실패, catchError :", error);
    examResultStore.error = err.message || "문제를 불러오는 데 실패했습니다.";
  } finally {
    examResultStore.isFetchingProblems = false;
  }
};

onMounted(initializeData);

watch(
  () => route.params.examResultId,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      await initializeData();
    }
  },
);
</script>

<template>
  <section class="w-full pl-4">
    <div class="grid grid-cols-3 gap-4">
      <!-- 카드 시작 -->
      <div
        class="flex items-center pl-8 pr-4 pb-10 pt-4 bg-white border border-[#D4D4D4] rounded-2xl text-start overflow-hidden"
      >
        <div class="space-y-1 flex-shrink-0">
          <p class="text-lg">전체 문제</p>
          <span class="text-5xl">{{ totalCount }}</span>
        </div>
        <div class="flex items-center pt-8 pl-12 flex-shrink-0">
          <img :src="allProblem" alt="전체문제" />
        </div>
      </div>

      <div
        class="flex items-center pl-8 pr-4 pb-10 pt-4 gap-16 bg-white border border-[#D4D4D4] rounded-2xl text-start overflow-hidden"
      >
        <div class="space-y-1 flex-shrink-0">
          <p class="text-lg">맞힌 문제</p>
          <span class="text-5xl">{{ correctCount }}</span>
        </div>
        <div class="flex items-center pt-8 ml-1 flex-shrink-0">
          <img :src="correctedProblem" alt="맞힌 문제" />
        </div>
      </div>
      <div
        class="flex items-center pl-8 pr-4 pb-10 pt-4 gap-4 bg-white border border-[#D4D4D4] rounded-2xl text-start overflow-hidden"
      >
        <div class="space-y-1 flex-shrink-0">
          <p class="text-lg">평균 정답 갯수</p>
          <span class="text-5xl">{{ averageCount }}</span>
        </div>
        <div class="flex items-center pt-8 flex-shrink-0">
          <img :src="average" alt="평균정답갯수" />
        </div>
      </div>
    </div>
    <div class="border border-[#D4D4D4] rounded-2xl mt-8 p-4">
      <ExamResultChart />
    </div>
    <!-- 문제 테이블 -->
    <ExamResultTable />
    <!-- 문제풀이 보기 -->
    <div
      class="rounded-[16px] border border-gray-300 bg-white overflow-hidden mt-8"
    >
      <div
        class="flex items-center justify-between px-4 py-3 cursor-pointer"
        @click="toggleProblemSolution"
      >
        <h3 class="font-bold text-gray-700">문제 풀이 보기</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-600 transition-transform duration-300 ease-in-out"
          :class="{ 'rotate-90': !isCollapsed }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      <!-- 컨텐츠 영역 -->
      <div
        :class="[
          'overflow-hidden transition-all duration-300 ease-in-out',
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100',
        ]"
      >
        <div class="px-8 py-4 mb-6 text-gray-800 border-t border-gray-300">
          <ExamResultProblems />
        </div>
      </div>
    </div>

    <!-- 다른 사용자 점수 보기 -->
    <div
      class="rounded-[16px] border border-gray-300 bg-white overflow-hidden mt-8"
    >
      <div
        class="flex items-center justify-between px-4 py-3 cursor-pointer"
        @click="toggleShowGrade"
      >
        <h3 class="font-bold text-gray-700">다른 사용자 점수 보기</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-600 transition-transform transform duration-300 ease-in-out"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          :class="{ 'rotate-90': isShowed }"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
      <!--점수 테이블 -->
      <div v-if="isShowed">
        <table class="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th class="border border-gray-400 px-2 py-2">Name</th>
              <th class="border border-gray-400 px-2 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in isTableData" :key="item.uid">
              <td class="border border-gray-400 px-2 py-1 text-center">
                {{ item.userName }}
              </td>
              <td class="border border-gray-400 px-2 py-1 text-center">
                {{ item.correct_count }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
