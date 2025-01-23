<script setup>
import { problemAPI } from "@/api/problem";
import ProblemTable from "@/components/layout/ProblemTable.vue";
import Search from "@/components/layout/Search.vue";
import { ref, watch } from "vue";
import { formatDate } from "@/utils/formatDate";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const problems = ref([]);

const search = async (keyword, startDate, endDate, status) => {
  problems.value = await problemAPI.search(
    user.value.id,
    keyword,
    formatDate(startDate),
    formatDate(endDate),
    status,
  );
};

const fetchInitialData = async () => {
  if (!user.value) return;
  problems.value = await problemAPI.getAllShared(user.value.id);
};

watch(
  () => user.value,
  (newUser) => {
    if (newUser) {
      fetchInitialData();
    }
  },
  { immediate: true },
);
</script>
<template>
  <div class="relative flex flex-col gap-14">
    <h1 class="text-[42px] font-laundry">문제 게시판</h1>
    <Search :show-status="true" @search="search" />
    <ProblemTable
      :problems="problems"
      :show-my-problem="false"
      :show-problem="false"
      :show-shared-problem="false"
    />
  </div>
</template>
<style scoped></style>
