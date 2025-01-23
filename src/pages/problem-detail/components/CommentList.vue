<script setup>
import Comment from "@/components/layout/Comment.vue";
import { Paginator } from "primevue";

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
</script>

<template>
  <div class="w-[876px] flex flex-col gap-4">
    <div class="text-[24px] text-[#6A718B]">댓글</div>

    <div v-if="isLoading" class="flex justify-center py-4">
      <i class="pi pi-spinner pi-spin"></i>
    </div>

    <div v-else class="w-[862px]">
      <div v-if="comments?.length === 0" class="text-center text-gray-500 py-4">
        첫 번째 댓글을 작성해보세요.
      </div>
      <Comment
        v-else
        v-for="comment in comments"
        :comment="comment"
        :key="comment.id"
      />
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
