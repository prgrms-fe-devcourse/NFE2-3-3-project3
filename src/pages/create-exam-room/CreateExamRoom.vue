<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCards } from "swiper/modules";
import SelectWorkbook from "./components/SelectWorkbook.vue";
import SelectDateTime from "./components/SelectDateTime.vue";
import SelectParticipants from "./components/SelectParticipants.vue";

import "swiper/css";
import "swiper/css/effect-cards";

const swiperInstance = ref(null);
const currentTab = ref(0);

// 시험 생성에 필요한 데이터
const examData = ref({
  selectedWorkbook: null,
  examDateTime: null,
  duration: null,
  participants: [],
});

const tabs = [
  { label: "문제집", icon: "pi pi-book" },
  { label: "시간", icon: "pi pi-clock" },
  { label: "초대", icon: "pi pi-user-plus" },
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

const handleSubmit = () => {
  console.log("최종 시험 데이터:", examData.value);
  // API 호출 등 최종 처리
};
</script>

<template>
  <h1 class="font-laundry mb-16 text-5xl font-medium">시험장 만들기</h1>
  <!-- Swiper -->
  <div class="relative h-[750px] overflow-visible pr-12">
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
        <div class="px-16 py-6 relative">
          <SelectWorkbook v-model:selectedWorkbook="examData.selectedWorkbook" />
          <div
            class="absolute top-8 transition-all duration-300 z-20"
            :style="{ right: '-3rem' }"
            @click="setTab(0)"
          >
            <div 
              class="bg-orange-2 rounded-r-lg p-4 flex items-center gap-2 cursor-pointer"
              :class="{ 'bg-orange-500': currentTab === 0 }"
            >
              <i class="pi pi-book text-white"></i>
            </div>
          </div>
        </div>
      </SwiperSlide>

      <!-- 시간 선택 슬라이드 -->
      <SwiperSlide
        :class="{ 'active-slide': currentTab === 1 }"
        class="border-beige-2 border"
      >
        <div class="px-16 py-6 relative">
          <SelectDateTime
            v-model:examDateTime="examData.examDateTime"
            v-model:duration="examData.duration"
          />
          <div
            class="absolute top-16 transition-all duration-300 z-20"
            :style="{ right: '-3rem' }"
            @click="setTab(1)"
          >
            <div 
              class="bg-orange-2 rounded-r-lg p-4 flex items-center gap-2 cursor-pointer"
              :class="{ 'bg-orange-500': currentTab === 1 }"
            >
              <i class="pi pi-clock text-white"></i>
            </div>
          </div>
        </div>
      </SwiperSlide>

      <!-- 참가자 선택 슬라이드 -->
      <SwiperSlide
        :class="{ 'active-slide': currentTab === 2 }"
        class="border-beige-2 border"
      >
        <div class="px-16 py-6 relative">
          <SelectParticipants v-model:participants="examData.participants" />
          <div
            class="absolute top-32 transition-all duration-300 z-20"
            :style="{ right: '-3rem' }"
            @click="setTab(2)"
          >
            <div 
              class="bg-orange-2 rounded-r-lg p-4 flex items-center gap-2 cursor-pointer"
              :class="{ 'bg-orange-500': currentTab === 2 }"
            >
              <i class="pi pi-user-plus text-white"></i>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
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