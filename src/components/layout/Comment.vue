<script setup>
import { ref, onMounted } from "vue";

import { authAPI } from "@/api/auth";
import { commentAPI } from "@/api/comment";

const { comment } = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

const text = ref(null);
const userId = ref(null);
const isReadOnly = ref(true);
const commentUid = ref(null);
const isVisible = ref(true);

const commentUpdate = async () => {
  isReadOnly.value ? (isReadOnly.value = false) : (isReadOnly.value = true);
  if (isReadOnly.value) {
    await commentAPI.updateComment(comment.id, {
      comment: text.value,
      updated_at: new Date().toISOString(),
    });
  }
};

const commentDelete = async () => {
  const realDelete = confirm("정말 삭제하시겠습니까?");
  if (realDelete) {
    isVisible.value = false;
    await commentAPI.deleteComment(comment.id);
  }
  return;
};

onMounted(async () => {
  const userinfo = await authAPI.getCurrentUser();
  userId.value = userinfo.id;
  commentUid.value = comment.uid;
  text.value = comment.comment;
});
</script>
<template>
  <div class="my-8" v-if="isVisible">
    <div class="flex justify-between">
      <div class="flex items-center mb-1">
        <div class="text-[16px] font-pretend">{{ comment.user_name }}</div>
        <div class="text-[12px] text-[#b1b1b1] ml-[5px] mt-[1px]">
          {{ comment.updated_at.split("T")[0] }}
        </div>
      </div>

      <div class="flex w-[92px] justify-between" v-if="userId === commentUid">
        <button
          @click="commentUpdate"
          class="rounded-lg bg-[#f0f0f0] h-[17px] w-[42px] text-[10px] flex items-center justify-center"
        >
          <img
            src="../../assets/icons/comment/update.svg"
            alt="댓글 수정"
            class="w-3 h-3 mr-1"
          />
          <span>수정</span>
        </button>

        <button
          @click="commentDelete"
          class="rounded-lg bg-[#f0f0f0] h-[17px] w-[42px] text-[10px] flex items-center justify-center"
        >
          <img
            src="../../assets/icons/comment/delete.svg"
            alt="댓글 삭제"
            class="w-3 h-3 mr-1"
          />
          <span>삭제</span>
        </button>
      </div>
    </div>
    <div>
      <textarea
        name=""
        id=""
        :class="
          isReadOnly
            ? 'text-[14px] resize-none w-full'
            : 'text-[14px] resize-none border border-solid border-black w-full'
        "
        v-model="text"
        :readonly="isReadOnly"
      ></textarea>
    </div>
  </div>
</template>
<style scoped></style>
