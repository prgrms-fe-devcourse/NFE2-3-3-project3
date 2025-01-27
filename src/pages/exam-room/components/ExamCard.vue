<script setup>
import calendarIcon from "@/assets/icons/exam-room/fi-rr-calendar.svg";
import userIcon from "@/assets/icons/exam-room/fi-rr-user.svg";
import folderIcon from "@/assets/icons/exam-room/fi-rr-folder.svg";
import timeFastIcon from "@/assets/icons/exam-room/fi-rr-time-fast.svg";
import pencilIcon from "@/assets/icons/exam-room/fi-rr-pencil.svg";
import trashIcon from "@/assets/icons/exam-room/fi-rr-trash.svg";
import { computed } from "vue";
import { formatterIntlKR } from "@/utils/formatterIntlKR.js";
import { formatMsToHourMinute } from "@/utils/formatMsToHour";
import { ref, watchEffect } from "vue";
import { inviteAPI } from "@/api/invite";
import { useConfirm } from "primevue/useconfirm";
import { testCenterAPI } from "@/api/testCenter";
import { useToast } from "primevue/usetoast";
import { workbookAPI } from "@/api/workbook";

const emit = defineEmits(["delete-exam"]);
const toast = useToast();

const props = defineProps({
  id: Number, // 테스트센터 아이디
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
  workbook: Object,
  showEditButtons: Boolean,
});

const confirm = useConfirm();
const isProcessing = ref(false);
const participantCount = ref(0);
const problemCount = ref(0);

const handleDelete = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;
  try {
    await testCenterAPI.deleteTestCenter(props.id);
    toast.add({
      severity: 'success', 
      summary: '삭제 완료',
      detail: '시험이 삭제되었습니다.',
      life: 3000
    });
    emit('delete-exam');
  } catch (error) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: '삭제 실패', 
      detail: '삭제 요청 처리 중 오류가 발생했습니다.',
      life: 3000
    });
  } finally {
    isProcessing.value = false;
  }
};

const confirmDelete = () => {
  confirm.require({
    message: "정말 이 시험을 삭제하시겠습니까?",
    header: "시험 삭제 확인",
    icon: "pi pi-exclamation-triangle",
    accept: handleDelete,
  });
};

const examDuration = computed(() => {
  if (!props.start_date || !props.end_date) return "";
  const diff = new Date(props.end_date) - new Date(props.start_date);
  return formatMsToHourMinute(diff);
});

const formattedDate = computed(() => {
  if (!props.start_date) return "";
  return formatterIntlKR.format(new Date(props.start_date));
});

const fetchProblemCount = async () => {
  console.log('fetchProblemCount 함수 실행됨');
  try {
    // API 호출 전
    // console.log('API 호출 시작:', props.workbook_id);
    problemCount.value = await workbookAPI.getWorkbookProblemCount(props.workbook_id);
    // API 호출 후
    // console.log('받아온 문제 수:', problemCount.value);
  } catch (error) {
    console.error("문제 수를 가져오는 데 실패했습니다:", error);
  }
};

watchEffect(async () => {
 if (props.id && props.workbook_id) {
  //  console.log('watchEffect 실행:', { id: props.id, workbook_id: props.workbook_id });
   participantCount.value = await inviteAPI.getParticipantCount(props.id);
   await fetchProblemCount();
 }
});
</script>

<template>
  <div class="bg-orange-3 rounded-lg p-4 w-full text-gray-2">
    <div class="item-between mb-4">
      <!-- 문제집 이름 -->
      <h3
        class="font-medium text-lg line-clamp-1"
        v-tooltip.top="workbook?.title"
      >
        {{ workbook?.title }}
      </h3>
      <!-- 수정 및 삭제 버튼 -->
      <div v-if="showEditButtons" class="flex gap-2">
        <button
          class="flex items-center justify-center w-8 h-8 bg-black-1/5 rounded-full hover:bg-black-1/10"
          @click="confirmDelete"
        >
          <img :src="trashIcon" alt="delete icon" class="w-4 h-4" />
        </button>
      </div>
    </div>
    <ul class="flex flex-col gap-2">
      <!-- 응시자 표시 -->
      <li class="flex items-center gap-2 text-sm">
        <img :src="userIcon" alt="user icon" class="w-3 h-3" />
        <span>{{ participantCount + 1 }}명</span>
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
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.p-confirm-dialog .p-confirm-dialog-accept,
.p-confirm-dialog .p-confirm-dialog-reject {
  padding: 0.5rem 1.5rem !important;
  border: none;
}
</style>
