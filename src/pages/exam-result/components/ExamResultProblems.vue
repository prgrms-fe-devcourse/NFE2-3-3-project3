<script setup>
import example from "@/assets/Problem14.png";
import { Button } from "primevue";
</script>

<template>
  <div class="bg-white p-6 rounded-lg w-full mx-auto">
    <!-- 문제 번호와 다시 볼 문제 버튼 -->
    <div class="flex items-center justify-left gap-4 pb-4 mb-4">
      <h2 class="text-lg font-bold">문제 14.</h2>
      <Button
        label="다시 볼 문제"
        icon="pi pi-flag"
        size="small"
        severity="secondary"
        class="!bg-navy-4 !text-white"
      />
    </div>

    <!-- 문제 내용 -->
    <div class="text-gray-800 mb-6">
      <p class="mb-4">
        화재 예방을 위해 건물의 소방 설비를 점검하는 과정에서 화재 경보기의
        배터리가 모두 방전되어 작동하지 않는 것을 발견했습니다. 건물주는 이를
        교체할 예산이 부족하다고 주장하며 당장 조치를 취하기 어렵다고
        말했습니다. 이러한 상황에서 소방 공무원으로서 어떤 절차를 통해 문제를
        해결할 것인지 구체적으로 설명하세요. 또한, 건물주의 협조를 얻기 위한
        설득 방법과 이를 실행하지 않을 경우의 법적 조치에 대해 설명하세요.
        마지막으로, 이런 일이 반복되지 않도록 예방 조치를 제안해보세요.
      </p>
    </div>

    <!-- 이미지 -->
    <div class="flex justify-center mb-6">
      <img :src="example" alt="Diagram" class="max-w-full h-auto" />
    </div>

    <!-- 내 선택 -->
    <div class="mb-6">
      <h3 class="font-bold text-gray-900 mb-2">내 선택</h3>
      <div class="flex items-start space-x-4 border-b pb-4">
        <div
          class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-black font-bold"
        >
          5
        </div>
        <p class="text-gray-800 flex-grow">
          건물주에게 소방 설비의 중요성을 설명하고, 관련 법규에 따라 일정 기한
          내 배터리를 교체하지 않을 경우 과태료가 부과될 것임을 고지한다.
        </p>
      </div>
    </div>

    <!-- 답 -->
    <div class="mb-6">
      <h3 class="font-bold text-gray-900 mb-2">답</h3>
      <div class="flex items-center space-x-4">
        <span
          class="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-black font-bold"
        >
          1
        </span>
        <p class="text-gray-800">
          건물주에게 배터리 교체 대신 매일 밤 잠을 자지 말고 건물 안을 직접
          순찰하라고 조언한다.
        </p>
      </div>
    </div>

    <!-- 풀이 -->
    <div>
      <h3 class="font-bold text-gray-900 mb-2">풀이</h3>
      <p class="text-gray-800">
        건물주에게 배터리 교체 대신 매일 밤 잠을 자지 말고 건물 안을 직접
        순찰하라고 조언하면 배터리 교체에 돈이 들지 않기 때문에 돈이 들지
        않습니다.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 필요한 경우 Tailwind CSS를 보완할 추가 스타일을 작성할 수 있습니다. */
</style>
