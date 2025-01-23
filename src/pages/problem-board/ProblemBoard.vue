<script setup>
import { problemAPI } from "@/api/problem";
import ProblemTable from "@/components/layout/ProblemTable.vue";
import Search from "@/components/layout/Search.vue";
import { ref, watchEffect } from 'vue';

const problems = ref([]);

watchEffect(async()=> {
  await problemAPI.getAll()
})
</script>
<template>
  <div class="flex flex-col gap-14 relative">
    <h1 class="text-[42px] font-laundry">문제 게시판</h1>
    <Search :show-status="true" />
    <ProblemTable :problems="problems" />
  </div>
</template>
<style scoped></style>
