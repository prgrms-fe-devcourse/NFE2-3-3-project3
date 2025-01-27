<script setup>
import Search from "@/components/layout/Search.vue";
import { ref, watchEffect, computed, watch } from "vue";
import { Paginator, Select } from "primevue";
import ProblemSet from "@/components/layout/ProblemSet.vue";
import { SORT, SORTS } from "@/const/sorts";
import { workbookAPI } from "@/api/workbook";
import { formatDate } from "@/utils/formatDate";
import EmptyText from "@/components/layout/EmptyText.vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();
const { keyword, startDate, endDate, sort: sortFromQuery } = route.query;
const problemSets = ref([]);
const sorts = ref(SORTS);
const currentSort = sortFromQuery === SORT.likes ? SORTS[1] : SORTS[0];
const sort = ref(currentSort);
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

const search = async (keyword, startDate, endDate, sort) => {
  first.value = 0;
  problemSets.value = await workbookAPI.search(
    keyword,
    formatDate(startDate),
    formatDate(endDate),
  );

  router.push({
    query: {
      keyword,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      sort: sort.value,
    },
  });
};

watch(
  () => sort.value,
  () => {
    first.value = 0;
    search(keyword, startDate, endDate, sort.value);
  },
);

watchEffect(async () => {
  problemSets.value = await workbookAPI.search(keyword, startDate, endDate);
}); 
</script>
<template>
  <div class="relative flex flex-col gap-14">
    <h1 class="text-[42px] font-laundry">문제집 게시판</h1>
    <Search :show-status="false" @search="search" />
    <section class="flex flex-col gap-[18px]">
      <div class="flex items-center justify-between">
        <p class="text-xl font-semibold">{{ problemSets.length }} 문제집</p>
        <Select
          v-model="sort"
          :options="sorts"
          optionLabel="name"
          class="w-40"
        />
      </div>

      <div
        v-if="!problemSets.length"
        class="flex items-center justify-center h-40"
      >
        <EmptyText>검색된 문제집이 없습니다...</EmptyText>
      </div>
      <div v-else class="grid grid-cols-4 gap-4">
        <ProblemSet
          v-for="problemSet in sortedProblemSets"
          :problemSet="problemSet"
          :key="problemSet.id"
          :to="`/problem-set-board-detail/${problemSet.id}`"
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
