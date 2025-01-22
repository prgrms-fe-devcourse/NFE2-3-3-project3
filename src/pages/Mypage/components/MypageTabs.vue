<script setup>
import { RouterLink } from "vue-router";
import { Column, DataTable } from "primevue";
import { GRADES } from "@/const/grades";
import { ref } from "vue";
import { formatDate } from "@/utils/formatDate";
import { PointType } from "@/const/pointType";

const USERS = [
  {
    id: 1,
    name: "김세빈",
    email: "rlatpqls13@gmail.com",
    avatar_url:
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
  },
  {
    id: 2,
    name: "김세빈",
    email: "rlatpqls13@gmail.com",
    avatar_url:
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
  },
  {
    id: 3,
    name: "김세빈",
    email: "rlatpqls13@gmail.com",
    avatar_url:
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
  },
  {
    id: 4,
    name: "김세빈",
    email: "rlatpqls13@gmail.com",
    avatar_url:
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
  },
  {
    id: 5,
    name: "김세빈",
    email: "rlatpqls13@gmail.com",
    avatar_url:
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
  },
  {
    id: 6,
    name: "김세빈",
    email: "rlatpqls13@gmail.com",
    avatar_url:
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
  },
  {
    id: 7,
    name: "김세빈",
    email: "rlatpqls13@gmail.com",
    avatar_url:
      "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
  },
];
const POINT_HISTORIES = [
  {
    id: 1,
    change_value: 5,
    total: 5,
    point_type: "problem",
    created_at: formatDate(new Date()),
  },
  {
    id: 2,
    change_value: 10,
    total: 15,
    point_type: "test_correct_all",
    created_at: formatDate(new Date()),
  },
];
const TABS = ["팔로잉 목록", "팔로워 목록", "포인트 내역"];

const currentTab = ref(TABS[0]);
const changeTab = (event) => {
  currentTab.value = event.target.innerText;
};

const getMessageFromPointType = (pointType) => {
  switch (pointType) {
    case PointType.problem:
      return "새로운 문제를 생성하셨군요! 10포인트를 획득했습니다.";
    case PointType.comment:
      return "댓글을 작성하셨군요! 2포인트를 획득했습니다.";
    case PointType.test_complete:
      return "시험을 완료하셨군요! 9포인트를 획득했습니다.";
    case PointType.test_correct_all:
      return "시험에서 문제를 다 맞히셨군요! 10포인트를 획득했습니다.";
    default:
      break;
  }
};
</script>
<template>
  <section class="flex flex-col gap-6">
    <div class="flex gap-8 text-black-2 font-semibold text-xl">
      <button
        v-for="tab in TABS"
        :key="tab"
        type="button"
        :class="
          currentTab === tab
            ? 'text-orange-1'
            : 'hover:text-gray-1 transition-colors'
        "
        @click="changeTab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 팔로잉 목록 탭 -->
    <div v-if="currentTab === '팔로잉 목록'" class="grid grid-cols-6 gap-4">
      <RouterLink
        v-for="following in USERS"
        :to="`/user/${following.id}`"
        class="flex flex-col justify-center items-center gap-4 w-36 h-40 px-2 py-5 bg-black-6/20 rounded-lg"
      >
        <img
          class="w-16 h-16 rounded-full border border-black-4"
          :src="following.avatar_url"
          alt="프로필 이미지"
        />
        <div class="flex flex-col items-center gap-1">
          <p class="text-sm font-semibold">{{ following.name }}</p>
          <p class="text-xs font-medium text-black-3">
            {{ following.email }}
          </p>
        </div>
      </RouterLink>
    </div>

    <!-- 팔로워 목록 탭 -->
    <div
      v-else-if="currentTab === '팔로워 목록'"
      class="grid grid-cols-6 gap-4"
    >
      <RouterLink
        v-for="follower in USERS"
        :to="`/user/${follower.id}`"
        class="flex flex-col justify-center items-center gap-4 w-36 h-40 px-2 py-5 bg-black-6/20 rounded-lg"
      >
        <img
          class="w-16 h-16 rounded-full border border-black-4"
          :src="follower.avatar_url"
          alt="프로필 이미지"
        />
        <div class="flex flex-col items-center gap-1">
          <p class="text-sm font-semibold">{{ follower.name }}</p>
          <p class="text-xs font-medium text-black-3">{{ follower.email }}</p>
        </div>
      </RouterLink>
    </div>

    <!-- 포인트 내역 탭 -->
    <div v-else class="flex flex-col gap-6">
      <div class="grid grid-cols-4 h-full gap-3">
        <div
          v-for="grade in [GRADES.one, GRADES.two, GRADES.three]"
          class="flex gap-4 w-full bg-black-6 p-4 rounded-lg"
        >
          <div class="flex justify-center items-center">
            <img :src="grade.imgSrc" class="w-16 h-20" alt="등급 이미지" />
          </div>
          <div class="flex flex-col gap-2">
            <p>
              <span class="font-semibold mr-2">{{ grade.name }}</span>
              <span class="text-sm text-[10px]">{{ grade.point }}포인트</span>
            </p>
            <div>
              <p class="text-sm">
                <span
                  class="pi pi-circle-fill mr-2"
                  style="font-size: 6px"
                ></span>
                <span>시험장 {{ grade.examLimit }}개</span>
              </p>
              <p class="text-sm">
                <span
                  class="pi pi-circle-fill mr-2"
                  style="font-size: 6px"
                ></span>
                <span>문제집 {{ grade.problemSetLimit }}개</span>
              </p>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col justify-between gap-2 w-full bg-black-6 px-6 py-4 rounded-lg"
        >
          <p>포인트 획득</p>
          <div class="flex flex-col gap-1 text-sm">
            <p>
              <span>문제 생성 : </span>
              <span class="font-semibold ml-1">5 포인트</span>
            </p>
            <p>
              <span>댓글 작성 : </span>
              <span class="font-semibold ml-1">2 포인트</span>
            </p>
            <div>
              <p>
                <span>시험 완료 (10문제 이상) :</span>
                <span class="font-semibold ml-1">9 포인트</span>
              </p>
              <p class="flex items-center">
                <span
                  class="pi pi-circle-fill mr-2"
                  style="font-size: 6px"
                ></span>
                <span>모두 정답 :</span>
                <span class="font-semibold mx-1">1 포인트</span> 추가 획득
              </p>
            </div>
          </div>
        </div>
      </div>
      <DataTable
        :value="POINT_HISTORIES"
        dataKey="id"
        tableStyle="min-width: 50rem;"
        showGridlines
        paginator
        :rows="10"
      >
        <template #empty>아직 적립된 포인트가 없어요...</template>
        <Column field="point_type" header="종류">
          <template #body="slotProps">
            <span
              v-if="slotProps.data.point_type === PointType.problem"
              class="pi pi-pencil"
            ></span>
            <span
              v-else-if="slotProps.data.point_type === PointType.comment"
              class="pi pi-comment"
            ></span>
            <span
              v-else-if="slotProps.data.point_type === PointType.test_complete"
              class="pi pi-stopwatch"
            ></span>
            <span
              v-else-if="
                slotProps.data.point_type === PointType.test_correct_all
              "
              class="pi pi-stopwatch text-orange-1"
            ></span>
          </template>
        </Column>
        <Column field="point_type" header="메시지">
          <template #body="slotProps">
            {{ getMessageFromPointType(slotProps.data.point_type) }}
          </template>
        </Column>
        <Column field="change_value" header="획득 포인트"></Column>
        <Column field="total" header="총 포인트"></Column>
        <Column field="created_at" header="날짜"> </Column>
      </DataTable>
    </div>
  </section>
</template>
<style scoped></style>
