<script setup>
import { RouterLink } from "vue-router";
const logoPath = new URL("@/assets/logos/logo.svg", import.meta.url).href;
</script>

<template>
  <aside class="w-[240px] bg-beige-2 h-full flex flex-col relative top-0 z-50 items-center py-6">
    <!-- 로고 -->
    <RouterLink to="/home" class="mb-6">
      <img :src="logoPath" alt="Pullgo" class="w-auto h-auto" />
    </RouterLink>

    <!-- 버튼 -->
    <button
      class="bg-orange-1 text-white text-lg border-none px-6 py-2.5 rounded-lg hover:bg-orange-hover cursor-pointer mb-[24px]"
    >
      새로운 문제 만들기
    </button>

    <!-- 내비게이션 -->
    <nav class="w-full px-6">
      <!-- Library 섹션 -->
      <div class="mb-[24px]">
        <div class="text-[#4F4F4F] text-sm px-2 mb-2 font-bold">
          LIBRARY
        </div>
        <RouterLink
          to="/my-problems"
          class="block text-[#B1B1B1] py-1 hover:bg-beige-1 px-2 rounded"
        >
          보관한 문제
        </RouterLink>
        <RouterLink
          to="/my-problem-sets"
          class="block text-[#B1B1B1] py-1 hover:bg-beige-1 px-2 rounded mt-[8px]"
        >
          보관한 문제집
        </RouterLink>
      </div>

      <!-- Board 섹션 -->
      <div class="mb-[24px]">
        <div class="text-[#4F4F4F] text-sm px-2 mb-2 font-bold">
          BOARD
        </div>
        <RouterLink
          to="/problem-board"
          class="block text-[#B1B1B1] py-1 hover:bg-beige-1 px-2 rounded"
        >
          문제 게시판
        </RouterLink>
        <RouterLink
          to="/problem-set-board"
          class="block text-[#B1B1B1] py-1 hover:bg-beige-1 px-2 rounded mt-[8px]"
        >
          문제집 게시판
        </RouterLink>
      </div>

      <!-- Test 섹션 -->
      <div>
        <div class="text-[#4F4F4F] text-sm px-2 mb-2 font-bold">
          TEST
        </div>
        <RouterLink
          to="/exam-room"
          class="block text-[#B1B1B1] py-1 hover:bg-beige-1 px-2 rounded"
        >
          내 시험장
        </RouterLink>
        <RouterLink
          to="/exam-history"
          class="block text-[#B1B1B1] py-1 hover:bg-beige-1 px-2 rounded mt-[8px]"
        >
          시험 내역
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>
