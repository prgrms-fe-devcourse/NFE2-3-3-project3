<script setup>
import Search from "@/components/layout/Search.vue";
import { ref } from "vue";
import ExamHistoryTable from "./components/examHistoryTable.vue";

const exams = ref([
  {
    id: 1,
    title: "소방경력공무원 관계법규 시험1",
    workbook: {
      id: 1,
      title: "소방경력공무원 관계법규 개념 예제 문제집1",
    },
    time: 3661000,
    solved_with: [
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
    ],
    test_center: {
      start_date: new Date(),
    },
  },
  {
    id: 2,
    title: "소방경력공무원 관계법규 시험2",
    workbook: {
      id: 2,
      title: "소방경력공무원 관계법규 개념 예제 문제집2",
    },
    time: 3661000,
    solved_with: [
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
    ],
    test_center: {
      start_date: new Date(),
    },
  },
  {
    id: 3,
    title: "소방경력공무원 관계법규 시험3",
    workbook: {
      id: 3,
      title: "소방경력공무원 관계법규 개념 예제 문제집3",
    },
    time: 3661000,
    solved_with: [
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
    ],
    test_center: {
      start_date: new Date(),
    },
  },
  {
    id: 4,
    title: "소방경력공무원 관계법규 시험4",
    workbook: {
      id: 4,
      title: "소방경력공무원 관계법규 개념 예제 문제집4",
    },
    time: 3551000,
    solved_with: [
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
    ],
    test_center: {
      start_date: new Date(),
    },
  },
  {
    id: 5,
    title: "소방경력공무원 관계법규 시험5",
    workbook: {
      id: 5,
      title: "소방경력공무원 관계법규 개념 예제 문제집5",
    },
    time: 3661000,
    solved_with: [
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
    ],
    test_center: {
      start_date: new Date(),
    },
  },
  {
    id: 5,
    title: "소방경력공무원 관계법규 시험5",
    workbook: {
      id: 5,
      title: "소방경력공무원 관계법규 개념 예제 문제집5",
    },
    time: 3661000,
    solved_with: [
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
    ],
    test_center: {
      start_date: new Date(),
    },
  },
]);
</script>
<template>
  <div class="flex flex-col gap-14 relative">
    <h1 class="text-[42px] font-laundry">시험 내역</h1>
    <Search :show-status="false" />
    <ExamHistoryTable :exams="exams" />
  </div>
</template>
<style scoped></style>
