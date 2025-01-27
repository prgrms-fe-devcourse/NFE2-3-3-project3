<script setup>
import close from "@/assets/icons/exam-result/close.svg";

import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// 사용자 정보
const userName = computed(
  () => user.value?.user_metadata?.full_name || "사용자님",
);
const userEmail = computed(() => user.value?.email || "이메일 정보 없음");
const profileImage = computed(
  () => user.value?.user_metadata?.avatar_url || "@/assets/harp seal.jpg",
);

async function initializeAuth() {
  if (!user.value) {
    try {
      await authStore.initializeAuth();
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    }
  }
}

onMounted(() => {
  initializeAuth();
});
</script>
<template>
  <header class="w-full pl-44 pt-20 pb-10 relative">
    <div class="flex items-center gap-8">
      <div class="flex flex-col items-center justify-center space-y-1">
        <img
          :src="profileImage"
          alt="Profile"
          class="rounded-full w-32 h-32 object-cover"
        />
        <span class="font-bold text-base pt-2">{{ userName }}</span>
        <span class="text-sm text-gray-500">{{ userEmail }}</span>
      </div>

      <div class="pb-16 space-y-1">
        <h1 class="text-xl font-bold">정보처리기사 26년 5회</h1>
        <p class="font-laundry text-3xl">시험 결과 리포트</p>
        <p class="text-sm text-gray-500">
          시험 결과 리포트는 지난 시험에서 다시 확인 할 수 있습니다.
        </p>
      </div>
      <div class="absolute right-8 top-8">
        <img :src="close" alt="닫기버튼" />
      </div>
    </div>
  </header>
</template>

<style scoped></style>
