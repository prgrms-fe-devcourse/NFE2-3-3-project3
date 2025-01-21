<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import MyWorkBook from "./components/MyWorkBook.vue";

const swiperInstance = ref(null);
const currentTab = ref(0);
const isMyBooksViewAll = ref(false);

const toggleMyBooksViewAll = () => {
  isMyBooksViewAll.value = !isMyBooksViewAll.value;
};

const visibleMyBooks = ref([
  {
    title: "정보처리기사 실기",
    description: "2024 정보처리기사 실기 대비 문제 모음집",
    count: 120,
  },
  {
    title: "SQLD 자격증",
    description: "SQLD 자격증 취득을 위한 기출 문제",
    count: 85,
  },
  {
    title: "JavaScript 기초",
    description: "JavaScript 기초 개념 및 코딩 테스트 준비",
    count: 95,
  },
  {
    title: "리액트 심화",
    description: "React 고급 개념 및 실전 문제 모음",
    count: 75,
  },
  {
    title: "리액트 심화",
    description: "React 고급 개념 및 실전 문제 모음",
    count: 75,
  },
  {
    title: "리액트 심화",
    description: "React 고급 개념 및 실전 문제 모음",
    count: 75,
  },
]);

const tabs = [
  {
    label: "문제집",
    icon: "pi pi-book",
    command: () => setTab(0),
  },
  {
    label: "시간",
    icon: "pi pi-clock",
    command: () => setTab(1),
  },
  {
    label: "초대",
    icon: "pi pi-user-plus",
    command: () => setTab(2),
  },
];

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
};

const onSlideChange = () => {
  if (swiperInstance.value) {
    currentTab.value = swiperInstance.value.activeIndex;
  }
};

const setTab = (id) => {
  currentTab.value = id;
  if (swiperInstance.value) {
    swiperInstance.value.slideTo(id);
  }
};

const prevSlide = () => {
  if (swiperInstance.value && currentTab.value > 0) {
    swiperInstance.value.slidePrev();
  }
};

const nextSlide = () => {
  if (swiperInstance.value && currentTab.value < tabs.length - 1) {
    swiperInstance.value.slideNext();
  }
};
</script>

<template>
  <div class="w-full h-full">
    <!-- 헤더 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-4xl font-bold font-laundry">시험장 만들기</h1>
      <div class="flex gap-4">
        <!-- 이전으로 버튼 -->
        <button
          class="flex items-center text-gray-500 hover:text-gray-700"
          @click="prevSlide"
          :disabled="currentTab === 0"
        >
          <svg
            class="w-5 h-5 mr-1"
            fill="none"
            stroke="#F1A140"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          이전으로
        </button>

        <!-- 다음으로 버튼 -->
        <button
          class="flex items-center text-gray-500 hover:text-gray-700"
          @click="nextSlide"
          :disabled="currentTab === tabs.length - 1"
        >
          다음으로
          <svg
            class="w-5 h-5 ml-1"
            fill="none"
            stroke="#F1A140"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Swiper -->
    <div class="relative h-[750px] overflow-visible">
      <Swiper
        :effect="'cards'"
        :modules="[EffectCards]"
        :grabCursor="true"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        class="mySwiper overflow-visible"
      >
        <!-- 문제집 슬라이드 -->
        <SwiperSlide
          :class="{ 'active-slide': currentTab === 0 }"
          class="border-beige-2 border"
        >
          <div class="px-4 py-6 relative">
            <h2 class="text-2xl text-black-1 font-medium">문제집 선택하기</h2>

            <!-- 내가 만든 문제집 리스트-->
            <section class="flex flex-col gap-[18px]">
              <div class="flex items-center gap-[16px]">
                <h2 class="font-semibold text-xl">내가 만든 문제집</h2>
                <button
                  @click="toggleMyBooksViewAll"
                  class="text-[#B1B1B1] hover:no-underline flex items-center gap-1"
                >
                  {{ isMyBooksViewAll ? "접기" : "전체보기 +" }}
                </button>
              </div>
              <MyWorkBook :visibleMyBooks="visibleMyBooks" />
            </section>
            <div
              class="absolute top-8 transition-all duration-300 z-20"
              :style="{ right: currentTab === 0 ? '-3rem' : '0' }"
              @click="setTab(0)"
            >
              <div
                class="bg-orange-2 rounded-r-lg p-4 flex items-center gap-2 cursor-pointer"
              >
                <i class="pi text-white pi-book"></i>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <!-- 시간 슬라이드 -->
        <SwiperSlide
          :class="{ 'active-slide': currentTab === 1 }"
          class="border-beige-2 border"
        >
          <div class="px-4 py-6 relative">
            <h2 class="text-2xl text-black-1 font-medium">시간 선택하기</h2>
            <div
              class="absolute top-16 transition-all duration-300 z-20"
              :style="{ right: currentTab === 1 ? '-3rem' : '-3rem' }"
              @click="setTab(1)"
            >
              <div
                class="bg-orange-2 rounded-r-lg p-4 flex items-center gap-2 cursor-pointer"
              >
                <i class="pi text-white pi-clock"></i>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <!-- 초대 슬라이드 -->
        <SwiperSlide
          :class="{ 'active-slide': currentTab === 2 }"
          class="border-beige-2 border"
        >
          <div class="px-4 py-6 relative">
            <h2 class="text-2xl text-black-1 font-medium">시험장 초대하기</h2>
            <div
              class="absolute top-32 transition-all duration-300 z-20"
              :style="{ right: currentTab === 2 ? '-3rem' : '-3rem' }"
              @click="setTab(2)"
            >
              <div
                class="bg-orange-2 rounded-r-lg p-4 flex items-center gap-2 cursor-pointer"
              >
                <i class="pi text-white pi-user-plus"></i>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<style scoped>
.mySwiper {
  width: 100%;
  height: 100% !important;
}

:deep(.swiper) {
  overflow: visible;
}

:deep(.swiper-wrapper) {
  height: 100%;
}

:deep(.swiper-slide) {
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  height: 100%;
  background-color: #f3f4f6;
  transition: all 0.3s ease;
  overflow: visible;
}

:deep(.swiper-slide-active),
.active-slide {
  background-color: white !important;
}

:deep(.swiper-slide:not(.swiper-slide-active):not(.active-slide)) {
  background-color: #faf8f1 !important;
}

:deep(.pi) {
  color: white !important;
}

:deep(.swiper-slide-shadow) {
  background-color: #faf8f1 !important;
}
</style>
