<script setup>
import Search from "@/components/layout/Search.vue";
import { ref, watch } from "vue";
import ExamHistoryTable from "./components/examHistoryTable.vue";
import { testResultAPI } from "@/api/testResult";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import { formatDate } from "@/utils/formatDate";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const exams = ref([]);

const search = async (keyword, startDate, endDate) => {
  exams.value = await testResultAPI.search(
    user.value.id,
    keyword,
    formatDate(startDate),
    formatDate(endDate),
  );
};

const fetchInitialData = async () => {
  if (!user.value) return;
  const result = await testResultAPI.getAllByUserId(user.value.id);
  exams.value = result;
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
  <div class="flex flex-col gap-14 relative">
    <h1 class="text-[42px] font-laundry">시험 내역</h1>
    <Search :show-status="false" @search="search" />
    <ExamHistoryTable :exams="exams" />
  </div>
</template>
<style scoped></style>
