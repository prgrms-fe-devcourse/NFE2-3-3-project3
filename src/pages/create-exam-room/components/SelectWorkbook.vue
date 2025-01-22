<script setup>
import { ref, onMounted } from "vue";
import SearchBar from "@/components/layout/SearchBar.vue";
import MyWorkBook from "./MyWorkBook.vue";
import { Paginator } from "primevue";
import SelectionChip from "./SelectionChip.vue";
import { workbookAPI } from '@/api/workbook';
import { useAuthStore } from '@/store/authStore';

const props = defineProps({
  selectedWorkbook: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:selectedWorkbook"]);

const authStore = useAuthStore();
const workbooks = ref([]);

const fetchWorkbooks = async () => {
  try {
    const data = await workbookAPI.getUid(authStore.user?.id);
    workbooks.value = data || [];
  } catch (error) {
    console.error('문제집 데이터 불러오기 실패:', error);
  }
};

const handleSearch = (keyword) => {
  console.log("Search:", keyword);
  // TODO: 검색 로직 구현
};

// 페이지네이션 상태
const currentPage = ref(1);
const itemsPerPage = 8;

const onPageChange = (event) => {
  currentPage.value = event.page + 1;
};

const handleWorkbookSelect = (workbook) => {
  emit("update:selectedWorkbook", workbook);
};

onMounted(() => {
  fetchWorkbooks();
});
</script>

<template>
  <!-- 문제집 선택 완료 -> 선택한 문제집 이름 보여주기 -->
  <SelectionChip
    v-if="selectedWorkbook"
    :label="workbookChip"
    icon="pi pi-book"
    @remove="$emit('update:selectedWorkbook', null)"
    removable
  />

  <h2 class="text-2xl text-black-1 font-medium mb-6">문제집 선택하기</h2>

  <!-- 검색 바 -->
  <div class="mb-8">
    <SearchBar @search="handleSearch" />
  </div>

  <!-- 내가 만든 문제집 섹션 -->
  <section class="flex flex-col gap-[18px]">
    <div class="flex items-center gap-[16px]">
      <h2 class="font-semibold text-xl">내가 만든 문제집</h2>
    </div>

    <!-- MyWorkBook 컴포넌트 사용 -->
    <div class="relative">
      <MyWorkBook
        :visibleMyBooks="workbooks"
        @select-workbook="handleWorkbookSelect"
      />

      <!-- 선택 표시 오버레이 -->
      <div
        v-if="selectedWorkbook"
        v-for="workbook in workbooks"
        :key="workbook.id"
        :class="{
          'absolute top-0 left-0 w-[204px] h-[146px] rounded-lg border-2': true,
          'border-orange-500 bg-orange-50/20':
            selectedWorkbook.id === workbook.id,
        }"
        :style="{
          transform: `translate(${((workbook.id - 1) % 4) * 220}px, ${
            Math.floor((workbook.id - 1) / 4) * 162
          }px)`,
        }"
      />
    </div>

    <!-- 페이지네이션 -->
    <Paginator
      :rows="itemsPerPage"
      :totalRecords="workbooks.length"
      @page="onPageChange"
      class="mt-4"
    />
  </section>
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