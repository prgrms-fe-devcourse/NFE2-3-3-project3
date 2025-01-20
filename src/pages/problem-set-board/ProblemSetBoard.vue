<script setup>
import Search from "@/components/layout/Search.vue";
import { ref } from "vue";
import { Paginator, Select } from "primevue";
import ProblemSet from "@/components/layout/ProblemSet.vue";

const WORK_BOOKS = [1, 2, 3, 4, 5];
const SORTS = ref([
  { name: "최신순", value: "최신순" },
  { name: "좋아요 많은 순", value: "좋아요 많은 순" },
  { name: "정답률 높은 순", value: "정답률 높은 순" },
  { name: "정답률 낮은 순", value: "정답률 낮은 순" },
]);
const sort = ref({ name: "최신순", value: "최신순" });
</script>
<template>
  <section class="flex flex-col gap-16 w-[1000px] mx-auto mt-[72px]">
    <h1 class="text-[42px] font-laundry">문제집 게시판</h1>
    <Search :show-status="false" />
    <section class="flex flex-col gap-[18px]">
      <div class="flex justify-between items-center">
        <p class="font-semibold text-xl">{{ WORK_BOOKS.length }} 문제집</p>
        <Select
          v-model="sort"
          :options="SORTS"
          optionLabel="name"
          class="w-40"
        />
      </div>

      <div class="grid grid-cols-4 gap-4">
        <ProblemSet
          v-for="workbook in WORK_BOOKS"
          :key="workbook"
          :to="`/problem-set-board/${workbook}`"
        />
      </div>
    </section>
    <Paginator :rows="10" :totalRecords="120"></Paginator>
  </section>
</template>
<style scoped></style>
