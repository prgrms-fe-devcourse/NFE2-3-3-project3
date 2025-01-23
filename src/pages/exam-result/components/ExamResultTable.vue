<script setup>
import { ref } from "vue";

// 문제 데이터 초기화
const problems = ref(
  Array.from({ length: 27 }, (_, i) => ({
    number: i + 1, // 문제 번호
    flagged: false, // 플래그 상태
    highlight: false, // 강조 상태
  })),
);

// 문제 클릭 시 강조 처리 (토글 방식)
const toggleHighlight = (problem) => {
  // 현재 문제의 강조 상태를 토글
  problem.highlight = !problem.highlight;

  // 다른 문제의 강조 상태를 해제
  problems.value.forEach((p) => {
    if (p !== problem) {
      p.highlight = false; // 현재 문제 외에는 강조 해제
    }
  });
};

// 플래그 토글
const toggleFlag = (problem) => {
  problem.flagged = !problem.flagged; // 플래그 상태 토글
};

// 행과 열 크기 설정
const rows = 3;
const columns = 10;

// 테이블 데이터를 행렬 형태로 변환
const tableData = ref([]);
for (let i = 0; i < rows; i++) {
  tableData.value.push(problems.value.slice(i * columns, (i + 1) * columns));
}
</script>

<template>
  <div class="border border-[#D4D4D4] rounded-[16px] mt-8 overflow-hidden">
    <table class="custom-table">
      <tbody>
        <!-- 숫자행 + 플래그행 반복 -->
        <template v-for="(row, rowIndex) in tableData" :key="'row-' + rowIndex">
          <!-- 숫자 행 -->
          <tr>
            <td
              v-for="(cell, colIndex) in row"
              :key="'number-cell-' + colIndex"
              :class="['cell problem-cell', { highlighted: cell.highlight }]"
              @click="toggleHighlight(cell)"
            >
              <button>{{ cell.number }}</button>
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
