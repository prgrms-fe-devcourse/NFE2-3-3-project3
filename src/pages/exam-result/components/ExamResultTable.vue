<script setup>
import { computed, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useExamResultStore } from "@/store/ExamResultStore";
import { useAuthStore } from "@/store/authStore";
import { useRoute } from "vue-router";
import { useToast } from "primevue";

const examResultStore = useExamResultStore();
const authStore = useAuthStore();
const route = useRoute();
const toast = useToast();
const testResultId = computed(() => route.params.examResultId);
const userId = computed(() => authStore.user?.id);

const { tableData, currentProblem, againViewProblems } =
  storeToRefs(examResultStore);

const { selectProblem, toggleFlag, checkAgainViewStatus } = examResultStore;

// 플래그 상태 토글 핸들러
const handleToggleFlag = async (cell) => {
  if (!cell || !cell.id) return;
  try {
    await toggleFlag(cell.id, userId.value, toast);
  } catch (error) {
    console.error("handleToggleFlag 오류:", error);
  }
};

// 문제 선택 핸들러
const handleSelectProblem = async (cell) => {
  if (!cell || !cell.id) return;
  try {
    await selectProblem(cell.id, userId.value);
  } catch (error) {
    console.error("handleSelectProblem 오류:", error);
  }
};

watch(
  currentProblem,
  async (newProblem) => {
    if (!newProblem) {
      console.warn("currentProblem이 설정되지 않았습니다.");
      examResultStore.currentProblem = null; // currentProblem 초기화
      examResultStore.againViewProblems = []; // "다시 볼 문제" 상태 초기화
      return;
    }

    try {
      console.log("currentProblem 변경 감지:", newProblem);
      // 문제 선택 및 "다시 볼 문제" 상태 확인
      await checkAgainViewStatus(userId.value, newProblem.id);
    } catch (error) {
      console.error("currentProblem 상태 업데이트 중 오류:", error);
    }
  },
  { immediate: true },
);

watch(
  againViewProblems,
  (newVal) => {
    console.log("againViewProblems 변경 감지:", newVal);
  },
  { deep: true },
);
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
                :class="{ highlighted: cell.id === currentProblem?.id }"
                @click="handleSelectProblem(cell)"
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
                @click="() => handleToggleFlag(cell)"
              >
                <i
                  v-if="againViewProblems.includes(cell.id)"
                  class="pi pi-flag"
                  style="color: orange; cursor: pointer"
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
  cursor: pointer;
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
  background-color: #f6c085;
  color: #f60505;
  font-weight: bold;
}

/* 셀에 마우스 오버 스타일 */
.cell:hover {
  background-color: #fbe1c0;
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
