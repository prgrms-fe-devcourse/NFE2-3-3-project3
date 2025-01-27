<script setup>
import { ref, watch, watchEffect } from "vue";
import { useAuthStore } from "@/store/authStore";
import { commentAPI } from "@/api/comment";
import { formatDateForComment } from "@/utils/formatDateForComment";
import { supabase } from "@/api/index.js";
import Avatar from "primevue/avatar";
import { useToast } from "primevue/usetoast";
import { RouterLink } from "vue-router";
const toast = useToast();

const props = defineProps({
  comments: Array,
  isLoading: Boolean,
  currentPage: Number,
  totalPages: Number,
  value: String,
  problemId: Number,
});

const emit = defineEmits(["update:value", "submit-comment", "page-change"]);

const authStore = useAuthStore();
const userId = ref(authStore.user?.id);

const isCommentAuthor = (commentUid) => {
  return commentUid === authStore.user?.id;
};

watch(
  () => authStore.user,
  (newUser) => {
    userId.value = newUser?.id;
  },
  { immediate: true },
);

const handleKeyPress = async (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    await handleSubmitComment();
  }
};

const handleSubmitComment = async () => {
  if (!props.value.trim()) return;
  if (!userId.value) {
    alert("로그인이 필요한 기능입니다.");
    return;
  }
  const newComment = await commentAPI.createComment({
    problem_id: props.problemId,
    comment: props.value,
    uid: userId.value,
  });
  const userProfile = await getUserProfile(userId.value);
  formattedComments.value.push({
    id: newComment.id,
    comment: newComment.comment,
    uid: newComment.uid,
    created_at: newComment.created_at,
    avatar_url: userProfile.avatar_url,
    name: userProfile.name,
    formattedDate: formatDateForComment(new Date(newComment.created_at)),
  });
  emit("update:value", "");
  emit("submit-comment");
};

const handleDeleteComment = async (id) => {
  try {
    const response = await commentAPI.deleteComment(id);
    if (response) {
      toast.add({
        severity: "success",
        summary: "삭제 완료",
        detail: "댓글이 삭제되었습니다.",
      });
      formattedComments.value = formattedComments.value.filter(comment => comment.id !== id);
      emit("submit-comment");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.add({
      severity: "error",
      detail: "댓글 삭제 중 오류가 발생했습니다.",
    });
  }
};

const handleEditComment = (comment) => {
  // 수정 로직 구현 필요
  console.log("Edit comment:", comment);
};

const onPageChange = (event) => {
  emit("page-change", event.page);
};

const getUserProfile = async (uid) => {
  const { data, error } = await supabase
    .from("user_info")
    .select("avatar_url, name")
    .eq("id", uid)
    .single();

  if (error) {
    console.error("프로필 로딩 실패:", error);
    return { avatar_url: "", name: "Unknown" };
  }

  return data;
};

const formattedComments = ref([]);

watchEffect(async () => {
  const comments = await Promise.all(
    props.comments.map(async (comment) => {
      const userProfile = await getUserProfile(comment.uid);
      return {
        ...comment,
        avatar_url: userProfile.avatar_url,
        name: userProfile.name,
        formattedDate: formatDateForComment(new Date(comment.created_at)),
      };
    }),
  );
  formattedComments.value = comments;
});
</script>

<template>
  <div class="w-full">
    <div v-if="isLoading" class="flex justify-center py-4">
      <i class="pi pi-spinner pi-spin"></i>
    </div>

    <div v-else class="w-full">
      <h3 class="text-gray-700 text-2xl mb-6">댓글</h3>
      <div
        v-if="comments?.length === 0"
        class="text-center text-gray-500 py-4 mb-"
      >
        첫 번째 댓글을 작성해보세요.
      </div>
      <div
        v-else
        v-for="comment in formattedComments"
        :key="comment.id"
        class="mb-10"
      >
          <div class="flex justify-between items-center mb-2">
            <!-- 유저 프로필 -> 클릭시 해당 유저 상세 페이지 -->
            <RouterLink
              to="/"
              aria-label="유저 프로필"
              class="flex items-center gap-2 flex-grow"
            >
              <img :src="comment.avatar_url" class="rounded-full w-7 h-7" />
              <span class="font-bold">{{ comment.name }}</span>
              <span class="text-gray-400 text-sm">{{
                comment.formattedDate
              }}</span>
            </RouterLink>
            <!-- 댓글 수정 / 삭제 버튼 -->
            <div
              v-if="isCommentAuthor(comment.uid)"
              class="flex gap-2 flex-shrink-0"
            >
              <button
                class="w-8 h-8 rounded-full hover:bg-gray-200 transition flex items-center justify-center"
                @click="handleEditComment(comment)"
              >
                <i class="pi pi-pencil text-gray-400"></i>
              </button>
              <button
                class="w-8 h-8 rounded-full hover:bg-gray-200 transition flex items-center justify-center"
                @click="handleDeleteComment(comment.id)"
              >
                <i class="pi pi-trash text-gray-400"></i>
              </button>
            </div>
          </div>
          <p class="text-gray-500">{{ comment.comment }}</p>
      </div>
    </div>

    <textarea
      :value="value"
      @input="emit('update:value', $event.target.value)"
      @keypress="handleKeyPress"
      class="w-full h-32 resize-none pt-3 px-6 rounded-lg text-sm bg-gray-100 border border-gray-300"
      placeholder="문제집에 대해 어떻게 생각하시나요?"
    ></textarea>

    <Paginator
      :rows="10"
      :totalRecords="totalPages"
      :page="currentPage"
      @page="onPageChange"
    />
  </div>
</template>