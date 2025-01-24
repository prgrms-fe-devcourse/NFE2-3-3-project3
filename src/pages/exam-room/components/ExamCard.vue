<script setup>
import calendarIcon from "@/assets/icons/exam-room/fi-rr-calendar.svg";
import userIcon from "@/assets/icons/exam-room/fi-rr-user.svg";
import folderIcon from "@/assets/icons/exam-room/fi-rr-folder.svg";
import timeFastIcon from "@/assets/icons/exam-room/fi-rr-time-fast.svg";
import pencilIcon from "@/assets/icons/exam-room/fi-rr-pencil.svg";
import trashIcon from "@/assets/icons/exam-room/fi-rr-trash.svg";
import { computed } from "vue";

const props = defineProps({
  id: Number,
  workbook_id: Number,
  workbook: {
    type: Object,
    required: true,
  },
  start_date: String,
  end_date: String,
  showEditButtons: {
    type: Boolean,
    default: false,
  },
});

const examDuration = computed(() => {
  if (!props.start_date || !props.end_date) return "";
  const diff = new Date(props.end_date) - new Date(props.start_date);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}시간 ${minutes}분`;
});

const formattedDate = computed(() => {
  return props.start_date
    ? new Date(props.start_date).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
});

const problemCount = computed(() => {
  return props.workbook?.workbook_problem?.[0]?.count ?? 0;
});
</script>

<template>
  <div class="bg-orange-3 rounded-lg p-4 w-full text-gray-2">
    <div class="item-between mb-4">
      <!-- 문제집 이름 -->
      <h3 class="font-medium text-lg line-clamp-1" v-tooltip.top="workbook?.title">{{ workbook?.title }}</h3>
      <!-- 수정 및 삭제 버튼 -->
      <div v-if="showEditButtons" class="flex gap-2">
        <button class="flex items-center justify-center w-8 h-8 bg-black-1/5 rounded-full hover:bg-black-1/10">
          <img :src="pencilIcon" alt="edit icon" class="w-4 h-4" />
        </button>
        <button class="flex items-center justify-center w-8 h-8 bg-black-1/5 rounded-full hover:bg-black-1/10">
          <img :src="trashIcon" alt="delete icon" class="w-4 h-4" />
        </button>
      </div>
    </div>
    <ul class="flex flex-col gap-2">
      <!-- 응시자 표시 -->
      <li class="flex items-center gap-2 text-sm">
        <img :src="userIcon" alt="user icon" class="w-3 h-3" />
        <span>{{ (confirmed_count?.[0]?.count || 0) + 1 }}명</span>
      </li>
      <!-- 시작 시간 -->
      <li class="flex items-center gap-2 text-sm">
        <img :src="calendarIcon" alt="calendar icon" class="w-3 h-3" />
        <span>{{ formattedDate }}</span>
      </li>
      <!-- 소요 시간 -->
      <li class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-sm">
          <img :src="timeFastIcon" alt="time icon" class="w-3 h-3" />
          <span>{{ examDuration }} 소요</span>
        </div>
        <!-- 문제 갯수 -->
        <span class="font-semibold">{{ problemCount }}문제</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
* {
  color: #4f4f4f;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>