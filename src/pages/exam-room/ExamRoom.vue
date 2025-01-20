<script setup>
import { ref, computed } from "vue";
import ExamCard from "@/pages/exam-room/components/ExamCard.vue";
import InvitedExamCard from "./components/InvitedExamCard.vue";

// 시험 데이터 (나중에 API로 대체)
const myExams = ref([
  {
    id: 1,
    title: "기본 시험",
    participants: 2,
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간",
    questionCount: 40,
  },
  {
    id: 1,
    title: "기본 시험",
    participants: 2,
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간",
    questionCount: 40,
  },
  {
    id: 1,
    title: "기본 시험",
    participants: 2,
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간",
    questionCount: 40,
  },
  {
    id: 1,
    title: "기본 시험",
    participants: 2,
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간",
    questionCount: 40,
  },
  {
    id: 1,
    title: "기본 시험",
    participants: 2,
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간",
    questionCount: 40,
  },
  {
    id: 1,
    title: "기본 시험",
    participants: 2,
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간",
    questionCount: 40,
  },
  {
    id: 1,
    title: "기본 시험",
    participants: 2,
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간",
    questionCount: 40,
  },
  {
    id: 1,
    title: "기본 시험",
    participants: 2,
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간",
    questionCount: 40,
  },
]);

const invitedExams = ref([
  {
    id: 1,
    title: "기본 초대된 시험",
    participants: "닉네임",
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간 20분",
  },
  {
    id: 1,
    title: "기본 초대된 시험",
    participants: "닉네임",
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간 20분",
  },
  {
    id: 1,
    title: "기본 초대된 시험",
    participants: "닉네임",
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간 20분",
  },
  {
    id: 1,
    title: "기본 초대된 시험",
    participants: "닉네임",
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간 20분",
  },
  {
    id: 1,
    title: "기본 초대된 시험",
    participants: "닉네임",
    category: "정보처리기사 문제집",
    examDate: "2025.01.18 15:00",
    duration: "1시간 20분",
  },
]);

// 각 섹션별 표시 개수 관리
const myExamsDisplayCount = ref(4);
const invitedExamsDisplayCount = ref(4);
const isMyExamsExpanded = ref(false);
const isInvitedExamsExpanded = ref(false);

// 내가 만든 시험 더보기/접기 토글
const toggleMyExamsDisplay = () => {
  isMyExamsExpanded.value = !isMyExamsExpanded.value;
  myExamsDisplayCount.value = isMyExamsExpanded.value
    ? myExams.value.length
    : 4;
};

// 초대된 시험 더보기/접기 토글
const toggleInvitedExamsDisplay = () => {
  isInvitedExamsExpanded.value = !isInvitedExamsExpanded.value;
  invitedExamsDisplayCount.value = isInvitedExamsExpanded.value
    ? invitedExams.value.length
    : 4;
};

// 현재 표시되는 시험 목록
const visibleMyExams = computed(() => {
  return myExams.value.slice(0, myExamsDisplayCount.value);
});

const visibleInvitedExams = computed(() => {
  return invitedExams.value.slice(0, invitedExamsDisplayCount.value);
});

// 각 섹션의 더보기 버튼 표시 여부
const showMyExamsMoreButton = computed(() => {
  return myExams.value.length > 4;
});

const showInvitedExamsMoreButton = computed(() => {
  return invitedExams.value.length > 4;
});
</script>

<template>
  <div class="w-full">
    <h1 class="font-laundry mb-16 text-5xl font-medium">내 시험장</h1>

    <!-- 내가 만든 시험 섹션 -->
    <div class="mb-8 w-full">
      <div class="item-between w-full">
        <h2 class="text-gray-2 font-medium text-xl mb-4">내가 만든 시험</h2>
        <!-- 더보기/접기 버튼 -->
        <button
          v-if="showMyExamsMoreButton"
          @click="toggleMyExamsDisplay"
          class="px-3 py-2 text-gray-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {{ isMyExamsExpanded ? "접기" : "더보기" }}
        </button>
      </div>
      <ul class="flex flex-wrap gap-6">
        <li
          v-for="exam in visibleMyExams"
          :key="exam.id"
          class="basis-[calc(25%-1.2rem)]"
        >
          <ExamCard v-bind="exam" />
        </li>
      </ul>
    </div>

    <!-- 초대된 시험 섹션 -->
    <div class="mb-8 w-full">
      <div class="item-between w-full">
        <h2 class="text-gray-2 font-medium text-xl mb-4">초대된 시험</h2>
        <!-- 더보기/접기 버튼 -->
        <button
          v-if="showInvitedExamsMoreButton"
          @click="toggleInvitedExamsDisplay"
          class="px-3 py-2 text-gray-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {{ isInvitedExamsExpanded ? "접기" : "더보기" }}
        </button>
      </div>
      <ul class="flex flex-wrap gap-6">
        <li
          v-for="exam in visibleInvitedExams"
          :key="exam.id"
          class="basis-[calc(25%-1.2rem)]"
        >
          <InvitedExamCard v-bind="exam" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  box-sizing: border-box;
}
</style>
