<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProblemStore } from "@/store/problemStore";
import { useAuthStore } from "@/store/authStore";
import ProblemUpdateHeader from "./components/ProblemUpdateHeader.vue";
import ProblemUpdateContent from "./components/ProblemUpdateContent.vue";
import ProblemUpdateSolution from "./components/ProblemUpdateSolution.vue";

const route = useRoute();
const router = useRouter();
const problemStore = useProblemStore();
const authStore = useAuthStore();

// 상태 관리
const showConfirmDialog = ref(false);

// 페이지 변경 핸들러
const handlePageChange = (page) => {
  loadComments(page + 1); // PrimeVue의 Paginator는 0-based index 사용
};

// 메뉴 액션 처리
const handleMenuAction = (action) => {
  switch (action) {
    case "edit":
      router.push(`/problem-board-update/${route.params.problemId}`);
      break;
    case "delete":
      showConfirmDialog.value = true;
      break;
    default:
      break;
  }
};

onMounted(async () => {
  await Promise.all([
    problemStore.loadProblem(route.params.problemId),
    checkLikeStatus(),
    loadComments(),
  ]);
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <ProblemUpdateHeader
      :problem="problemStore.problem"
      :author="problemStore.author"
      :hasLiked="problemStore.hasLiked"
      :likeCount="likeCount"
      @toggle-like="handleToggleLike"
      @menu-action="handleMenuAction"
    />

    <ProblemUpdateContent :problem="problemStore.problem" />

    <ProblemUpdateSolution
      :answer="problemStore.problem?.answer"
      :explanation="problemStore.problem?.explanation"
      :source="problemStore.problem?.origin_source"
    />
  </div>
</template>