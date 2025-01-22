<script setup>
import ProblemTable from "@/components/layout/ProblemTable.vue";
import Search from "@/components/layout/Search.vue";
import { ref } from "vue";

const problems = ref([
  {
    id: 1,
    status: "corrected",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "ox",
  },
  {
    id: 2,
    status: "wrong",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "multiple_choice",
  },
  {
    id: 3,
    status: "",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "ox",
  },
  {
    id: 4,
    status: "wrong",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "multiple_choice",
  },
  {
    id: 5,
    status: "wrong",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "multiple_choice",
  },
]);
</script>
<template>
  <div class="flex flex-col gap-14 relative">
    <h1 class="text-[42px] font-laundry">문제 게시판</h1>
    <Search :show-status="true" />
    <ProblemTable :problems="problems" />
  </div>
</template>
<style scoped></style>
