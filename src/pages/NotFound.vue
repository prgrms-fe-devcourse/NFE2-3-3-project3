<script setup>
import backgroundImg from "@/assets/images/404background.svg";
import Text from "@/assets/images/404text.svg";
</script>
<template>
  <div class="relative h-screen">
    <div
      class="absolute inset-0 bg-center bg-no-repeat bg-cover"
      :style="{ backgroundImage: `url(${backgroundImg})` }"
    ></div>
    <!-- 중앙에서 왼쪽 정렬 -->
    <!-- 이미지 -->
    <div class="flex items-center justify-end w-1/2 h-full">
      <!-- 검정색 투명도 50% 오버레이 -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <!-- 404 에러 문구 -->
      <div class="flex flex-col gap-[50px] relative z-10">
        <div class="flex flex-col items-end">
          <img :src="Text" alt="404text" class="w-[358px] h-[180px]" />
          <span class="text-white01 text-[65px] font-sigmar">NOT FOUND</span>
        </div>

        <div class="flex flex-col gap-[25px] items-end">
          <div class="flex flex-col items-end text-2xl text-white">
            <span>여기는 파울존입니다.</span>
            <span>페이지를 찾을 수 없습니다.</span>
          </div>
          <RouterLink
            to="/"
            class="p-5 bg-white01 rounded-[10px] font-sigmar text-[26px]"
          >
            Go To HOME
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
