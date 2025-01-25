<script setup>
import calendarIcon from "@/assets/icons/exam-room/fi-rr-calendar.svg";
import userIcon from "@/assets/icons/exam-room/fi-rr-user.svg";
import folderIcon from "@/assets/icons/exam-room/fi-rr-folder.svg";
import timeFastIcon from "@/assets/icons/exam-room/fi-rr-time-fast.svg";
import { ref, computed, watchEffect } from "vue";
import { inviteAPI } from "@/api/invite";
import { workbookAPI } from "@/api/workbook";
import { userAPI } from "@/api/user";
import { authAPI } from "@/api/auth";
import { formatMsToHourMinute } from "@/utils/formatMsToHour";
import { formatToKoreanDateTime } from "@/utils/formatToKoreanDateTime";

const props = defineProps({
 inviteData: {
   type: Object,
   required: true,
 },
 testCenter: {
   type: Object, 
   required: true,
 },
});

const isProcessing = ref(false);
const workbookTitle = ref("");
const workbookDescription = ref("");
const userName = ref("");
const userId = ref(null);

const examDuration = computed(() => {
 if (!props.testCenter.start_date || !props.testCenter.end_date) return "";
 const diff = new Date(props.testCenter.end_date) - new Date(props.testCenter.start_date);
 return formatMsToHourMinute(diff);
});

const formattedDate = computed(() => {
 return formatToKoreanDateTime(props.testCenter.start_date);
});

const fetchWorkbookTitle = async () => {
 try {
   const workbook = await workbookAPI.getOne(props.testCenter.workbook_id);
   if (workbook) {
     workbookTitle.value = workbook.title;
     workbookDescription.value = workbook.description;
   } else {
     console.error("Workbook not found");
   }
 } catch (error) {
   console.error("문제집 제목을 가져오는 중 오류 발생:", error);
 }
};

const fetchUserName = async () => {
 try {
   const user = await userAPI.getOne(props.testCenter.uid);
   if (user) {
     userName.value = user.name;
   } else {
     console.error("User not found");
   }
 } catch (error) {
   console.error("사용자 이름을 가져오는 중 오류 발생:", error);
 }
};

const fetchCurrentUserId = async () => {
 try {
   const currentUser = await authAPI.getCurrentUser();
   if (currentUser) {
     userId.value = currentUser.id;
   } else {
     console.error("Current user not found");
   }
 } catch (error) {
   console.error("현재 사용자 정보를 가져오는 중 오류 발생:", error);
 }
};

const handleAccept = async () => {
 if (isProcessing.value || !userId.value) return;
 isProcessing.value = true;
 try {
   await inviteAPI.accept(userId.value, props.inviteData.id);
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
   await inviteAPI.deny(props.inviteData.id);
   alert("시험 초대를 거절했습니다.");
 } catch (error) {
   console.error(error);
   alert("거절 요청 처리 중 오류가 발생했습니다.");
 } finally {
   isProcessing.value = false;
 }
};

watchEffect(() => {
 fetchWorkbookTitle();
 fetchUserName();
 fetchCurrentUserId();
});
</script>

<template>
 <div class="bg-orange-3 rounded-lg p-4 w-full text-gray-2">
   <div class="item-between" aria-label="title-wrapper">
     <h3 class="mb-4 font-medium text-lg">{{ workbookTitle }}</h3>
   </div>
   <div class="flex items-center gap-2 mb-2 text-sm">
     <img :src="userIcon" alt="user icon" class="w-3 h-3" />
     <span>{{ userName }}</span>
   </div>
   <div class="flex items-center gap-2 mb-2 text-sm">
     <img :src="folderIcon" alt="folder icon" class="w-3 h-3" />
     <span>{{ workbookDescription }}</span>
   </div>
   <div class="flex items-center gap-2 mb-2 text-sm">
     <img :src="calendarIcon" alt="calendar icon" class="w-3 h-3" />
     <span>{{ formattedDate }}</span>
   </div>
   <div class="flex items-center gap-2 mb-4 text-sm">
     <img :src="timeFastIcon" alt="time icon" class="w-3 h-3" />
     <span>{{ examDuration }} 소요</span>
   </div>

   <div v-if="!props.inviteData.participate" class="flex gap-2">
     <button
       @click="handleAccept"
       class="bg-black-1/10 text-white px-2 py-1 rounded-md font-medium hover:bg-black-1/20 w-1/2 flex justify-center items-center"
     >
       승인
     </button>
     <button
       @click="handleDeny"
       class="bg-red-500/60 deny text-white px-2 py-1 rounded-md font-medium hover:bg-red-600/60 w-1/2 flex justify-center items-center"
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

.deny {
 color: white;
}
</style>