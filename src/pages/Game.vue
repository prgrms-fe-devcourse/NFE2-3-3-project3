<script setup>
import GameMonitorIcon from "@/assets/icons/game-monitor.svg";
import BaseBallGameIcon from "@/assets/icons/bt_baseBallGame.svg";
import BaseBallGameIconHover from "@/assets/icons/bt_baseBallGame_hover.svg";
import BaseBallQuizIcon from "@/assets/icons/bt_baseBallQuiz.svg";
import BaseBallQuizIconHover from "@/assets/icons/bt_baseBallQuiz_hover.svg";
import BaseBallTMTIcon from "@/assets/icons/bt_baseBallTMT.svg";
import BaseBallTMTIconHover from "@/assets/icons/bt_baseBallTMT_hover.svg";
import Header from "@/components/ui/Header.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const hoveredButton = ref(null);

// 각 버튼 클릭 시 경로 이동 함수
const goToBaseBallGame = () => {
  router.push("/game/baseballgame");
};
const goToBaseBallQuiz = () => {
  router.push("/game/quizselect");
};
const goToBaseBallTMT = () => {
  router.push("/game/tournamentselect");
};
</script>

<template>
  <Header class="header" />
  <!-- 전체 배경 -->
  <div class="relative w-screen h-screen">
    <div
      class="absolute top-0 left-0 w-full h-full z-0"
      style="background-color: #070707"></div>

    <!-- 모니터 레이어 -->
    <div
      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[688px] h-[calc(100vh-100px)] z-10">
      <img
        :src="GameMonitorIcon"
        alt="Monitor Background"
        class="w-full h-full object-contain blur-sm" />
    </div>
    <div
      class="absolute top-0 left-0 w-full h-full z-20"
      style="background-color: rgba(211, 211, 211, 0.2)"></div>

    <!-- 버튼 레이어 -->
    <div
      class="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-[110%] flex justify-center gap-[200px] z-30">
      <!-- 야구 게임 버튼 -->
      <div
        class="flex flex-col items-center button"
        @mouseover="hoveredButton = 'BaseBallGame'"
        @mouseleave="hoveredButton = null"
        @click="goToBaseBallGame">
        <div
          class="w-[80px] h-[80px] flex justify-center items-center cursor-pointer drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
          <img
            :src="
              hoveredButton === 'BaseBallGame'
                ? BaseBallGameIconHover
                : BaseBallGameIcon
            "
            alt="야구 게임"
            class="w-20 h-20" />
        </div>
        <span
          class="mt-2 text-lg drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
          :style="{
            color: hoveredButton === 'BaseBallGame' ? '#0BF89F' : 'white',
          }">
          야구 게임
        </span>
      </div>

      <!-- 야구 퀴즈 버튼 -->
      <div
        class="flex flex-col items-center button"
        @mouseover="hoveredButton = 'BaseBallQuiz'"
        @mouseleave="hoveredButton = null"
        @click="goToBaseBallQuiz">
        <div
          class="w-[80px] h-[80px] flex justify-center items-center cursor-pointer drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
          <img
            :src="
              hoveredButton === 'BaseBallQuiz'
                ? BaseBallQuizIconHover
                : BaseBallQuizIcon
            "
            alt="야구 퀴즈"
            class="w-20 h-20" />
        </div>
        <span
          class="mt-2 text-lg drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
          :style="{
            color: hoveredButton === 'BaseBallQuiz' ? '#0BF89F' : 'white',
          }">
          야구 퀴즈
        </span>
      </div>

      <!-- 토너먼트 버튼 -->
      <div
        class="flex flex-col items-center button"
        @mouseover="hoveredButton = 'BaseBallTMT'"
        @mouseleave="hoveredButton = null"
        @click="goToBaseBallTMT">
        <div
          class="w-[80px] h-[80px] flex justify-center items-center cursor-pointer drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
          <img
            :src="
              hoveredButton === 'BaseBallTMT'
                ? BaseBallTMTIconHover
                : BaseBallTMTIcon
            "
            alt="토너먼트"
            class="w-20 h-20" />
        </div>
        <span
          class="mt-2 text-lg drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
          :style="{
            color: hoveredButton === 'BaseBallTMT' ? '#0BF89F' : 'white',
          }">
          토너먼트
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 글로벌 초기화 */
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* Header 컴포넌트 상단 고정 */
.header {
  position: relative;
  z-index: 50;
}
</style>
