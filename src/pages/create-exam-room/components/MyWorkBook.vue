<script setup>
import shareIcon from "@/assets/icons/my-problem-sets/share.svg";

const props = defineProps({
  visibleMyBooks: {
    required: true,
  },
});

const emit = defineEmits(['select-workbook']);

const handleSelect = (book) => {
  // 선택된 문제집 로깅
  // console.log('Selected workbook:', book);
  emit('select-workbook', book);
};
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <div
      v-for="book in visibleMyBooks"
      :key="book.id"
      class="w-[calc((100% - 4rem) / 3)] h-[146px] p-4 bg-orange-3 rounded-lg flex flex-col justify-between cursor-pointer hover:bg-orange-200 transition-colors"
      @click="handleSelect(book)"
    >
      <div>
        <h3 class="font-medium">{{ book.title || '제목 없음' }}</h3>
        <p class="text-sm text-gray-600 truncate">{{ book.description || '설명 없음' }}</p>
      </div>
      <div class="flex justify-between items-center mt-2">
        <img :src="shareIcon" alt="share" />
        <p class="text-sm font-medium">{{ book.problem_count || 0 }}문제</p>
      </div>
    </div>
  </div>
</template>