<script setup>
import { ref } from "vue";
import search from "@/assets/icons/problem-set-board/search.svg";

const keyword = ref("");
const emit = defineEmits(["search"]);

const handleSearch = () => {
  emit("search", keyword.value);
};
</script>

<template>
  <div
    class="flex justify-between items-center bg-beige-2 has-[:focus]:border-orange-1 rounded-2xl h-12 p-4 border border-black-4"
  >
    <input
      v-model="keyword"
      type="text"
      class="w-full bg-transparent outline-none"
      placeholder="제목, 설명으로 검색"
      @keyup.enter="handleSearch"
    />
    <button @click="handleSearch" class="bg-transparent">
      <img :src="search" alt="검색 아이콘" />
    </button>
  </div>
</template>