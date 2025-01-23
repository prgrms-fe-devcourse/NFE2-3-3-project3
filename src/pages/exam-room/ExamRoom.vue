<script setup>
import { ref, computed, watchEffect } from "vue";
import ExamCard from "@/pages/exam-room/components/ExamCard.vue";
import InvitedExamCard from "./components/InvitedExamCard.vue";
import createIcon from "@/assets/icons/exam-room/edit_square.svg";
import { RouterLink } from "vue-router";
import { testCenterAPI } from "@/api/testCenter";
import { useAuthStore } from "@/store/authStore";
import { inviteAPI } from "@/api/invite";

const authStore = useAuthStore();
const ongoingExams = ref([]);
const myExams = ref([]);
const invitedExams = ref([]);

// 각 섹션별 표시 개수 관리를 분리
const ongoingExamsDisplayCount = ref(4);
const myExamsDisplayCount = ref(4);
const invitedExamsDisplayCount = ref(4);

const isOngoingExamsExpanded = ref(false);
const isMyExamsExpanded = ref(false);
const isInvitedExamsExpanded = ref(false);

// 진행중인 시험 더보기/접기 토글
const toggleOngoingExamsDisplay = () => {
  isOngoingExamsExpanded.value = !isOngoingExamsExpanded.value;
  ongoingExamsDisplayCount.value = isOngoingExamsExpanded.value
    ? ongoingExams.value.length
    : 4;
};

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

const visibleOngoingExams = computed(() => {
  return ongoingExams.value.slice(0, ongoingExamsDisplayCount.value);
});

// 현재 표시되는 내가 만든 시험 목록
const visibleMyExams = computed(() => {
  return myExams.value.slice(0, myExamsDisplayCount.value);
});

// 현재 표시되는 초대된 시험 목록
const visibleInvitedExams = computed(() => {
  return invitedExams.value.slice(0, invitedExamsDisplayCount.value);
});

// 진행중인 시험 더보기 버튼 표시 여부
const showOngoingExamsMoreButton = computed(() => {
  return ongoingExams.value.length > 4;
});

// 내가 만든 시험의 더보기 버튼 표시 여부
const showMyExamsMoreButton = computed(() => {
  return myExams.value.length > 4;
});

// 초대된 시험의 더보기 버튼 표시 여부
const showInvitedExamsMoreButton = computed(() => {
  return invitedExams.value.length > 4;
});

// 데이터 로딩 함수
const fetchExams = async () => {
  if (!authStore.user?.id) return;

  const now = new Date();
  const response = await testCenterAPI.getAllFields(authStore.user.id);

  if (response) {
    // 진행중인 시험 필터링
    ongoingExams.value = response.filter((exam) => {
      const startDate = new Date(exam.start_date);
      const endDate = new Date(exam.end_date);
      return now >= startDate && now <= endDate;
    });

    // 내가 만든 시험 (진행중인 시험 제외)
    const ongoingExamIds = ongoingExams.value.map((exam) => exam.id);
    myExams.value = response.filter(
      (exam) => !ongoingExamIds.includes(exam.id),
    );
  }

  // 초대된 시험 로딩
  const inviteResponse = await inviteAPI.getAll(authStore.user.id);
  if (inviteResponse) {
    invitedExams.value = inviteResponse.filter((invite) => {
      const endDate = new Date(invite.test_center.end_date);
      return !invite.participate && now <= endDate;
    });
  }
};

// 초기 데이터 로딩
watchEffect(fetchExams);
</script>

<template>
  <div class="w-full">
    <h1 class="font-laundry mb-16 text-5xl font-medium">내 시험장</h1>

    <!-- 진행중인 시험 섹션 -->
    <section class="mb-8 w-full">
      <div class="flex items-center gap-2 w-full mb-4">
        <h2 class="text-gray-2 font-medium text-xl">진행중인 시험</h2>
        <!-- 더보기/접기 버튼 -->
        <button
          v-if="showOngoingExamsMoreButton"
          @click="toggleOngoingExamsDisplay"
          class="px-3 py-2 text-gray-3 hover:bg-gray-100 rounded-full transition-colors"
        >
          {{ isOngoingExamsExpanded ? "접기" : "전체보기 +" }}
        </button>
      </div>

      <!-- 조건부 렌더링 -->
      <div
        v-if="ongoingExams.length === 0"
        class="text-gray-500 w-full py-10 item-middle"
      >
        현재 진행중인 시험이 없습니다.
      </div>

      <ul v-else class="flex flex-wrap gap-6">
        <li
          v-for="exam in ongoingExams"
          :key="exam.id"
          class="basis-[calc(25%-1.2rem)]"
        >
          <ExamCard v-bind="exam" />
        </li>
      </ul>
    </section>

    <!-- 내가 만든 시험 섹션 -->
    <section class="mb-8 w-full">
      <div class="flex items-center gap-2 w-full mb-4">
        <h2 class="text-gray-2 font-medium text-xl">내가 만든 시험</h2>
        <!-- 더보기/접기 버튼 -->
        <button
          v-if="showMyExamsMoreButton"
          @click="toggleMyExamsDisplay"
          class="px-3 py-2 text-gray-3 hover:bg-gray-100 rounded-full transition-colors"
        >
          {{ isMyExamsExpanded ? "접기" : "전체보기 +" }}
        </button>
      </div>

      <!-- 조건부 렌더링 -->
      <div
        v-if="myExams.length === 0"
        class="text-gray-500 w-full py-10 item-middle"
      >
        시험장 정보가 없습니다.
      </div>

      <ul v-else class="flex flex-wrap gap-6">
        <li
          v-for="exam in visibleMyExams"
          :key="exam.id"
          class="basis-[calc(25%-1.2rem)]"
        >
          <ExamCard v-bind="exam" />
        </li>
      </ul>
    </section>

    <!-- 초대된 시험 섹션 -->
    <section class="mb-8 w-full">
      <div class="flex items-center gap-2 w-full mb-4">
        <h2 class="text-gray-2 font-medium text-xl">초대된 시험</h2>
        <!-- 더보기/접기 버튼 -->
        <button
          v-if="showInvitedExamsMoreButton"
          @click="toggleInvitedExamsDisplay"
          class="px-3 py-2 text-gray-3 hover:bg-gray-100 rounded-full transition-colors"
        >
          {{ isInvitedExamsExpanded ? "접기" : "전체보기 +" }}
        </button>
      </div>

      <!-- 조건부 렌더링 -->
      <div
        v-if="invitedExams.length === 0"
        class="text-gray-500 w-full py-10 item-middle"
      >
        초대된 시험이 없습니다.
      </div>

      <ul v-else class="flex flex-wrap gap-6">
        <li
          v-for="exam in visibleInvitedExams"
          :key="exam.id"
          class="basis-[calc(25%-1.2rem)]"
        >
          <InvitedExamCard v-bind="exam" />
        </li>
      </ul>
    </section>
  </div>
  <RouterLink
    to="/create-exam-room"
    class="w-16 h-16 rounded-full bg-orange-1 flex justify-center items-center cursor-pointer fixed right-20 bottom-20"
  >
    <img :src="createIcon" alt="새 시험장 만들기" class="w-8 h-8" />
  </RouterLink>
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
