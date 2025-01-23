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

const tabs = [
  { label: "문제집", icon: "pi pi-book" },
  { label: "시간", icon: "pi pi-clock" },
  { label: "초대", icon: "pi pi-user-plus" },
];

// 시험 생성에 필요한 데이터
const examData = ref({
  selectedWorkbook: null,
  examDateTime: null,
  duration: null,
  participants: [],
  shareOption: 'share',
});

// 완료 버튼 활성화 여부
const isCompleteEnabled = computed(() => {
  return (
    examData.value.selectedWorkbook &&
    examData.value.examDateTime &&
    examData.value.duration
  );
});

const dateTimeChip = computed(() => {
  if (!examData.value.examDateTime) return "";
  const startDate = new Date(examData.value.examDateTime);
  const durationInMs = examData.value.duration * 60 * 1000;
  const endDate = new Date(startDate.getTime() + durationInMs);
  return `${startDate.toLocaleString()} ~ ${endDate.toLocaleString()}`;
});

const participantsChip = computed(() => {
  const participants = examData.value.participants;
  if (!participants.length) return "";
  return `${examData.value.shareOption === "share" ? "공유함" : "공유하지 않음"}, 시험 인원 ${participants.length}명`;
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
  if (swiperInstance.value && currentTab.value < tabs.length - 1) {
    swiperInstance.value.slideNext();
  }
};

const resetDateTime = () => {
  examData.value.examDateTime = null;
  examData.value.duration = null;
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
          <!-- Chips Container -->
          <div class="flex gap-2 flex-wrap mb-4">
            <SelectionChip
              v-if="examData.selectedWorkbook"
              :label="`${examData.selectedWorkbook.title}`"
              icon="pi pi-book"
              @remove="examData.selectedWorkbook = null"
              removable
            />
            <SelectionChip
              v-if="examData.examDateTime"
              :label="dateTimeChip"
              icon="pi pi-clock"
              @remove="resetDateTime"
              removable
            />
            <SelectionChip
              v-if="examData.participants.length"
              :label="participantsChip"
              icon="pi pi-users"
              @remove="examData.participants = []"
              removable
            />
          </div>

          <SelectWorkbook
            v-model:selectedWorkbook="examData.selectedWorkbook"
          />
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
      <SwiperSlide
        :class="{ 'active-slide': currentTab === 1 }"
        class="border-beige-2 border"
      >
      <div class="px-16 py-6 relative">
          <!-- Chips Container -->
          <div class="flex gap-2 flex-wrap mb-4">
            <SelectionChip
              v-if="examData.selectedWorkbook"
              :label="`${examData.selectedWorkbook.title}`"
              icon="pi pi-book"
              @remove="examData.selectedWorkbook = null"
              removable
            />
            <SelectionChip
              v-if="examData.examDateTime"
              :label="dateTimeChip"
              icon="pi pi-clock"
              @remove="resetDateTime"
              removable
            />
            <SelectionChip
              v-if="examData.participants.length"
              :label="participantsChip"
              icon="pi pi-users"
              @remove="examData.participants = []"
              removable
            />
          </div>

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
      <SwiperSlide
        :class="{ 'active-slide': currentTab === 2 }"
        class="border-beige-2 border"
      >
        <div class="px-16 py-6 relative">
          <!-- Chips Container -->
          <div class="flex gap-2 flex-wrap mb-4">
            <SelectionChip
              v-if="examData.selectedWorkbook"
              :label="`${examData.selectedWorkbook.title}`"
              icon="pi pi-book"
              @remove="examData.selectedWorkbook = null"
              removable
            />
            <SelectionChip
              v-if="examData.examDateTime"
              :label="dateTimeChip"
              icon="pi pi-clock"
              @remove="resetDateTime"
              removable
            />
            <SelectionChip
              v-if="examData.participants.length"
              :label="participantsChip"
              icon="pi pi-users"
              @remove="examData.participants = []"
              removable
            />
          </div>

          <SelectParticipants
            v-model:participants="examData.participants"
            v-model:shareOption="examData.shareOption"
          />
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