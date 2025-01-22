<script setup>
import ProblemTable from "@/components/layout/ProblemTable.vue";
import Search from "@/components/layout/Search.vue";
import { ref } from "vue";

const problems = ref([
  {
    id: 1,
    status: "correct",
    title: "정수 삼각형",
    category: "알고리즘",
    origin_source: "프로그래머스",
    problem_type: "ox",
    ismade: true, // 내가 만든 문제
  },
  {
    id: 2,
    status: "incorrect",
    title: "숫자 게임",
    category: "알고리즘",
    origin_source: "프로그래머스",
    problem_type: "multiple_choice",
    ismade: false,
  },
  {
    id: 3,
    status: "",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "ox",
    ismade: true,
  },
  {
    id: 4,
    status: "incorrect",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "multiple_choice",
    ismade: true,
  },
  {
    id: 5,
    status: "incorrect",
    title: "Group Anagrams ",
    category: "알고리즘",
    origin_source: "LeetCode",
    problem_type: "multiple_choice",
    ismade: true,
  },
]);
</script>
<template>
  <section class="flex flex-col gap-16 w-[1000px] mx-auto mt-[72px] relative">
    <h1 class="text-[42px] font-laundry">보관한 문제</h1>
    <Search :show-status="true" />
    <ProblemTable :problems="problems" />
  </section>
</template>
<style scoped></style>
