<script setup>
import calendarIcon from "@/assets/icons/exam-room/fi-rr-calendar.svg";
import userIcon from "@/assets/icons/exam-room/fi-rr-user.svg";
import folderIcon from "@/assets/icons/exam-room/fi-rr-folder.svg";
import timeFastIcon from "@/assets/icons/exam-room/fi-rr-time-fast.svg";
import { ref } from "vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
  participants: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  examDate: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

const isProcessing = ref(false);

const handleAccept = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;
  try {
    await inviteAPI.accept(userId, id);
    alert("시험에 참여 승인되었습니다.");
  } catch (error) {
    console.error(error);
    alert("승인 요청 처리 중 오류가 발생했습니다.");
  } finally {
    isProcessing.value = false;
  }
};

const handleDeny = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;
  try {
    await inviteAPI.deny(id);
    alert("시험 초대를 거절했습니다.");
  } catch (error) {
    console.error(error);
    alert("거절 요청 처리 중 오류가 발생했습니다.");
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="bg-orange-3 rounded-lg p-4 w-full text-gray-2">
    <div class="item-between" aria-label="title-wrapper">
      <h3 class="mb-4 font-medium text-lg">{{ title }}</h3>
    </div>
    <div class="flex items-center gap-2 mb-2 text-sm">
      <img :src="userIcon" alt="user icon" class="w-3 h-3" />
      <span>{{ participants }}</span>
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
        @click="handleAccept"
        :disabled="isProcessing"
        class="bg-white text-gray-600 px-2 py-1 rounded-md font-medium hover:bg-gray-50 w-1/2 flex justify-center items-center"
      >
        승인
      </button>
      <button
        @click="handleDeny"
        :disabled="isProcessing"
        class="bg-red-500 text-white px-2 py-1 rounded-md font-medium hover:bg-red-600 w-1/2 flex justify-center items-center"
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
