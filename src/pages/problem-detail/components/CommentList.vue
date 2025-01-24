<script setup>
import { ref, watch, watchEffect, computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { commentAPI } from "@/api/comment";
import { formatDateForComment } from "@/utils/formatDateForComment";
import { supabase } from "@/api/index.js";
import Panel from "primevue/panel";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  value: {
    type: String,
    default: "",
  },
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
  await commentAPI.createComment({
    problem_id: props.problemId,
    comment: props.value,
    uid: userId.value,
  });
  emit("update:value", "");
  emit("submit-comment");
};

const handleDeleteComment = async (id) => {
  try {
    console.log('Comment ID:', id, typeof id); // id 값과 타입 확인
    const response = await commentAPI.deleteComment(id);
    console.log('Delete response:', response);

    if (response) {
      toast.add({
        severity: 'success', 
        summary: '삭제 완료',
        detail: '댓글이 삭제되었습니다.'
      });
      emit("submit-comment");
    }
  } catch (error) {
    console.error('Delete error:', error);
    toast.add({
      severity: 'error',
      detail: '댓글 삭제 중 오류가 발생했습니다.'
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
      <div v-if="comments?.length === 0" class="text-center text-gray-500 py-4">
        첫 번째 댓글을 작성해보세요.
      </div>
      <Comment
        v-else
        v-for="comment in comments"
        :comment="comment"
        :key="comment.id"
        class="mb-4"
      >
        <Panel class="w-full">
          <template #header>
            <div class="flex items-center gap-2">
              <Avatar :image="comment.avatar_url" shape="circle" />
              <span class="font-bold">{{ comment.name }}</span>
              <span class="text-gray-500 text-sm">{{
                comment.formattedDate
              }}</span>
            </div>
          </template>
          <p>{{ comment.comment }}</p>
          <template #footer>
            <div
              v-if="isCommentAuthor(comment.uid)"
              class="flex gap-2 w-full justify-end"
            >
              <button
                class="w-8 h-8 rounded-full hover:bg-black-1/5 transition item-middle"
                @click="handleEditComment(comment)"
              >
                <i class="pi pi-pencil text-gray-400"></i>
              </button>
              <button
                class="w-8 h-8 rounded-full hover:bg-black-1/5 transition item-middle"
                @click="handleDeleteComment(comment.id)"
              >
                <i class="pi pi-trash text-gray-400"></i>
              </button>
            </div>
          </template>
        </Panel>
      </div>
    </div>

    <textarea
      :value="value"
      @input="emit('update:value', $event.target.value)"
      class="w-full h-[133px] resize-none pt-3 px-6 rounded-lg pretend text-[14px] bg-[#f0f0f0] border-[#d4d4d4]"
      placeholder="문제집에 대해 어떻게 생각하시나요?"
    ></textarea>

    <Paginator
      :rows="10"
      :totalRecords="totalPages"
      :page="currentPage"
      @page="emit('page-change', $event.page)"
    />
  </div>
</template>
