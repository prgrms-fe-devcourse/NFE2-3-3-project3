<script setup>
import Search from "@/components/layout/Search.vue";
import { ref, watchEffect, computed, watch } from "vue";
import { Paginator, Select } from "primevue";
import ProblemSet from "@/components/layout/ProblemSet.vue";
import { SORT, SORTS } from "@/const/sorts";
import { workbookAPI } from "@/api/workbook";
import { formatDate } from "@/utils/formatDate";
import EmptyText from "@/components/layout/EmptyText.vue";

const problemSets = ref([]);
const sorts = ref(SORTS);
const sort = ref(SORTS[0]);
const first = ref(0);
const rows = ref(8);

const sortedProblemSets = computed(() => {
  const newProblemSets = [...problemSets.value];
  switch (sort.value?.value) {
    case SORT.latest:
      return newProblemSets
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(first.value, first.value + rows.value);
    case SORT.likes:
      return newProblemSets
        .sort((a, b) => (b.likes.length || 0) - (a.likes.length || 0))
        .slice(first.value, first.value + rows.value);
    default:
      return newProblemSets.slice(first.value, first.value + rows.value);
  }
});

const search = async (keyword, startDate, endDate) => {
  first.value = 0;
  problemSets.value = await workbookAPI.search(
    keyword,
    formatDate(startDate),
    formatDate(endDate),
  );
};

watch(
  () => sort.value,
  () => {
    first.value = 0;
  },
);

watchEffect(async () => {
  problemSets.value = await workbookAPI.search(null, null, null);
});
</script>
<template>
  <div class="flex flex-col gap-14 relative">
    <h1 class="text-[42px] font-laundry">문제집 게시판</h1>
    <Search :show-status="false" @search="search" />
    <section class="flex flex-col gap-[18px]">
      <div class="flex justify-between items-center">
        <p class="font-semibold text-xl">{{ problemSets.length }} 문제집</p>
        <Select
          v-model="sort"
          :options="sorts"
          optionLabel="name"
          class="w-40"
        />
      </div>

      <div
        v-if="!problemSets.length"
        class="flex justify-center items-center h-40"
      >
        <EmptyText>검색된 문제집이 없습니다...</EmptyText>
      </div>
      <div v-else class="grid grid-cols-4 gap-4">
        <ProblemSet
          v-for="problemSet in sortedProblemSets"
          :problemSet="problemSet"
          :key="problemSet.id"
          :to="`/problem-set-board/${problemSet.id}`"
        />
      </div>
    </section>
    <Paginator
      v-model:first="first"
      :rows="rows"
      :totalRecords="problemSets.length"
    ></Paginator>
  </div>
</template>
<style scoped></style>
