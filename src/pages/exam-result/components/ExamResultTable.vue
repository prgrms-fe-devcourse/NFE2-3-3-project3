<script setup>
import { computed, watch, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useExamResultStore } from "@/store/ExamResultStore";
import { useRoute } from "vue-router";

const examResultStore = useExamResultStore();
const route = useRoute();
const testResultId = computed(() => route.params.examResultId);

const { tableData, isFetchingProblems, problems } =
  storeToRefs(examResultStore);
const { selectProblem, toggleFlag, fetchProblems } = examResultStore;

let abortController = new AbortController();
onUnmounted(() => abortController.abort());

const loadProblems = async (id) => {
  try {
    if (!id || isFetchingProblems.value) return;
    abortController.abort();
    abortController = new AbortController();
    await fetchProblems(id, { signal: abortController.signal });
    console.log("Problems loaded:", problems.value);
  } catch (error) {
    if (error.name !== "AbortError") {
      examResultStore.error = error.message;
      console.error("Load error:", error);
    }
  }
};

watch(
  testResultId,
  (newId, oldId) => {
    if (newId !== oldId) loadProblems(newId);
  },
  { immediate: true },
);
onUnmounted(() => {
  examResultStore.$reset(); // Store 상태 초기화
});
</script>

<template>
  <div class="container mx-auto mt-8">
    <!-- 문제 테이블 -->
    <div class="border border-[#D4D4D4] rounded-[16px] overflow-hidden mb-8">
      <table class="custom-table">
        <tbody>
          <template
            v-for="(row, rowIndex) in tableData"
            :key="'row-' + rowIndex"
          >
            <!-- 숫자 행 -->
            <tr>
              <td
                v-for="(cell, colIndex) in row"
                :key="'number-cell-' + colIndex"
                class="cell problem-cell"
                :class="{
                  highlighted: cell === examResultStore.currentProblem,
                }"
                @click="selectProblem(cell)"
              >
                <button class="w-full py-2">
                  {{ cell.number }}
                </button>
              </td>
            </tr>
            <!-- 플래그 행 -->
            <tr>
              <td
                v-for="(cell, colIndex) in row"
                :key="'flag-cell-' + colIndex"
                class="cell flag-cell"
                @click="toggleFlag(cell)"
              >
                <i
                  v-if="cell.flagged"
                  class="pi pi-flag"
                  style="color: blue; cursor: pointer"
                ></i>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* 테이블 스타일 */
.custom-table {
  width: 100%; /* 테이블 너비 */
  border-collapse: collapse; /* 셀 경계선 합치기 */
  border: 1px solid #d4d4d4; /* 테두리 */
  border-radius: 16px; /* 둥근 모서리 */
  overflow: hidden;
}

/* 셀 스타일 */
.cell {
  width: 10%; /* 셀 너비 */
  height: 50px; /* 셀 높이 */
  text-align: center;
  border: 1px solid #d4d4d4; /* 셀 경계선 */
}

/* 문제 번호 셀 */
.problem-cell {
  background-color: #ffffff;
}

/* 플래그 셀 */
.flag-cell {
  background-color: #f9f9f9;
  cursor: pointer;
}

/* 강조된 셀 */
.highlighted {
  background-color: #f0f0f0;
  color: #e63946;
  font-weight: bold;
}

/* 버튼 스타일 */
button {
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  padding: 0;
}
</style>
