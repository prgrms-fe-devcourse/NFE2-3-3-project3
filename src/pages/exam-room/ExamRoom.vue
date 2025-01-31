<script setup>
import { ref, computed, watchEffect } from "vue";
import ExamCard from "@/pages/exam-room/components/ExamCard.vue";
import InvitedExamCard from "./components/InvitedExamCard.vue";
import createIcon from "@/assets/icons/exam-room/edit_square.svg";
import { RouterLink, useRouter } from "vue-router";
import { testCenterAPI } from "@/api/testCenter";
import { useAuthStore } from "@/store/authStore";
import { inviteAPI } from "@/api/invite";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";

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

const confirm = useConfirm();

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

// visibleMyExams 값 확인
// watchEffect(() => {
//   console.log("visibleMyExams(내가 만든 시험)", visibleMyExams.value);
// });

// 현재 표시되는 초대된 시험 목록
const visibleInvitedExams = computed(() => {
  return invitedExams.value.slice(0, invitedExamsDisplayCount.value);
});

// visibleInvitedExams 값 확인
// watchEffect(() => {
//   console.log("visibleInvitedExams (초대된 시험)",visibleInvitedExams.value);
// });

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

const fetchExams = async () => {
  if (!authStore.user?.id) return;

  const now = new Date();
  try {
    // 1. 내가 만든 시험장 목록
    const testCenterResponse = await testCenterAPI.getAllFields(
      authStore.user.id,
    );

    // 2. 초대받은 시험장 중 수락한 목록
    const inviteResponse = await inviteAPI.getAll(authStore.user.id);
    const acceptedInvites =
      inviteResponse?.filter((invite) => invite.participate) || [];

    // 두 목록 합치기
    const allExams = [
      ...(testCenterResponse || []),
      ...acceptedInvites.map((invite) => ({
        ...invite.test_center,
        isInvited: true, // 초대로 참여한 시험 구분용
      })),
    ];

    // 시험 상태별 분류
    const categorizeExams = (exams) => {
      return exams.filter((exam) => {
        const startDate = new Date(exam.start_date);
        const endDate = new Date(exam.end_date);
        return now >= startDate && now <= endDate;
      });
    };

    ongoingExams.value = categorizeExams(allExams);

    // 진행중이 아닌 시험 필터링 (내가 만든 시험만)
    const ongoingExamIds = ongoingExams.value.map((exam) => exam.id);
    myExams.value =
      testCenterResponse?.filter((exam) => {
        const endDate = new Date(exam.end_date);
        // 진행 중이지 않은 시험이면서 종료일자가 현재보다 이후인 시험만 필터링
        return !ongoingExamIds.includes(exam.id) && endDate >= now;
      }) || [];

    // 초대된 시험 중 미응답 목록
    invitedExams.value =
      inviteResponse?.filter((invite) => {
        const endDate = new Date(invite.test_center.end_date);
        return now <= endDate;
      }) || [];
  } catch (error) {
    console.error("시험 데이터 로딩 실패:", error);
  }
};

// 초기 데이터 로딩
watchEffect(fetchExams);
</script>

<template>
  <div class="w-full">
    <h1 class="mb-16 text-5xl font-medium font-laundry">내 시험장</h1>

    <!-- 진행중인 시험 섹션 -->
    <section class="w-full mb-8">
      <div class="flex items-center w-full gap-2 mb-4">
        <h2 class="text-xl font-medium text-gray-2">진행중인 시험</h2>
        <!-- 더보기/접기 버튼 -->
        <button
          @click="toggleOngoingExamsDisplay"
          class="px-3 py-2 transition-colors rounded-full text-gray-3 hover:bg-gray-100"
        >
          {{ isOngoingExamsExpanded ? "접기" : "전체보기 +" }}
        </button>
      </div>

      <!-- 조건부 렌더링 -->
      <div
        v-if="ongoingExams.length === 0"
        class="w-full py-10 text-gray-500 item-middle"
      >
        현재 진행중인 시험이 없습니다.
      </div>

      <ul v-else class="flex flex-wrap gap-6">
        <li
          v-for="exam in visibleOngoingExams"
          :key="exam.id"
          class="basis-[calc(25%-1.2rem)]"
        >
          <div
            :class="{
              'cursor-not-allowed opacity-50': !(
                exam.uid === authStore.user?.id || exam.isInvited
              ),
            }"
          >
            <ExamCard
              v-bind="{
                ...exam,
                showEditButtons: false,
                isClickable: exam.uid === authStore.user?.id || exam.isInvited,
              }"
            />
          </div>
        </li>
      </ul>
    </section>

    <!-- 내가 만든 시험 섹션 -->
    <section class="w-full mb-8">
      <div class="flex items-center w-full gap-2 mb-4">
        <h2 class="text-xl font-medium text-gray-2">내가 만든 시험</h2>
        <!-- 더보기/접기 버튼 -->
        <button
          @click="toggleMyExamsDisplay"
          class="px-3 py-2 transition-colors rounded-full text-gray-3 hover:bg-gray-100"
        >
          {{ isMyExamsExpanded ? "접기" : "전체보기 +" }}
        </button>
      </div>
      <div
        v-if="myExams.length === 0"
        class="w-full py-10 text-gray-500 item-middle"
      >
        대기중인 시험장 정보가 없습니다.
      </div>
      <ul v-else class="flex flex-wrap gap-6">
        <!-- 내가 만든 시험 섹션 -->
        <li
          v-for="exam in visibleMyExams"
          :key="exam.id"
          class="basis-[calc(25%-1.2rem)]"
        >
          <ExamCard
            v-bind="{ ...exam, showEditButtons: true }"
            @delete-exam="fetchExams"
          />
        </li>
      </ul>
    </section>

    <!-- 초대된 시험 섹션 -->
    <section class="w-full mb-8">
      <div class="flex items-center w-full gap-2 mb-4">
        <h2 class="text-xl font-medium text-gray-2">초대된 시험</h2>
        <button
          @click="toggleInvitedExamsDisplay"
          class="px-3 py-2 transition-colors rounded-full text-gray-3 hover:bg-gray-100"
        >
          {{ isInvitedExamsExpanded ? "접기" : "전체보기 +" }}
        </button>
      </div>
      <div
        v-if="invitedExams.length === 0"
        class="w-full py-10 text-gray-500 item-middle"
      >
        초대된 시험이 없습니다.
      </div>
      <ul v-else class="flex flex-wrap gap-6">
        <li
          v-for="invite in visibleInvitedExams"
          :key="invite.id"
          class="basis-[calc(25%-1.2rem)]"
        >
          <InvitedExamCard
            :invite-data="invite"
            :test-center="invite.test_center"
            @exam-status-change="fetchExams"
          />
        </li>
      </ul>
    </section>
  </div>
  <RouterLink
    to="/create-exam-room"
    class="fixed flex items-center justify-center w-16 h-16 rounded-full cursor-pointer bg-orange-1 right-20 bottom-20"
  >
    <img :src="createIcon" alt="새 시험장 만들기" class="w-8 h-8" />
  </RouterLink>
  <ConfirmDialog />
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
