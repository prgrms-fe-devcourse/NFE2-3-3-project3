<script setup>
import { ref, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCards } from "swiper/modules";
import SelectWorkbook from "./components/SelectWorkbook.vue";
import SelectDateTime from "./components/SelectDateTime.vue";
import SelectParticipants from "./components/SelectParticipants.vue";
import SelectionChip from "./components/SelectionChip.vue";
import leftArrow from "@/assets/icons/create-exam-room/left-arrow.svg";
import rightArrow from "@/assets/icons/create-exam-room/right-arrow.svg";

import "swiper/css";
import "swiper/css/effect-cards";

const swiperInstance = ref(null);
const currentTab = ref(0);

// 통합된 상태 관리
const examData = ref({
  workbook: null,
  examDateTime: null,
  duration: null,
  participants: [],
  shareOption: 'share'
});

// 각 단계별 chip 표시 여부와 내용을 계산
const chips = computed(() => ({
  workbook: examData.value.workbook ? {
    label: examData.value.workbook.title,
    icon: "pi pi-book"
  } : null,
  
  dateTime: examData.value.examDateTime && examData.value.duration ? {
    label: `${new Date(examData.value.examDateTime).toLocaleString()} (${examData.value.duration}분)`,
    icon: "pi pi-clock"
  } : null,
  
  participants: examData.value.participants.length ? {
    label: `참가자 ${examData.value.participants.length}명`,
    icon: "pi pi-users"
  } : null
}));

const handleChipRemove = (key) => {
  switch (key) {
    case 'workbook':
      examData.value.workbook = null;
      break;
    case 'dateTime':
      examData.value.examDateTime = null;
      examData.value.duration = null;
      break;
    case 'participants':
      examData.value.participants = [];
      break;
  }
};

// 완료 버튼 활성화 여부
const isCompleteEnabled = computed(() => {
  return examData.value.workbook && 
         examData.value.examDateTime && 
         examData.value.duration;
});

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
  if (swiperInstance.value && currentTab.value < 2) {
    swiperInstance.value.slideNext();
  }
};

const handleSubmit = () => {
  // TODO: API 호출
  console.log('최종 시험 데이터:', examData.value);
};
</script>

<template>
  <div class="w-full">
    <h1 class="font-laundry mb-16 text-5xl font-medium">시험장 만들기</h1>

    <!-- 공통 Chips 영역 -->
    <div class="flex flex-wrap gap-2 mb-4">
      <SelectionChip
        v-for="(chip, key) in chips"
        :key="key"
        v-if="chip"
        :label="chip.label"
        :icon="chip.icon"
        removable
        @remove="handleChipRemove(key)"
      />
    </div>

    <div class="relative h-[750px] overflow-visible pr-12">
      <Swiper
        :effect="'cards'"
        :modules="[EffectCards]"
        :grabCursor="true"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        class="mySwiper overflow-visible"
      >
        <!-- 문제집 선택 슬라이드 -->
        <SwiperSlide :class="{ 'active-slide': currentTab === 0 }" class="border-beige-2 border">
          <div class="px-16 py-6 relative">
            <SelectWorkbook
              v-model:selectedWorkbook="examData.workbook"
            />
            <div class="absolute top-8 transition-all duration-300 z-20" :style="{ right: '-3rem' }">
              <div class="bg-orange-2 rounded-r-lg p-4 flex items-center gap-2 cursor-pointer"
                   :class="{ 'bg-orange-500': currentTab === 0 }">
                <i class="pi pi-book text-white"></i>
              </div>
            </div>
          </div>
          <div class="absolute bottom-6 right-6 flex gap-4">
            <button
              @click="nextSlide"
              class="px-6 py-2 text-gray-3 rounded flex items-center gap-2 hover:text-gray-2 transition"
            >
              다음으로
              <img :src="rightArrow" alt="다음으로 가기" />
            </button>
          </div>
        </SwiperSlide>

        <!-- 시간 선택 슬라이드 -->
        <SwiperSlide :class="{ 'active-slide': currentTab === 1 }" class="border-beige-2 border">
          <div class="px-16 py-6 relative">
            <SelectDateTime
              v-model:examDateTime="examData.examDateTime"
              v-model:duration="examData.duration"
            />
            <div class="absolute top-16 transition-all duration-300 z-20" :style="{ right: '-3rem' }">
              <div class="bg-orange-2 rounded-r-lg p-4 flex items-center gap-2 cursor-pointer"
                   :class="{ 'bg-orange-500': currentTab === 1 }">
                <i class="pi pi-clock text-white"></i>
              </div>
            </div>
          </div>
          <div class="absolute bottom-6 right-6 flex gap-4">
            <button
              @click="prevSlide"
              class="px-6 py-2 text-gray-3 rounded flex items-center gap-2 hover:text-gray-2 transition"
            >
              <img :src="leftArrow" alt="이전으로 가기" />
              이전으로
            </button>
            <button
              @click="nextSlide"
              class="px-6 py-2 text-gray-3 rounded flex items-center gap-2 hover:text-gray-2 transition"
            >
              다음으로
              <img :src="rightArrow" alt="다음으로 가기" />
            </button>
          </div>
        </SwiperSlide>

        <!-- 참가자 선택 슬라이드 -->
        <SwiperSlide :class="{ 'active-slide': currentTab === 2 }" class="border-beige-2 border">
          <div class="px-16 py-6 relative">
            <SelectParticipants
              v-model:participants="examData.participants"
              v-model:shareOption="examData.shareOption"
            />
            <div class="absolute top-32 transition-all duration-300 z-20" :style="{ right: '-3rem' }">
              <div class="bg-orange-2 rounded-r-lg p-4 flex items-center gap-2 cursor-pointer"
                   :class="{ 'bg-orange-500': currentTab === 2 }">
                <i class="pi pi-user-plus text-white"></i>
              </div>
            </div>
          </div>
          <div class="absolute bottom-6 right-6 flex gap-4">
            <button
              @click="prevSlide"
              class="px-6 py-2 text-gray-3 rounded flex items-center gap-2 hover:text-gray-2 transition"
            >
              <img :src="leftArrow" alt="이전으로 가기" />
              이전으로
            </button>
            <button
              @click="handleSubmit"
              :disabled="!isCompleteEnabled"
              class="px-10 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              완료하기
            </button>
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
  overflow: visible !important;
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
  overflow: visible !important;
  position: relative;
}

:deep(.swiper-slide-shadow) {
  background: #faf8f1 !important;
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
</style>