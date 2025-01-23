<script setup>
import { ref, computed, watchEffect } from "vue";
import { useAuthStore } from "@/store/authStore";
import { workbookAPI } from "@/api/workbook";
import SearchBar from "@/components/layout/SearchBar.vue";
import MyWorkBook from "./MyWorkBook.vue";
import { Paginator } from "primevue";

const props = defineProps({
  selectedWorkbook: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:selectedWorkbook"]);

const authStore = useAuthStore();
const workbooks = ref([]);
const keyword = ref("");
const currentPage = ref(1);
const itemsPerPage = 8;

// 검색어로 필터링된 문제집 목록
const filteredWorkbooks = computed(() => {
  if (!keyword.value) return workbooks.value;

  return workbooks.value.filter(
    (book) =>
      book.title?.toLowerCase().includes(keyword.value.toLowerCase()) ||
      book.description?.toLowerCase().includes(keyword.value.toLowerCase()),
  );
});

// 현재 페이지에 표시될 문제집 목록
const paginatedWorkbooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredWorkbooks.value.slice(start, end);
});

const handleSearch = (searchKeyword) => {
  keyword.value = searchKeyword;
  currentPage.value = 1; // 검색 시 첫 페이지로 이동
};

const onPageChange = (event) => {
  currentPage.value = event.page + 1;
};

const handleWorkbookSelect = (workbook) => {
  emit("update:selectedWorkbook", workbook);
};

// 문제집 데이터 불러오기
const fetchWorkbooks = async () => {
  try {
    const data = await workbookAPI.getUid(authStore.user?.id);
    workbooks.value = data || [];
  } catch (error) {
    console.error("문제집 데이터 불러오기 실패:", error);
  }
};
watchEffect(() => {
  if (authStore.isAuthenticated && authStore.user?.id) {
    fetchWorkbooks();
  }
});
</script>

<template>
  <div class="w-full">
    <h2 class="text-2xl text-black-1 font-medium mb-6">문제집 선택하기</h2>

    <!-- 검색 바 -->
    <div class="mb-8">
      <SearchBar @search="handleSearch" />
    </div>

    <!-- 문제집 목록 -->
    <section class="flex flex-col gap-5">
      <div class="flex items-center gap-4">
        <h2 class="font-semibold text-xl">내가 만든 문제집</h2>
      </div>

      <div
        v-if="paginatedWorkbooks.length === 0"
        class="text-center py-8 text-gray-500"
      >
        보관한 문제집이 텅 비었습니다. <br />
        문제집을 생성한 후 시험장을 이용할 수 있습니다.
      </div>

      <MyWorkBook
        v-else
        :visibleMyBooks="paginatedWorkbooks"
        @select-workbook="handleWorkbookSelect"
      />

      <!-- 페이지네이션 -->
      <Paginator
        :rows="itemsPerPage"
        :totalRecords="filteredWorkbooks.length"
        @page="onPageChange"
        class="mt-4"
      />
    </section>
  </div>
</template>

<style scoped>
:deep(.p-paginator) {
  background-color: transparent;
  border: none;
}

:deep(.p-paginator .p-paginator-page.p-highlight) {
  background-color: #f97316;
  color: white;
}
</style>
