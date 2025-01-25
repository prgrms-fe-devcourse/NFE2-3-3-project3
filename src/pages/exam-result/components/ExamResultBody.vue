<script setup>
import allProblem from "@/assets/icons/exam-result/allProblem.svg";
import correctedProblem from "@/assets/icons/exam-result/correctProblem.svg";
import average from "@/assets/icons/exam-result/average.svg";
import ExamResultChart from "./ExamResultChart.vue";
import ExamResultTable from "./ExamResultTable.vue";
import ExamResultProblems from "./ExamResultProblems.vue";

import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useExamResultStore } from "@/store/ExamResultStore.js";

const authStore = useAuthStore();
const examResultStore = useExamResultStore();

const toggleProblemSolution = () => {
  isCollapsed.value = !isCollapsed.value;
};

// 토글 관리
const isCollapsed = ref(true);
const isShowed = ref(false);
// 계산 속성

const currentProblem = computed(() => examResultStore.currentProblem);
const userId = computed(() => authStore.user?.id);

// 토글 함수 추가
const toggleShowGrade = async () => {
  if (isShowed.value) {
    isShowed.value = false;
    return;
  }
  isShowed.value = true;
};

// 데이터 초기화
const initializeData = async () => {
  try {
    if (!authStore.user) await authStore.initializeAuth();
    if (userId.value) await examResultStore.initializeExamData(userId.value);
  } catch (error) {
    console.error("데이터 초기화 오류:", error);
  }
};

onMounted(initializeData);
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
          <span class="text-5xl">{{ examResultStore.totalCount }}</span>
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
          <span class="text-5xl">{{ examResultStore.correctCount }}</span>
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
          <span class="text-5xl">{{ examResultStore.averageCount }}</span>
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
          <!-- 정답 표시 -->
          <div v-if="currentProblem" class="mb-4">
            <h4 class="font-semibold text-lg mb-2">정답</h4>
            <div class="flex items-center gap-2">
              <span
                class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-3 text-red-1 font-bold"
              >
                {{ currentProblem.answer }}
              </span>
              <p class="text-gray-700">
                {{
                  currentProblem.options?.[currentProblem.answer - 1] ||
                  "선택지 정보 없음"
                }}
              </p>
            </div>
          </div>

          <!-- 풀이 내용 -->
          <div
            v-if="currentProblem?.explanation"
            class="bg-gray-50 p-4 rounded-lg"
          >
            <h4 class="font-semibold text-lg mb-2">상세 풀이</h4>
            <p class="text-gray-600 leading-relaxed whitespace-pre-line">
              {{ currentProblem.explanation }}
            </p>
          </div>

          <!-- 데이터 없을 경우 -->
          <div v-else class="text-center py-4 text-gray-400">
            표시할 풀이 내용이 없습니다
          </div>
        </div>
      </div>
    </div>

    <!-- 선택한 문제 보여주기 -->
    <div class="rounded-2xl border border-gray-300 mt-8 p-2">
      <ExamResultProblems />
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
            <tr
              v-for="(item, index) in examResultStore.isTableData"
              :key="index"
            >
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
