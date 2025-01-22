<script setup>
import { RouterLink } from "vue-router";
import ExampleProfileImg from "@/assets/harp seal.jpg";
import Profile from "@/components/layout/Profile.vue";
import Grade from "@/components/layout/Grade.vue";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
const alertPath = new URL("@/assets/icons/alert.svg", import.meta.url).href;
const pointPath = new URL("@/assets/icons/point.svg", import.meta.url).href;

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const click = async () => {
  await authStore.loginWithGoogle();
};
</script>

<template>
  <div class="flex flex-col w-full">
    <h1 @click="click" class="text-5xl font-laundry text-left pb-24">
      {{ user?.user_metadata.full_name }}님, 다시 만나 반가워요!
    </h1>
    <div class="flex items-center justify-between w-full h-[226px] gap-4">
      <!-- 프로필 카드 -->
      <Profile />

      <!-- 등급 카드 -->
      <Grade />
    </div>
  </div>

  <!-- 하단 래핑 박스 -->
  <div class="flex flex-col gap-2 mx-auto pt-24">
    <h2 class="text-xl font-semibold text-left font-pretend w-full">
      공부하러 가기
    </h2>
    <div class="grid grid-cols-3 gap-6 w-full pt-[16px]">
      <!-- 카드 1 -->
      <RouterLink
        to="/problem-editor"
        class="bg-beige-2 rounded-lg p-6 flex flex-col justify-between h-[261px]"
      >
        <p
          class="text-xl font-semibold mb-4 font-pretend text-left text-gray-2"
        >
          문제 생성하기
        </p>
        <p class="text-gray-1 text-sm font-pretend text-left">
          새로운 문제를 만들고, 문제집에 추가하세요.
        </p>
      </RouterLink>

      <!-- 카드 2 -->
      <RouterLink
        to="/exam-room"
        class="bg-beige-2 rounded-lg p-6 flex flex-col justify-between h-[261px]"
      >
        <p
          class="font-semibold mb-4 font-pretend text-left text-xl text-gray-2"
        >
          시험장 입실
        </p>
        <p class="text-gray-1 text-sm font-pretend text-left">
          친구들과 함께 시험을 보고 결과를 공유하세요.
        </p>
      </RouterLink>

      <!-- 카드 3 -->
      <RouterLink
        to="/my-problems"
        class="bg-beige-2 rounded-lg p-6 flex flex-col justify-between h-[261px]"
      >
        <p
          class="font-semibold mb-4 font-pretend text-left text-xl text-gray-2"
        >
          다시 볼 문제
        </p>
        <p class="text-gray-1 text-sm font-pretend text-left">
          틀렸거나, 다시 보고 싶은 문제를 다시 한번 공부해보세요.
        </p>
      </RouterLink>
    </div>
  </div>
</template>
