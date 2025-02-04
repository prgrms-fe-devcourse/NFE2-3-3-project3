<script setup>
import crewBoardIcon from "@/assets/icons/crew_board.svg";
import foodBoardIcon from "@/assets/icons/food_board.svg";
import freeBoardIcon from "@/assets/icons/free_board.svg";
import photoBoardIcon from "@/assets/icons/photo_board.svg";
import { teamList } from "@/constants";
import { twMerge } from "tailwind-merge";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const teamName = computed(() => route.params.team);

const teamPage = computed(
  () => teamList.find((team) => team.name === route.params.team) || null
);
</script>
<template>
  <div
    :class="[
      'fixed',
      'left-0',
      'top-[100px]',
      'flex',
      'h-full',
      'w-[190px]',
      teamPage ? `bg-${teamPage.nickname}_opa30` : 'bg-white02',
      'flex-col',
      'items-center',
      'pt-[30px]',
      'px-[10px]',
      'gap-[50px]',
      'z-40',
    ]"
  >
    <!-- 구단 이름 -->
    <span
      v-if="teamPage"
      :class="`text-${teamPage?.nickname} text-3xl font-sigmar`"
      >{{ teamPage?.nickname }}</span
    >
    <span v-else class="text-gray-500">팀 정보 없음</span>
    <!-- 네비게이트 -->
    <nav class="flex flex-col items-center w-full gap-[22px]">
      <RouterLink
        :to="`/${teamName}/freeboard`"
        :class="
          twMerge(
            'flex px-[10px] py-2 items-center text-lg font-semibold gap-[10px] w-full rounded-[10px]',
            route.path.includes('/freeboard')
              ? `bg-${teamPage?.nickname}_opa10`
              : '',
            `hover:bg-${teamPage?.nickname}_opa10`
          )
        "
      >
        <img :src="freeBoardIcon" alt="자유게시판 아이콘" />
        <span>자유 게시판</span>
      </RouterLink>
      <RouterLink
        :to="`/${teamName}/crewboard`"
        :class="
          twMerge(
            'flex px-[10px] py-2 items-center text-lg font-semibold gap-[10px] w-full rounded-[10px]',
            route.path.includes('/crewboard')
              ? `bg-${teamPage.nickname}_opa10`
              : '',
            `hover:bg-${teamPage.nickname}_opa10`
          )
        "
      >
        <img :src="crewBoardIcon" alt="직관 크루 모집 아이콘" />
        <span>직관 크루 모집</span>
      </RouterLink>
      <RouterLink
        :to="`/${teamName}/photoboard`"
        :class="
          twMerge(
            'flex px-[10px] py-2 items-center text-lg font-semibold gap-[10px] w-full rounded-[10px]',
            route.path.includes('/photoboard')
              ? `bg-${teamPage.nickname}_opa10`
              : '',
            `hover:bg-${teamPage.nickname}_opa10`
          )
        "
      >
        <img :src="photoBoardIcon" alt="직관 인증 포토 아이콘" />
        <span>직관 인증 포토</span>
      </RouterLink>
      <RouterLink
        :to="`/${teamName}/foodboard`"
        :class="
          twMerge(
            'flex px-[10px] py-2 items-center text-lg font-semibold gap-[10px] w-full rounded-[10px]',
            route.path.includes('/foodboard')
              ? `bg-${teamPage.nickname}_opa10`
              : '',
            `hover:bg-${teamPage.nickname}_opa10`
          )
        "
      >
        <img :src="foodBoardIcon" alt="직관 맛집 찾기 아이콘" />
        <span>직관 맛집 찾기</span>
      </RouterLink>
    </nav>
  </div>
</template>
<style scoped></style>
