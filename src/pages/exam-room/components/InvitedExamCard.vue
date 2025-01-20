<script setup>
import calendarIcon from "@/assets/icons/exam-room/fi-rr-calendar.svg";
import userIcon from "@/assets/icons/exam-room/fi-rr-user.svg";
import folderIcon from "@/assets/icons/exam-room/fi-rr-folder.svg";
import timeFastIcon from "@/assets/icons/exam-room/fi-rr-time-fast.svg";
import Button from "primevue/button";

defineProps({
  title: {
    default: "기본 초대된 시험",
  },
  participants: {
    default: "닉네임",
  },
  category: {
    default: "정보처리기사 문제집",
  },
  examDate: {
    default: "2025.01.18 15:00",
  },
  duration: {
    default: "1시간 20분",
  },
});
</script>

<template>
  <div class="bg-orange-3 rounded-lg p-4 w-full text-gray-2">
    <div class="item-between" aria-label="title-wrapper">
      <h3 class="mb-4 font-medium text-lg">{{ title }}</h3>
    </div>
    <div class="flex items-center gap-2 mb-2 text-sm">
      <img :src="userIcon" alt="user icon" class="w-3 h-3" />
      <span>{{ participants }}명</span>
    </div>
    <div class="flex items-center gap-2 mb-2 text-sm">
      <img :src="folderIcon" alt="folder icon" class="w-3 h-3" />
      <span>{{ category }}</span>
    </div>
    <div class="flex items-center gap-2 mb-2 text-sm">
      <img :src="calendarIcon" alt="calendar icon" class="w-3 h-3" />
      <span>{{ examDate }}</span>
    </div>
    <div class="flex items-center gap-2 mb-4 text-sm">
      <img :src="timeFastIcon" alt="time icon" class="w-3 h-3" />
      <span>{{ duration }} 소요</span>
    </div>

    <div class="card item-between gap-2">
      <button
        class="bg-white text-gray-600 p-2 rounded-lg font-medium hover:bg-gray-50 w-1/2 flex justify-center items-center"
      >
        승인
      </button>
      <button
        class="bg-red-500 text-white p-2 rounded-lg font-medium hover:bg-red-600 w-1/2 flex justify-center items-center"
      >
        거절
      </button>
    </div>
  </div>
</template>

<style scoped>
* {
  color: #4f4f4f;
}

.text-white {
  color: white;
}
</style>
