<script setup>
import calendarIcon from "@/assets/icons/exam-room/fi-rr-calendar.svg";
import userIcon from "@/assets/icons/exam-room/fi-rr-user.svg";
import folderIcon from "@/assets/icons/exam-room/fi-rr-folder.svg";
import timeFastIcon from "@/assets/icons/exam-room/fi-rr-time-fast.svg";
import pencilIcon from "@/assets/icons/exam-room/fi-rr-pencil.svg";
import trashIcon from "@/assets/icons/exam-room/fi-rr-trash.svg";

defineProps({
  title: {
    default: '기본 시험'
  },
  participants: {
    default: 2
  },
  category: {
    default: '정보처리기사 문제집'
  },
  examDate: {
    default: '2025.01.18 15:00'
  },
  duration: {
    default: '1시간'
  },
  questionCount: {
    default: 40
  }
})
</script>

<template>
  <div class="bg-orange-3 rounded-lg p-4 w-full text-gray-2">
    <div class="item-between mb-4" aria-label="title-wrapper">
      <h3 class=" font-medium text-lg">{{ title }}</h3>
      <div class="item-middle">
        <button
          class="hover:bg-black-1/10 transition w-8 h-8 rounded-full flex justify-center items-center box-border"
        >
          <img :src="pencilIcon" alt="시험 수정" class="w-4 h-4" />
        </button>
        <button
          class="hover:bg-black-1/10 transition w-8 h-8 rounded-full flex justify-center items-center box-border"
        >
          <img :src="trashIcon" alt="시험 삭제" class="w-4 h-4" />
        </button>
      </div>
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
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <img :src="timeFastIcon" alt="time icon" class="w-3 h-3" />
        <span class=" text-sm">{{ duration }} 소요</span>
      </div>
      <span class="font-semibold">{{ questionCount }}문제</span>
    </div>
  </div>
</template>

<style scoped>
* {
  color: #4f4f4f;
}
</style>