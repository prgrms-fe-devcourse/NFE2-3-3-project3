<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Dialog, Button } from "primevue";
import { useProblemStore } from "@/store/problemStore";
import { useAuthStore } from "@/store/authStore";
import { problemLikeAPI } from "@/api/problemLike";
import { commentAPI } from "@/api/comment";

import ProblemHeader from "./components/ProblemHeader.vue";
import ProblemContent from "./components/ProblemContent.vue";
import ProblemSolution from "./components/ProblemSolution.vue";
import CommentList from "./components/CommentList.vue";

const route = useRoute();
const router = useRouter();
const problemStore = useProblemStore();
const authStore = useAuthStore();

// 상태 관리
const showConfirmDialog = ref(false);
const hasLiked = ref(false);
const likeCount = ref(0);

// 댓글 관련 상태
const comments = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);
const isLoadingComments = ref(false);
const commentValue = ref("");

// 댓글 불러오기
const loadComments = async (page = 1) => {
  try {
    isLoadingComments.value = true;
    const response = await commentAPI.getComments({
      problem_id: parseInt(route.params.problemId),
      workbook_id: problemStore.problem.workbook_id,
      page,
      pageSize: 10,
    });

    comments.value = response.data;
    currentPage.value = response.currentPage;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error("댓글 로딩 실패:", error);
  } finally {
    isLoadingComments.value = false;
  }
};

// 댓글 작성
const handleSubmitComment = async () => {
  if (!commentValue.value.trim()) return;
  if (!authStore.user?.id) {
    alert("로그인이 필요한 기능입니다.");
    return;
  }

  try {
    await commentAPI.createComment({
      problem_id: parseInt(route.params.problemId),
      workbook_id: problemStore.problem.workbook_id, // workbook_id 추가
      content: commentValue.value,
      uid: authStore.user.id,
    });

    commentValue.value = "";
    await loadComments(currentPage.value); // 현재 페이지 리로드
  } catch (error) {
    console.error("댓글 작성 실패:", error);
  }
};

// 페이지 변경 핸들러
const handlePageChange = (page) => {
  loadComments(page + 1);
};

// 좋아요 상태 확인
const checkLikeStatus = async () => {
  try {
    if (!authStore.user?.id) return;
    const response = await problemLikeAPI.getUid(authStore.user.id);
    hasLiked.value = response?.data?.some(
      (like) => like.problem_id === parseInt(route.params.problemId),
    );
  } catch (error) {
    console.error("좋아요 상태 확인 실패:", error);
  }
};

// 좋아요 토글
const handleToggleLike = async () => {
  if (!authStore.user?.id) {
    alert("로그인이 필요한 기능입니다.");
    return;
  }

  try {
    await problemLikeAPI.add(
      authStore.user.id,
      parseInt(route.params.problemId),
    );
    hasLiked.value = !hasLiked.value;
    likeCount.value = hasLiked.value
      ? likeCount.value + 1
      : likeCount.value - 1;
  } catch (error) {
    console.error("좋아요 토글 실패:", error);
  }
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
    <ProblemHeader
      :problem="problemStore.problem"
      :author="problemStore.author"
      :hasLiked="problemStore.hasLiked"
      :likeCount="likeCount"
      @toggle-like="handleToggleLike"
      @menu-action="handleMenuAction"
    />

    <ProblemContent :problem="problemStore.problem" />

    <ProblemSolution
      :answer="problemStore.problem?.answer"
      :explanation="problemStore.problem?.explanation"
      :source="problemStore.problem?.origin_source"
    />

    <CommentList
      :comments="comments"
      :isLoading="isLoadingComments"
      :currentPage="currentPage"
      :totalPages="totalPages"
      v-model:value="commentValue"
      :problemId="route.params.problemId"
      :workbookId="problemStore.problem.workbook_id"
      @submit-comment="handleSubmitComment"
      @page-change="handlePageChange"
    />

    <!-- 삭제 확인 다이얼로그 -->
    <Dialog
      v-model:visible="showConfirmDialog"
      header="삭제 확인"
      :modal="true"
    >
      <p>정말로 이 게시물을 삭제하시겠습니까?</p>
      <template #footer>
        <Button
          label="취소"
          severity="secondary"
          @click="showConfirmDialog = false"
        />
        <Button
          label="삭제"
          severity="danger"
          @click="showConfirmDialog = false"
        />
      </template>
    </Dialog>
  </div>
</template>