<script setup>
import { watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProblemStore } from "@/store/problemStore";
import { useAuthStore } from "@/store/authStore";
import { useProblemUpdateStore } from "@/store/problemUpdateStore";
import { useConfirm } from "primevue/useconfirm";
import ProblemBoardUpdateSolution from "./components/ProblemBoardUpdateSolution.vue";
import ProblemBoardUpdateContent from "./components/ProblemBoardUpdateContent.vue";
import ProblemBoardUpdateHeader from "./components/ProblemBoardUpdateHeader.vue";

const route = useRoute();
const router = useRouter();
const problemStore = useProblemStore();
const authStore = useAuthStore();
const problemUpdateStore = useProblemUpdateStore();
const confirm = useConfirm();

// 라우트 파라미터 변경 감지 및 데이터 로드
watchEffect(async () => {
  const problemId = route.params.problemId;
  if (!problemId) return;
  
  try {
    await Promise.all([
      problemStore.loadProblem(problemId),
      problemUpdateStore.loadProblem(problemId),
    ]);
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
});

// problemId가 변경될 때마다 스토어 초기화
watch(
  () => route.params.problemId,
  () => problemUpdateStore.resetStore(),
  { immediate: true }
);

// 취소 처리
const handleCancel = () => {
  confirm.require({
    message: "정말 수정을 취소하시겠습니까?",
    header: "수정 취소 확인",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      problemUpdateStore.cancelEdit();
      router.back();
    },
  });
};

// 저장 처리
const handleSave = async () => {
  if (await problemUpdateStore.saveProblem()) {
    router.push(`/problem-board/${route.params.problemId}`);
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <ProblemBoardUpdateHeader
      :problem="problemStore.problem"
      :author="problemStore.author"
      :hasLiked="problemStore.hasLiked"
      :likeCount="likeCount"
      @toggle-like="handleToggleLike"
      @menu-action="handleMenuAction"
    />

    <ProblemBoardUpdateContent :problem="problemStore.problem" />

    <ProblemBoardUpdateSolution
      :answer="problemStore.problem?.answer"
      :explanation="problemStore.problem?.explanation"
      :source="problemStore.problem?.origin_source"
    />
  </div>
</template>
