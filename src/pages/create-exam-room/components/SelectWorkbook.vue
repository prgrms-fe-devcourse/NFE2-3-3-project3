<script setup>
import { ref } from 'vue';
import SearchBar from '@/components/layout/SearchBar.vue';
import MyWorkBook from './MyWorkBook.vue';
import { Paginator } from 'primevue';

const emit = defineEmits(['update:selectedWorkbook']);

// 더미 데이터
const workbooks = ref([
  {
    id: 1,
    title: "정보처리기사 실기",
    description: "2024 정보처리기사 실기 대비 문제 모음집",
    count: 120,
  },
  {
    id: 2,
    title: "SQLD 자격증",
    description: "SQLD 자격증 취득을 위한 기출 문제",
    count: 85,
  },
  {
    id: 3,
    title: "JavaScript 기초",
    description: "JavaScript 기초 개념 및 코딩 테스트 준비",
    count: 95,
  },
  {
    id: 4,
    title: "리액트 심화",
    description: "React 고급 개념 및 실전 문제 모음",
    count: 75,
  },
]);

const handleSearch = (keyword) => {
  console.log('Search:', keyword);
};

// 페이지네이션 상태
const currentPage = ref(1);
const itemsPerPage = 8;

const onPageChange = (event) => {
  currentPage.value = event.page + 1;
};

const handleWorkbookSelect = (workbook) => {
  emit('update:selectedWorkbook', workbook);
};
</script>

<template>
  <div class="px-16 py-6">
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
      
      <!-- MyWorkBook 컴포넌트 사용 - workbooks를 직접 전달 -->
      <MyWorkBook 
        :visibleMyBooks="workbooks"
        @select-workbook="handleWorkbookSelect"
      />
      
      <!-- 페이지네이션 -->
      <Paginator 
        :rows="itemsPerPage"
        :totalRecords="workbooks.length"
        @page="onPageChange"
        class="mt-4"
      />
    </section>
  </div>
</template>