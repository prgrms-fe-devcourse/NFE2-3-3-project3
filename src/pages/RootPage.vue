<script setup></script>

<template>
  <div class="p-6 space-y-6">
    <section
      class="bg-gray-100 shadow-md rounded-md p-4 flex flex-col sm:flex-row justify-between items-center"
    >
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div>
          <h2 class="text-lg font-semibold text-gray-700">
            사용자의 현재 등급
          </h2>
        </div>
      </div>
      <div class="mt-4 sm:mt-0 grid grid-cols-2 gap-4">
        <div>
          <p class="text-gray-500">현재 권한</p>
          <p class="bg-gray-200 p-2 rounded">내용</p>
        </div>
        <div>
          <p class="text-gray-500">다음 권한</p>
          <p class="bg-gray-200 p-2 rounded">내용</p>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        class="bg-gray-100 shadow-md rounded-md p-4 flex flex-col items-center"
      >
        <div class="w-16 h-16 bg-gray-300 rounded mb-2"></div>
        <h3 class="text-lg font-semibold text-gray-700">문제 만들기</h3>
        <p class="text-sm text-gray-500 mt-2">상세 내용</p>
      </div>
      <div
        class="bg-gray-100 shadow-md rounded-md p-4 flex flex-col items-center"
      >
        <div class="w-16 h-16 bg-gray-300 rounded mb-2"></div>
        <h3 class="text-lg font-semibold text-gray-700">시험장 입실</h3>
        <p class="text-sm text-gray-500 mt-2">상세 내용</p>
      </div>
      <div
        class="bg-gray-100 shadow-md rounded-md p-4 flex flex-col items-center"
      >
        <div class="w-16 h-16 bg-gray-300 rounded mb-2"></div>
        <h3 class="text-lg font-semibold text-gray-700">다시 볼 문제</h3>
        <p class="text-sm text-gray-500 mt-2">상세 내용</p>
      </div>
    </section>

    <section
      class="bg-gray-100 shadow-md rounded-md p-4 flex justify-between items-center"
    >
      <div class="text-gray-700">포인트 및 등급 변경 시</div>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        포인트 사용
      </button>
    </section>
  </div>
</template>

<style scoped></style>
