<script setup>
import { RouterLink } from "vue-router";
import { againViewProblem } from '@/api/againViewProblem.js';

const handleCreate = async () => {
  const newData = {
    problem_id: 1,
    uid: '123e4567-e89b-12d3-a456-426614174000' // UUID 형식의 문자열
  };
  
  try {
    const result = await againViewProblem.create(newData);
    console.log('생성 결과:', result);
  } catch (error) {
    console.error('에러:', error);
  }
};
</script>

<template>
  <aside class="w-full lg:w-64 bg-gray-200 h-auto lg:h-full">
    <RouterLink
      to="/"
      class="p-6 text-xl font-bold text-gray-700 text-center inline-block no-underline"
    >
      LOGO
    </RouterLink>

    <div class="flex justify-center my-4">
      <button
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 border-none"
        @click="handleCreate"
      >
        문제 만들기 +
      </button>
    </div>
    <nav>
      <div class="px-4 font-bold text-gray-700 uppercase text-sm">MY</div>
      <div class="mt-2 space-y-2">
        <RouterLink
          to="/my-problems"
          class="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded no-underline"
        >
          내 문제 목록
        </RouterLink>
        <RouterLink
          to="/my-problem-sets"
          class="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded no-underline"
        >
          내 문제집
        </RouterLink>
        <RouterLink
          to="/my-custom-problems"
          class="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded no-underline"
        >
          내 문제
        </RouterLink>
      </div>
      <div class="px-4 mt-6 font-bold text-gray-700 uppercase text-sm">
        게시판
      </div>
      <div class="mt-2 space-y-2">
        <RouterLink
          to="/problem-board"
          class="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded no-underline"
        >
          문제 게시판
        </RouterLink>
        <RouterLink
          to="/problem-set-board"
          class="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded no-underline"
        >
          문제집 게시판
        </RouterLink>
        <RouterLink
          to="/review-board"
          class="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded no-underline"
        >
          다시 볼 문제
        </RouterLink>
        <RouterLink
          to="/exam-room"
          class="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded no-underline"
        >
          내 시험장
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>
