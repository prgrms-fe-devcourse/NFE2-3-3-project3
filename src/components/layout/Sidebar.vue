<script setup>
import { RouterLink } from "vue-router";
const logoPath = new URL("@/assets/logos/logo.svg", import.meta.url).href;
</script>

<template>
  <aside class="w-[220px] bg-beige-2 h-full flex flex-col relative top-0 z-50 items-center py-6">
    <!-- 로고 -->
    <RouterLink to="/home" class="mb-[24px]">
      <img :src="logoPath" alt="Pullgo" class="w-auto h-auto" />
    </RouterLink>

    <!-- 버튼 -->
    <button
      class="bg-orange-1 text-white text-[18px] w-[188px] h-[48px] border-none rounded-[10px] hover:bg-orange-2 cursor-pointer mb-[24px] font-pretend"
    >
      새로운 문제 만들기
    </button>

    <!-- 내비게이션 -->
    <nav class="w-full pl-4">
      <!-- Library 섹션 -->
      <div class="mb-[24px]">
        <div class="text-[#4F4F4F] text-[14px] mb-[8px] font-pretend font-bold">
          LIBRARY
        </div>
        <RouterLink
          to="/my-problems"
          class="block font-pretend text-[#B1B1B1] text-[16px] py-2 hover:bg-orange-2 rounded px-2 no-underline"
        >
          보관한 문제
        </RouterLink>
        <RouterLink
          to="/my-problem-sets"
          class="block font-pretend text-[#B1B1B1] text-[16px] py-2 hover:bg-orange-2 rounded px-2 no-underline mt-[8px]"
        >
          보관한 문제집
        </RouterLink>
      </div>

      <!-- Board 섹션 -->
      <div class="mb-[24px]">
        <div class="text-[#4F4F4F] text-[14px] mb-[8px] font-pretend font-bold">
          BOARD
        </div>
        <RouterLink
          to="/problem-board"
          class="block font-pretend text-[#B1B1B1] text-[16px] py-2 hover:bg-orange-2 rounded px-2 no-underline"
        >
          문제 게시판
        </RouterLink>
        <RouterLink
          to="/problem-set-board"
          class="block font-pretend text-[#B1B1B1] text-[16px] py-2 hover:bg-orange-2 rounded px-2 no-underline mt-[8px]"
        >
          문제집 게시판
        </RouterLink>
      </div>

      <!-- Test 섹션 -->
      <div>
        <div class="text-[#4F4F4F] text-[14px] mb-[8px] font-pretend font-bold">
          TEST
        </div>
        <RouterLink
          to="/exam-room"
          class="block font-pretend text-[#B1B1B1] text-[16px] py-2 hover:bg-orange-2 rounded px-2 no-underline"
        >
          내 시험장
        </RouterLink>
        <RouterLink
          to="/exam-history"
          class="block font-pretend text-[#B1B1B1] text-[16px] py-2 hover:bg-orange-2 rounded px-2 no-underline mt-[8px]"
        >
          시험 내역
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>
