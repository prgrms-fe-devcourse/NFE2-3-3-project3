<script setup>
import allProblem from "@/assets/icons/exam-result/allProblem.svg";
import correctedProblem from "@/assets/icons/exam-result/correctProblem.svg";
import average from "@/assets/icons/exam-result/average.svg";
import ExamResultChart from "./ExamResultChart.vue";
import ExamResultTable from "./ExamResultTable.vue";
import { dummyData } from "./DummyData";
import { ref, onMounted } from "vue";

const isCollapsed = ref(true);

const toggleProblemSolution = () => {
  isCollapsed.value = !isCollapsed.value;
};

//api 바인딩하시면 그냥 싹 지우셔도 됨니다.. ㅎㅎ

// 테이블 데이터 관리
const isShowed = ref(false);
const tableData = ref([]);
const loading = ref(true);

// 데이터를 가져오는 함수
const fetchTableData = async () => {
  loading.value = true;
  try {
    // 더미 데이터를 로드하는 가상 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 가상 딜레이
    tableData.value = dummyData; // DummyData 데이터를 테이블에 바인딩
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    loading.value = false; // 로딩 상태 해제
  }
};
// 토글 함수 추가
const toggleShowGrade = async () => {
  isShowed.value = !isShowed.value;
  if (isShowed.value && tableData.value.length === 0) {
    // 테이블이 처음 열릴 때 데이터를 로드
    await fetchTableData();
  }
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchTableData();
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
          <span class="text-5xl">57</span>
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
          <span class="text-5xl">56</span>
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
          <span class="text-5xl">28</span>
        </div>
        <div class="flex items-center pt-8 flex-shrink-0">
          <img :src="average" alt="평균정답갯수" />
        </div>
      </div>
    </div>
    <div class="border border-[#D4D4D4] rounded-[16px] mt-8 p-4">
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
        <!-- 타이틀 -->
        <h3 class="font-bold text-gray-700">문제 풀이 보기</h3>

        <svg
          v-if="isCollapsed"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-600 transition-transform transform"
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
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-600 transition-transform transform rotate-90 duration-300 ease-in-out"
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
    <div class="mt-8">
      <h1>문제지 나오면 넣자.. 흐ㅠ귷</h1>
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
          v-if="isShowed"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-600 transition-transform transform"
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
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-600 transition-transform transform rotate-90 duration-300 ease-in-out"
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

      <div v-if="isShowed">
        <div v-if="loading" class="text-center text-gray-500">Loading...</div>
        <table
          v-else
          class="w-full text-left border-t border-gray-300 border-collapse border-spacing-0 mt-4"
        >
          <thead>
            <tr class="bg-gray-100">
              <th
                v-for="(header, index) in Object.keys(tableData[0] || {})"
                :key="index"
                class="px-4 py-2 border-b border-r border-gray-300"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in tableData.slice(1)" :key="rowIndex">
              <td
                v-for="(value, colIndex) in Object.values(row)"
                :key="colIndex"
                class="px-4 py-2 border-b border-r border-gray-300"
              >
                {{ value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
