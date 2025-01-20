<script setup>
import { RouterLink } from "vue-router";
const alertPath = new URL("@/assets/icons/alert.svg", import.meta.url).href;
const pointPath = new URL("@/assets/icons/point.svg", import.meta.url).href;
import { ref } from "vue";
import Menu from "primevue/menu";
// 메뉴 항목 정의
const menuItems = [
  {
    label: "프로필",
    icon: "pi pi-user",
  },
  {
    label: "로그아웃",
    icon: "pi pi-sign-out",
  },
];

// Menu 참조
const menu = ref(null);

// Menu 열기 함수
const openMenu = (event) => {
  menu.value.toggle(event); // 클릭 위치에서 메뉴 표시
};
//포인트 추적
const points = ref(40);
</script>

<template>
  <div
    class="bg-white rounded-3xl flex flex-col w-[calc(100%-24px)] max-w-[calc(100%-24px)] h-[calc(100vh-48px)] ml-6 mb-6 px-4 pb-6 pt-[72px]"
  >
    <!-- 상단 래핑 박스 -->
    <div class="flex flex-col gap-6 max-w-[870px] mx-auto">
      <div class="flex gap-4 items-center justify-end w-full">
        <!-- 알림 및 포인트 -->
        <img :src="alertPath" alt="alert" />

        <div
          class="flex items-center w-[53px] h-[24px] rounded-full font-pretend"
        >
          <!-- 별 아이콘 -->
          <img :src="pointPath" alt="point" />
          <!-- 포인트 숫자 -->
          <span class="text-sm font-bold text-gray-800 -ml-6">{{
            points
          }}</span>
        </div>

        <!-- 메뉴 트리거 -->
        <div
          @click="openMenu"
          class="flex items-center gap-2 cursor-pointer font-pretend"
        >
          <span class="font-bold">안효태님</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <!-- Menu -->
        <Menu
          :model="menuItems"
          ref="menu"
          popup
          appendTo="body"
          class="p-menu w-[200px] font-pretend"
        />
      </div>

      <h1 class="text-4xl font-laundry text-left">
        안효태님, 다시 만나 반가워요!
      </h1>
      <div
        class="flex items-center justify-between w-full h-[226px] gap-4 pt-[52px]"
      >
        <!-- 프로필 카드 -->
        <div
          class="bg-beige-2 rounded-lg p-6 flex flex-col items-center justify-center space-y-4 w-[206px] h-[226px]"
        >
          <img
            src="@/assets/harp seal.jpg"
            alt="Profile"
            class="w-[120px] h-[120px] rounded-full object-cover"
          />
          <div class="text-center">
            <p class="font-pretend text-lg font-bold">안효태님</p>
            <p class="font-pretend text-gray-600 text-sm">example@gmail.com</p>
          </div>
        </div>

        <!-- 등급 카드 -->
        <div
          class="bg-beige-2 rounded-lg p-6 flex flex-col justify-between w-[648px] h-[226px]"
        >
          <div class="text-left">
            <p class="font-bold text-gray-700 text-lg font-pretend">
              현재 등급은 <span class="font-bold">"초급"</span>
            </p>
          </div>
          <div class="text-left space-y-1">
            <p class="text-gray-700 text-sm font-pretend">시험장 2개 참여</p>
            <p class="text-gray-700 text-sm font-pretend">문제집 10개 생성</p>
            <p class="text-gray-700 text-sm font-pretend">
              중급까지 500포인트 남았습니다.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 래핑 박스 -->
    <div class="flex flex-col gap-6 max-w-[871px] mx-auto mt-[57px] pt-[56px]">
      <h2 class="text-lg font-bold text-left font-pretend w-full">
        공부하러 가기
      </h2>
      <div class="grid grid-cols-3 gap-6 w-full pt-[16px]">
        <!-- 카드 1 -->
        <div
          class="bg-beige-2 rounded-lg p-6 flex flex-col justify-between h-[261px]"
        >
          <p class="font-bold mb-4 font-pretend text-left">문제 생성하기</p>
          <p class="text-gray-600 text-sm font-pretend text-left">
            새로운 문제를 만들고, 문제집에 추가하세요.
          </p>
        </div>

        <!-- 카드 2 -->
        <div
          class="bg-beige-2 rounded-lg p-6 flex flex-col justify-between h-[261px]"
        >
          <p class="font-bold mb-4 text-base font-pretend text-left">
            시험장 입실
          </p>
          <p class="text-gray-600 text-sm font-pretend text-left">
            친구들과 함께 시험을 보고 결과를 공유하세요.
          </p>
        </div>

        <!-- 카드 3 -->
        <div
          class="bg-beige-2 rounded-lg p-6 flex flex-col justify-between h-[261px]"
        >
          <p class="font-bold mb-4 text-base font-pretend text-left">
            다시 볼 문제
          </p>
          <p class="text-gray-600 text-sm font-pretend text-left">
            틀렸거나, 다시 보고 싶은 문제를 다시 한번 공부해보세요.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
