<script setup>
import { againViewProblemAPI } from "@/api/againViewProblem";
import { authAPI } from "@/api/auth";
import { Button, useToast } from "primevue";
import { computed, watch, ref } from "vue";

const toast = useToast();
const { problem, currentProblemIndex, userAnswers } = defineProps({
  problem: Object,
  currentProblemIndex: Number,
  userAnswers: Array,
});

const isAgainViewProblem = ref(false);
const options = computed(() =>
  Object.entries(problem)
    .filter(([key]) => key.startsWith("option"))
    .map(([, value]) => value),
);
const emit = defineEmits(["selectAnswer"]);

const addAgainViewProblem = async () => {
  await againViewProblemAPI.addAgainViewProblem({
    problem_id: problem.id,
  });
  isAgainViewProblem.value = true;
  toast.add({
    severity: "success",
    summary: "다시 볼 문제 추가",
    detail: "다시 볼 문제에 추가되었습니다.",
    life: 3000,
  });
};

const deleteAgainViewProblem = async () => {
  await againViewProblemAPI.delete(problem.id);
  isAgainViewProblem.value = false;
  toast.add({
    severity: "success",
    summary: "다시 볼 문제 삭제",
    detail: "다시 볼 문제에서 삭제되었습니다.",
    life: 3000,
  });
};

watch(
  () => problem.id,
  async (problemId) => {
    const user = await authAPI.getCurrentUser();
    const data = await againViewProblemAPI.getByProblemId(user.id, problemId);
    if (data) {
      isAgainViewProblem.value = true;
    }
  },
  { immediate: true },
);
</script>
<template>
  <article class="flex flex-col w-[1000px] mx-auto">
    <div class="flex items-center gap-4 pb-6 w-full border-b">
      <h2>문제 {{ currentProblemIndex + 1 }} : {{ problem.title }}</h2>
      <Button
        v-if="isAgainViewProblem"
        @click="deleteAgainViewProblem"
        label="다시 볼 문제"
        icon="pi pi-flag-fill"
        size="small"
        severity="secondary"
      />
      <Button
        v-else
        @click="addAgainViewProblem"
        label="다시 볼 문제"
        icon="pi pi-flag"
        size="small"
        severity="secondary"
      />
    </div>
    <div
      v-if="problem.image_src"
      v-html="
        `<p class='mt-6 break-keep'>${problem.question}</p>
        <div class='flex justify-center mt-6 mb-12'>
          <img src='${problem.image_src}' alt='문제 이미지' />
        </div>`
      "
    ></div>
    <div
      v-else
      v-html="`<p class='mt-6 mb-12 break-keep'>${problem.question}</p>`"
    ></div>
    <div class="flex flex-col gap-4 mb-20">
      <div
        v-for="(option, index) in options"
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
        <label :for="index" class="pl-3 cursor-pointer"> {{ option }}</label>
      </div>
    </div>
  </article>
</template>
<style></style>
