<script setup>
import { ref, onMounted } from "vue";
import Comment from "@/components/layout/Comment.vue";
import { commentAPI } from "@/api/comment";
import { authAPI } from "@/api/auth";

const prpos = defineProps({
  comments: {
    type: Array,
    required: true,
  },
  workbookId: {
    type: String,
  },
  currentPage: Number,
  totalPages: Number,
});

const text = ref(null);
const userId = ref(null);

const onPageChange = (event) => {
  emit("page-change", event.page);
};

const handleKeyPress = async (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    await handleSubmitComment();
  }
};
const handleSubmitComment = async () => {
  if (!text.value.trim()) return;
  await commentAPI.createComment({
    workbook_id: prpos.workbookId,
    comment: text.value,
    uid: userId.value,
  });
  text.value = "";
};

onMounted(async () => {
  const userinfo = await authAPI.getCurrentUser();
  userId.value = userinfo.id;
});
</script>
<template>
  <div class="w-[876px] flex flex-col">
    <div class="text-[24px] text-[#6A718B]">댓글</div>

    <div class="w-[862px]">
      <Comment v-for="comment in prpos.comments" :comment />
    </div>

    <textarea
      v-model="text"
      @keypress="handleKeyPress"
      class="w-full h-[133px] resize-none pt-3 px-6 rounded-lg pretend text-[14px] bg-[#f0f0f0] border-[#d4d4d4]"
      placeholder="문제집에 대해 어떻게 생각하시나요?"
    ></textarea>
  </div>
  <Paginator
    :rows="10"
    :totalRecords="totalPages"
    :page="currentPage"
    @page="onPageChange"
  />
</template>
<style scoped></style>
