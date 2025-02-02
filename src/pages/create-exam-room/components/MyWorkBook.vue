<script setup>
import shareIcon from "@/assets/icons/my-problem-sets/share.svg";
import { watchEffect, ref } from "vue";
import { workbookAPI } from "@/api/workbook.js";

const props = defineProps({
  visibleMyBooks: {
    required: true,
  },
});

const books = ref([]);
const emit = defineEmits(["select-workbook"]);

const handleSelect = (book) => {
  // 선택된 문제집 로깅
  console.log('Selected workbook:', book);
  emit("select-workbook", book);
};

watchEffect(async () => {
  if (props.visibleMyBooks) {
    books.value = await Promise.all(
      props.visibleMyBooks.map(async (book) => {
        try {
          const count = await workbookAPI.getWorkbookProblemCount(book.id);
          console.log('Problem count:', count);
          return {
            ...book,
            problem_count: count,
          };
        } catch (error) {
          console.error(`문제집 ${book.id}의 문제 수 조회 실패:`, error);
          return {
            ...book,
            problem_count: 0,
          };
        }
      }),
    );
  }
});
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <div
      v-for="book in books"
      :key="book.id"
      class="w-[calc((100% - 4rem) / 3)] h-[146px] p-4 bg-orange-3 rounded-lg flex flex-col justify-between cursor-pointer hover:bg-orange-200 transition-colors"
      @click="handleSelect(book)"
    >
      <div>
        <h3 class="font-medium">{{ book.title || "제목 없음" }}</h3>
        <p class="text-sm text-gray-600 truncate">
          {{ book.description || "설명 없음" }}
        </p>
      </div>
      <div class="flex justify-between items-center mt-2">
        <img v-if="book.shared" :src="shareIcon" alt="share" />
        <span v-else class="w-6"></span>
        <p class="text-sm font-medium">{{ book.problem_count || 0 }}문제</p>
      </div>
    </div>
  </div>
</template>
