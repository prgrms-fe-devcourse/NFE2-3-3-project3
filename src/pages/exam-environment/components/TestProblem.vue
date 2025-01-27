<script setup>
import { againViewProblemAPI } from "@/api/againViewProblem";
import { authAPI } from "@/api/auth";
import { Button, useToast } from "primevue";
import {
  computed,
  watch,
  ref,
  onBeforeUnmount,
  onMounted,
  watchEffect,
} from "vue";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";

const el = ref(null);
const viewer = ref(null);
const emit = defineEmits(["selectAnswer"]);

const toast = useToast();
const { problem, currentProblemIndex, userAnswers } = defineProps({
  problem: Object,
  currentProblemIndex: Number,
  userAnswers: Array,
});

const isAgainViewProblem = ref(false);

const options = computed(() => [
  problem.option_one,
  problem.option_two,
  problem.option_three,
  problem.option_four,
]);

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

const handleImageClick = (event) => {
  const img = event.target;
  console.log(img);
  if (img.requestFullscreen) {
    img.requestFullscreen();
  } else if (img.mozRequestFullScreen) {
    // Firefox
    img.mozRequestFullScreen();
  } else if (img.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    img.webkitRequestFullscreen();
  } else if (img.msRequestFullscreen) {
    // IE/Edge
    img.msRequestFullscreen();
  }
};

const addImageClickListeners = () => {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("click", handleImageClick);
  });
};

watch(
  () => problem.id,
  async (problemId) => {
    // 마크다운 Viewer 설정
    if (el.value && problem.question) {
      viewer.value = new Viewer({
        el: el.value,
        initialValue: problem.question,
      });
    }

    // 이미지 전체화면 이벤트리스너 등록
    addImageClickListeners();

    // 다시 볼 문제 여부 체크
    const user = await authAPI.getCurrentUser();
    const data = await againViewProblemAPI.getByProblemId(user.id, problemId);
    if (data.length) {
      isAgainViewProblem.value = true;
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (viewer.value) {
    viewer.value.destroy();
  }
});
</script>
<template>
  <article class="flex flex-col w-[1000px] mx-auto">
    <div class="flex items-center gap-4 pb-6 w-full border-b">
      <h2>문제 {{ currentProblemIndex + 1 }} : {{ problem?.title }}</h2>
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
    <div ref="el" class="w-full overflow-hidden mt-6 mb-12"></div>
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
              : 'text-gray-3',
          ]"
        >
          {{ index + 1 }}
        </button>
        <label :for="index" class="pl-3 cursor-pointer"> {{ option }}</label>
      </div>
    </div>
  </article>
</template>
<style scoped>
:deep(img) {
  max-width: 100%;
  cursor: pointer;
  object-fit: cover;
}
</style>
