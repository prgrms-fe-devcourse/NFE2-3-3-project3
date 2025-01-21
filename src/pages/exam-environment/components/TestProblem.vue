<script setup>
import { Button } from "primevue";
import { computed } from "vue";

const { problem, currentProblemIndex, userAnswers } = defineProps({
  problem: {
    type: Object,
    required: true,
  },
  currentProblemIndex: {
    type: Number,
    required: true,
  },
  userAnswers: {
    type: Array,
    required: true,
  },
});

const options = computed(() =>
  Object.entries(problem)
    .filter(([key]) => key.startsWith("option"))
    .map(([, value]) => value),
);
const emit = defineEmits(["selectAnswer"]);
</script>
<template>
  <article class="flex flex-col w-[1000px] mx-auto">
    <div class="flex items-center gap-4 pb-6 w-full border-b">
      <h2>문제 {{ currentProblemIndex + 1 }}</h2>
      <Button
        label="다시 볼 문제"
        icon="pi pi-flag"
        size="small"
        severity="secondary"
        class="!bg-navy-4 !text-white"
      />
    </div>
    <div
      v-html="
        `<p class='mt-6 mb-12 break-keep'>화재 예방을 위해 건물의 소방 설비를 점검하는 과정에서 화재 경보기의 배터리가 모두 방전되어 작동하지 않는 것을 발견했습니다. 건물주는 이를 교체할 예산이 부족하다고 주장하며 당장 조치를 취하기 어렵다고 말했습니다. 이러한 상황에서 소방 공무원으로서 어떤 절차를 통해 문제를 해결할 것인지 구체적으로 설명하세요. 또한, 건물주의 협조를 얻기 위한 설득 방법과 이를 실행하지 않을 경우의 법적 조치에 대해 설명하세요. 마지막으로, 이런 일이 반복되지 않도록 예방 조치를 제안해보세요.</p>`
      "
    ></div>
    <div class="flex flex-col gap-4">
      <div
        v-for="(description, index) in options"
        :key="index"
        class="flex items-center"
      >
        <button
          @click="emit('selectAnswer', String(index + 1))"
          :id="index"
          type="button"
          :class="[
            'flex justify-center items-center border-2 border-solid w-6 h-6 rounded-full',
            userAnswers[currentProblemIndex] === String(index + 1)
              ? 'border-orange-1 bg-orange-1 text-white'
              : 'border-gray-3 text-gray-3',
          ]"
        >
          {{ index + 1 }}
        </button>
        <label :for="index" class="pl-3 cursor-pointer">{{
          description
        }}</label>
      </div>
    </div>
  </article>
</template>
<style></style>
