<script setup>
import { getCurrentGradeInfo } from "@/utils/getCurrentGradeInfo";
import { ProgressBar } from "primevue";
import { ref, onMounted } from "vue";

const points = ref(0);
const gradeInfo = ref();

onMounted(() => {
  points.value = 0;
  setTimeout(() => {
    points.value = 40;
    gradeInfo.value = getCurrentGradeInfo(40);
  }, 100);
});
</script>
<template>
  <div
    class="flex justify-between w-full h-56 px-8 py-6 bg-beige-2 rounded-2xl"
  >
    <div class="flex flex-col justify-between">
      <div>
        <p class="font-semibold text-2xl text-black-2 mb-8">
          현재 등급은
          <span>"</span>
          <span class="text-orange-1">
            {{ gradeInfo?.current?.name }}
          </span>
          <span>"</span>
        </p>
        <p class="text-lg">
          현재 포인트
          <span class="font-semibold text-orange-1 ml-1">{{ points }}</span>
        </p>
        <ProgressBar
          class="min-w-[30rem] min-h-10"
          :value="(points / 500) * 100"
          v-tooltip.top="`${points} / ${500}`"
          type="text"
        >
          {{}}
        </ProgressBar>
      </div>
      <div class="flex items-center gap-4">
        <p class="flex text-sm gap-2">
          <span class="font-semibold">현재 권한:</span>
          <span>시험장 {{ gradeInfo?.current?.examLimit }}개</span>
          <span>|</span>
          <span>문제집 {{ gradeInfo?.current?.problemSetLimit }}개</span>
        </p>
        <span class="pi pi-arrow-right" style="font-size: 14px"></span>
        <p class="flex text-sm gap-2">
          <span class="font-semibold">다음 권한:</span>
          <span>시험장 {{ gradeInfo?.next?.examLimit }}개</span>
          <span>|</span>
          <span>문제집 {{ gradeInfo?.next?.problemSetLimit }}개</span>
        </p>
      </div>
    </div>
    <img :src="gradeInfo?.current?.imgSrc" alt="초보" />
  </div>
</template>
<style></style>
