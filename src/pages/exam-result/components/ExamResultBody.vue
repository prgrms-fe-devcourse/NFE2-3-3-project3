<script setup>
import allProblem from "@/assets/icons/exam-result/allProblem.svg";
import correctedProblem from "@/assets/icons/exam-result/correctProblem.svg";
import average from "@/assets/icons/exam-result/average.svg";
import ExamResultChart from "./ExamResultChart.vue";
import ExamResultTable from "./ExamResultTable.vue";
import ExamResultProblems from "./ExamResultProblems.vue";

import { ref, onMounted } from "vue";
import { testResultAPI } from "@/api/testResult";
import { useAuthStore } from "@/store/authStore";

//데이터 관리
const totalCount = ref(0);
const correctCount = ref(0);
const averageCount = ref(0);
const isTableData = ref([]);
const authStore = useAuthStore();
const testCenterId = ref(null);

const toggleProblemSolution = () => {
  isCollapsed.value = !isCollapsed.value;
};

// 토글 관리
const isShowed = ref(false);
const isCollapsed = ref(true);

// 토글 함수 추가
const toggleShowGrade = async () => {
  if (isShowed.value) {
    isShowed.value = false;
    return;
  }
  isShowed.value = true;
};

// 컴포넌트 마운트 시 데이터 로드

onMounted(async () => {
  try {
    // 새로고침시 방지
    if (!authStore.user) {
      await authStore.initializeAuth();
    }

    const userId = authStore.user?.id;
    // ID가 없는 경우 조기 종료
    if (!userId) {
      console.error("사용자 ID가 없습니다.");
      return;
    }

    // 사용자가 속한 test_center_id 가져오기
    const userResults = await testResultAPI.getAllByUserId(userId);
    if (userResults && userResults.length > 0) {
      testCenterId.value = userResults[0].test_center_id; // 첫 번째 시험장의 ID 가져오기
    } else {
      console.warn("해당 사용자가 참여한 시험장이 없습니다.");
      return;
    }

    // 점수 데이터 호출
    const { total, correct } = await testResultAPI.getScore(userId);
    const averageScore = await testResultAPI.getAverage(testCenterId.value);

    totalCount.value = total || 0;
    correctCount.value = correct || 0;
    averageCount.value = averageScore;
    //점수 테이블 구성
    if (testCenterId.value) {
      const ScoreCounts = await testResultAPI.getScoresByTestCenter(
        testCenterId.value,
      );
      //재할당
      isTableData.value = ScoreCounts;
      //디버깅
      console.log("같은 시험장에서 시험을 치른 UID들의 데이터:");
      ScoreCounts.forEach(({ uid, correct_count, userName }) => {
        console.log(
          `UID: ${uid}, Correct Count: ${correct_count}, Name: ${userName}`,
        );
      });
    }
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
  }
});
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
      <ExamResultChart
        :totalCount="totalCount"
        :correctCount="correctCount"
        :averageCount="averageCount"
      />
    </div>
    <!-- 문제 테이블 -->
    <ExamResultTable :totalCount="totalCount" />
    <!-- 문제풀이 보기 -->
    <div
      class="rounded-[16px] border border-gray-300 bg-white overflow-hidden mt-8"
    >
      <div
        class="flex items-center justify-between px-4 py-3 cursor-pointer"
        @click="toggleProblemSolution"
      >
        <!-- 타이틀 -->
        <h3 class="font-bold text-gray-700">문제 풀이 보기</h3>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-600 transition-transform transform duration-300 ease-in-out"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          :class="{ 'rotate-90': !isCollapsed }"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
      <!-- 컨텐츠 -->
      <div
        :class="[
          'overflow-hidden transition-all duration-300 ease-in-out',
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100',
        ]"
      >
        <div class="px-4 py-3 text-gray-800 border-t border-gray-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
            <tr v-for="(item, index) in isTableData" :key="index">
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
<style scoped></style>
